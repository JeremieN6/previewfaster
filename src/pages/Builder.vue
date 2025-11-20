<template>
  <div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <LandingNav />

    <main class="bg-gradient-to-b from-gray-50 via-white to-white py-12 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class=""><!--rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur dark:bg-gray-900/70-->
          <div class="mb-10">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">Builder Flowbite</p>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Mockups prêts en 3 étapes.</h1>
            <p class="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Uploade 5 à 10 captures, ajoutes tes cartes texte, filtre une catégorie et exporte instantanément 10 slides HD.
            </p>
          </div>

          <div class="grid gap-8 lg:grid-cols-[320px,1fr]">
            <section>
              <Sidebar />
            </section>

            <div class="space-y-6">
              <div class="grid gap-6 lg:grid-cols-2">
                <ScreenshotUploader />
                <TextCardsEditor />
              </div>

              <section class="bg-white/90 p-6 shadow-lg dark:bg-gray-900/80">
                <div class="flex flex-col gap-4 border-b border-gray-100 pb-5 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Templates</p>
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                      {{ filteredSlides.length }} slides · {{ currentCategoryLabel }}
                    </h2>
                  </div>
                  <div class="flex flex-wrap gap-2 text-sm">
                    <span
                      class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                      :class="store.state.screenshots.length >= 5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200'"
                    >
                      {{ store.state.screenshots.length }}/10 captures
                    </span>
                    <span class="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                      {{ store.state.textCards.length }} cartes texte
                    </span>
                  </div>
                </div>

                <p v-if="!canRender" class="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
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
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>

    <LandingNewsletter />
    <LandingFooter />

    <TemplateEditorModal :open="Boolean(activeSlide)" :slide="activeSlide" @close="closeModal" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import TemplatePreview from '../components/TemplatePreview.vue'
import TemplateEditorModal from '../components/TemplateEditorModal.vue'
import LandingNav from '../components/landing/LandingNav.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
import LandingNewsletter from '../components/landing/LandingNewsletter.vue'
import ScreenshotUploader from '../components/ScreenshotUploader.vue'
import TextCardsEditor from '../components/TextCardsEditor.vue'
import { templateSlides } from '../data/templates'
import { useBuilderStore } from '../store/builderStore'

const store = useBuilderStore()

const filteredSlides = computed(() => {
  if (store.state.selectedCategory === 'all') {
    return templateSlides
  }
  return templateSlides.filter((slide) => slide.categories.includes(store.state.selectedCategory))
})

const currentCategoryLabel = computed(() => {
  const labels = {
    all: 'Tous',
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
