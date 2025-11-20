<template>
  <section class="bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
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

          <div class="grid gap-10 lg:grid-cols-[340px,1fr]">
            <div class="space-y-8">
              <div class="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Importer vos assets</h2>
                <ScreenshotUploader />
                <TextCardsEditor />
              </div>
              <Sidebar />
            </div>

            <div class="space-y-12 overflow-x-auto overflow-y-hidden">
              <TemplatePack
                v-for="pack in visiblePacks"
                :key="pack.id"
                :pack="pack"
                @choose="openModal"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <LandingNewsletter />
    <LandingFooter />

    <TemplateEditorModal :open="Boolean(activeSlide)" :slide="activeSlide" @close="closeModal" />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import TemplatePack from '../components/TemplatePack.vue'
import TemplateEditorModal from '../components/TemplateEditorModal.vue'
import LandingNav from '../components/landing/LandingNav.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
import LandingNewsletter from '../components/landing/LandingNewsletter.vue'
import ScreenshotUploader from '../components/ScreenshotUploader.vue'
import TextCardsEditor from '../components/TextCardsEditor.vue'
import { templateSlides, templatePacks } from '../data/templates'
import { useBuilderStore } from '../store/builderStore'

const store = useBuilderStore()

const filteredSlides = computed(() => {
  if (store.state.selectedCategory === 'all') return templateSlides
  return templateSlides.filter((s) => s.categories.includes(store.state.selectedCategory))
})

const visiblePacks = computed(() => {
  if (store.state.selectedCategory === 'all') return templatePacks
  return templatePacks.filter((p) => p.slides.some((s) => s.categories.includes(store.state.selectedCategory)))
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
