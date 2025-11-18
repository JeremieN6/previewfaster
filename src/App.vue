<template>
  <div :class="isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'" class="min-h-screen transition-colors">
    <div class="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.25em] text-slate-400">PreviewFast</p>
          <h1 class="text-4xl font-semibold text-slate-900 dark:text-white">Mockup Builder</h1>
          <p class="text-slate-500 dark:text-slate-300">Créez vos mockups d'application mobile avec des options Vue.</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          @click="toggleDarkMode"
        >
          <span>{{ isDark ? 'Mode clair' : 'Mode sombre' }}</span>
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        </button>
      </header>

      <section class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-sm text-slate-500 dark:text-slate-300">Exportez rapidement l'ensemble de votre design personnalisé.</p>
          </div>
          <button
            type="button"
            class="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:bg-brand-300"
            :disabled="!lastEditedDesignId"
            @click="() => lastEditedDesignId && downloadDesign(lastEditedDesignId)"
          >
            {{ globalDownloadLabel }}
          </button>
        </div>
      </section>

      <section v-for="design in designSections" :key="design.id" :data-design="design.id" class="design-section" :data-design-name="design.id">
        <div class="design-header">
          <h2 class="design-title">{{ design.title }}</h2>
          <button class="download-design-btn" type="button" :disabled="isDownloading(design.id)" @click="downloadDesign(design.id)">
            <span v-if="!isDownloading(design.id)">{{ design.downloadLabel }}</span>
            <span v-else>Export...</span>
          </button>
        </div>
        <div class="cards-container">
          <CardRenderer
            v-for="card in design.cards"
            :key="card.id"
            :card="card"
            :register-card-ref="registerCard(card.id)"
            @open-options="openOptions"
          />
        </div>
      </section>
    </div>

    <OptionPanel
      :open="panelOpen"
      :card="activeCard"
      :options="currentOptions"
      :active-option-key="activeOptionKey"
      @close="panelOpen = false"
      @select-option="(key) => (activeOptionKey = key)"
      @save="handleOptionSave"
    />
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import CardRenderer from './components/CardRenderer.vue'
import OptionPanel from './components/OptionPanel.vue'
import { initialDesignSections } from './data/designs'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

const designSections = ref(createDesignState())
const isDark = ref(false)
const panelOpen = ref(false)
const activeCardId = ref(null)
const activeOptionKey = ref(null)
const lastEditedDesignId = ref(null)
const downloadTrack = reactive({})

const cardRefs = new Map()
const cardRegisterMap = new Map()

const allCards = computed(() => {
  return designSections.value.flatMap((section) => section.cards)
})

const activeCard = computed(() => allCards.value.find((card) => card.id === activeCardId.value) || null)
const currentOptions = computed(() => activeCard.value?.options ?? [])

const designLabel = computed(() => {
  const map = new Map(designSections.value.map((section) => [section.id, section.title]))
  return map
})

const globalDownloadLabel = computed(() => {
  if (!lastEditedDesignId.value) return 'Télécharger mon design'
  const label = designLabel.value.get(lastEditedDesignId.value) || `Design ${lastEditedDesignId.value}`
  return `Télécharger ${label}`
})

watch(isDark, (value) => {
  document.documentElement.classList.toggle('dark', value)
})

function toggleDarkMode() {
  isDark.value = !isDark.value
}

function createDesignState() {
  return initialDesignSections.map((section) => ({
    ...section,
    cards: section.cards.map((card) => ({
      ...card,
      background: card.background ? { ...card.background } : null,
      designId: section.id
    }))
  }))
}

function registerCard(cardId) {
  if (!cardRegisterMap.has(cardId)) {
    cardRegisterMap.set(cardId, (el) => {
      if (el) {
        cardRefs.set(cardId, el)
      } else {
        cardRefs.delete(cardId)
      }
    })
  }
  return cardRegisterMap.get(cardId)
}

function openOptions(card) {
  activeCardId.value = card.id
  activeOptionKey.value = card.options?.[0]?.key ?? null
  panelOpen.value = true
  lastEditedDesignId.value = card.designId
}

function handleOptionSave({ key, value }) {
  const card = activeCard.value
  if (!card) return
  if (key === 'background') {
    card.background = { ...value }
  } else {
    card[key] = value
  }
  panelOpen.value = false
}

function isDownloading(designId) {
  return Boolean(downloadTrack[designId])
}

async function downloadDesign(designId) {
  const section = designSections.value.find((design) => design.id === designId)
  if (!section) return
  downloadTrack[designId] = true
  try {
    const zip = new JSZip()
    for (const card of section.cards) {
      const el = cardRefs.get(card.id)
      if (!el) continue
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 2 })
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (blob) {
        zip.file(`${card.id}.png`, blob)
      }
    }
    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(content)
    link.download = `${designId}-previewfast.zip`
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    link.remove()
  } finally {
    downloadTrack[designId] = false
  }
}
</script>
