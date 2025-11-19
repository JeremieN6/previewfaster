<template>
  <teleport to="body">
    <div v-if="open && slide" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-10">
      <div class="relative w-full max-w-6xl rounded-3xl bg-white shadow-2xl">
        <button
          type="button"
          class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          @click="emitClose"
        >
          <span class="sr-only">Fermer</span>
          ✕
        </button>
        <div class="grid grid-cols-1 gap-8 p-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Édition</p>
            <h3 class="mt-1 text-3xl font-semibold text-slate-900">{{ slide.packName }} · {{ slide.name }}</h3>
            <div class="mt-6 flex justify-center">
              <div
                ref="canvasRef"
                class="relative w-full max-w-md overflow-hidden rounded-[36px] border border-slate-200 shadow-2xl"
                :style="{ backgroundColor: 'rgba(15,23,42,0.04)' }"
              >
                <div class="relative aspect-[9/16] w-full overflow-hidden rounded-[36px]" :style="backgroundStyle">
                  <div class="absolute inset-0">
                    <div class="absolute" :style="screenshotStyle">
                      <div class="h-full w-full overflow-hidden" :style="{ borderRadius: slide.screenshotArea.borderRadius }">
                        <img
                          :src="activeScreenshot?.url || placeholderImage"
                          alt="Screenshot"
                          class="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <template v-for="zone in slide.textZones" :key="zone.id">
                      <div class="absolute" :style="textZoneStyle(zone)" v-if="activeTextCard">
                        <p :class="zone.className">
                          {{ zone.id === 'title' ? activeTextCard.title : activeTextCard.subtitle }}
                        </p>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div class="space-y-5">
              <div>
                <label class="text-sm font-semibold text-slate-700">Capture utilisée</label>
                <select
                  v-model="selectedScreenshotId"
                  class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  :disabled="!store.state.screenshots.length"
                >
                  <option v-for="shot in store.state.screenshots" :key="shot.id" :value="shot.id">
                    {{ shot.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-sm font-semibold text-slate-700">Carte texte</label>
                <select
                  v-model="selectedTextCardId"
                  class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  :disabled="!store.state.textCards.length"
                >
                  <option v-for="card in store.state.textCards" :key="card.id" :value="card.id">
                    {{ card.title }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-sm font-semibold text-slate-700">Mode de fond</label>
                <select
                  v-model="localBackground.mode"
                  class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="solid">Couleur pleine</option>
                  <option value="gradient">Dégradé</option>
                </select>
              </div>

              <div class="grid grid-cols-1 gap-4" v-if="localBackground.mode === 'solid'">
                <label class="text-sm font-semibold text-slate-700">
                  Couleur
                  <input type="color" v-model="localBackground.solid" class="mt-2 h-10 w-full rounded" />
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4" v-else>
                <label class="text-sm font-semibold text-slate-700">
                  Début
                  <input type="color" v-model="localBackground.gradientStart" class="mt-2 h-10 w-full rounded" />
                </label>
                <label class="text-sm font-semibold text-slate-700">
                  Fin
                  <input type="color" v-model="localBackground.gradientEnd" class="mt-2 h-10 w-full rounded" />
                </label>
              </div>

              <button
                type="button"
                class="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                :disabled="isExporting || !store.state.screenshots.length"
                :class="{ 'opacity-70': isExporting || !store.state.screenshots.length }"
                @click="exportPng"
              >
                {{ isExporting ? 'Export en cours…' : 'Exporter en PNG 1080×1920' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import domtoimage from 'dom-to-image-more'
import { useBuilderStore } from '../store/builderStore'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  slide: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])
const store = useBuilderStore()
const canvasRef = ref(null)
const placeholderImage = 'https://placehold.co/640x1280/e2e8f0/94a3b8?text=Ajoute+tes+captures'
const selectedScreenshotId = ref(null)
const selectedTextCardId = ref(null)
const localBackground = ref({ mode: 'solid', solid: '#0f172a', gradientStart: '#0f172a', gradientEnd: '#2563eb' })
const isExporting = ref(false)

const overrides = computed(() => (props.slide ? store.getSlideOverride(props.slide.id) : null))
const activeScreenshot = computed(() => {
  if (!props.slide) return null
  const overrideId = selectedScreenshotId.value || overrides.value?.screenshotId
  return store.state.screenshots.find((shot) => shot.id === overrideId) || store.state.screenshots[0] || null
})
const activeTextCard = computed(() => {
  if (!props.slide) return null
  const overrideId = selectedTextCardId.value || overrides.value?.textCardId
  return store.state.textCards.find((card) => card.id === overrideId) || store.state.textCards[0] || null
})
const backgroundStyle = computed(() => {
  if (!props.slide) return {}
  if (localBackground.value.mode === 'gradient') {
    return {
      backgroundImage: `linear-gradient(180deg, ${localBackground.value.gradientStart}, ${localBackground.value.gradientEnd})`
    }
  }
  return { backgroundColor: localBackground.value.solid }
})
const screenshotStyle = computed(() => {
  if (!props.slide) return {}
  return {
    width: props.slide.screenshotArea.width,
    height: props.slide.screenshotArea.height,
    top: props.slide.screenshotArea.top,
    left: props.slide.screenshotArea.left,
    boxShadow: props.slide.screenshotArea.shadow,
    position: 'absolute'
  }
})
const textZoneStyle = (zone) => ({
  position: 'absolute',
  top: zone.top,
  left: zone.left,
  width: zone.width
})

const syncFromSlide = () => {
  if (!props.slide) return
  const override = overrides.value
  selectedScreenshotId.value = override?.screenshotId || store.state.screenshots[0]?.id || null
  selectedTextCardId.value = override?.textCardId || store.state.textCards[0]?.id || null
  localBackground.value = {
    mode: override?.background?.mode || props.slide.background.mode,
    solid: override?.background?.solid || props.slide.background.solid,
    gradientStart: override?.background?.gradientStart || props.slide.background.gradientStart,
    gradientEnd: override?.background?.gradientEnd || props.slide.background.gradientEnd
  }
}

watch(
  () => props.slide,
  () => {
    syncFromSlide()
  },
  { immediate: true }
)

watch(
  [selectedScreenshotId, selectedTextCardId, localBackground],
  () => {
    if (!props.slide) return
    store.setSlideOverride(props.slide.id, {
      screenshotId: selectedScreenshotId.value || store.state.screenshots[0]?.id || null,
      textCardId: selectedTextCardId.value || store.state.textCards[0]?.id || null,
      background: { ...localBackground.value }
    })
  },
  { deep: true }
)

watch(
  () => store.state.screenshots.length,
  () => {
    if (!store.state.screenshots.find((shot) => shot.id === selectedScreenshotId.value)) {
      selectedScreenshotId.value = store.state.screenshots[0]?.id || null
    }
  }
)

watch(
  () => store.state.textCards.length,
  () => {
    if (!store.state.textCards.find((card) => card.id === selectedTextCardId.value)) {
      selectedTextCardId.value = store.state.textCards[0]?.id || null
    }
  }
)

const emitClose = () => {
  emit('close')
}

const exportPng = async () => {
  if (!canvasRef.value || !props.slide) return
  isExporting.value = true
  try {
    const dataUrl = await domtoimage.toPng(canvasRef.value, {
      quality: 1,
      width: 1080,
      height: 1920
    })
    const link = document.createElement('a')
    link.download = `${props.slide.name}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Export PNG failed', error)
  } finally {
    isExporting.value = false
  }
}
</script>
