<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
      <div class="mb-10">
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Mockup Builder</p>
        <h1 class="mt-2 text-4xl font-bold text-slate-900">Glisse, filtre, exporte.</h1>
        <p class="mt-3 max-w-2xl text-lg text-slate-600">
          Uploade 5 à 10 captures, crée des cartes de texte, puis affiche instantanément 10 templates prêts à exporter.
        </p>
      </div>

      <div class="flex flex-col gap-8 lg:flex-row">
        <Sidebar />

        <section class="flex-1">
          <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
            <div class="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Templates</p>
                <h2 class="text-2xl font-semibold text-slate-900">
                  {{ filteredSlides.length }} slides · catégorie {{ currentCategoryLabel }}
                </h2>
              </div>
              <div class="flex flex-wrap gap-2 text-sm">
                <span
                  class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                  :class="store.state.screenshots.length >= 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                >
                  {{ store.state.screenshots.length }}/10 captures
                </span>
                <span class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  {{ store.state.textCards.length }} cartes texte
                </span>
              </div>
            </div>

            <p v-if="!canRender" class="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Ajoute encore {{ missingScreens }} capture(s) pour débloquer les previews dynamiques.
            </p>

            <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <TemplatePreview
                v-for="slide in filteredSlides"
                :key="slide.id"
                :slide="slide"
                @select="openModal"
              />
            </div>
          </div>
        </section>
      </div>
    </div>

    <TemplateEditorModal :open="Boolean(activeSlide)" :slide="activeSlide" @close="closeModal" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import TemplatePreview from '../components/TemplatePreview.vue'
import TemplateEditorModal from '../components/TemplateEditorModal.vue'
import { templateSlides } from '../data/templates'
import { useBuilderStore } from '../store/builderStore'

const store = useBuilderStore()

const filteredSlides = computed(() =>
  templateSlides.filter((slide) => slide.categories.includes(store.state.selectedCategory))
)

const currentCategoryLabel = computed(() => {
  const labels = {
    business: 'Business',
    education: 'Education',
    finance: 'Finance',
    navigation: 'Navigation',
    shopping: 'Shopping',
    lifestyle: 'Lifestyle'
  }
  return labels[store.state.selectedCategory] || 'Business'
})

const canRender = computed(() => store.state.screenshots.length >= 5)
const missingScreens = computed(() => Math.max(0, 5 - store.state.screenshots.length))
const activeSlide = computed(() =>
  templateSlides.find((slide) => slide.id === store.state.selectedTemplateId) || null
)

const openModal = (slideId) => {
  if (store.state.screenshots.length < 5) return
  store.setSelectedTemplateId(slideId)
}

const closeModal = () => {
  store.closeModal()
}
</script>
