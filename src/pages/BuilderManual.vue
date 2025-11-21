<template>
  <section class="bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <LandingNav />

    <main class="bg-gradient-to-b from-gray-50 via-white to-white py-12 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <div class="mb-10">
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">Builder Custom</p>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Prépare ton pack à la main.</h1>
            <p class="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Garde les mêmes outils d'import à gauche et construis tes templates manuellement dans la zone prévue à droite.
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

            <div class="">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Zone templates manuelles</p>
                <h3 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Commence ici</h3>
                <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Ajoute ton propre rendu à cet emplacement. Remplace ce bloc par tes composants quand tu es prêt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <LandingNewsletter />
    <LandingFooter />
  </section>
</template>

<script setup>
import LandingNav from '../components/landing/LandingNav.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
import LandingNewsletter from '../components/landing/LandingNewsletter.vue'
import ScreenshotUploader from '../components/ScreenshotUploader.vue'
import TextCardsEditor from '../components/TextCardsEditor.vue'
import Sidebar from '../components/Sidebar.vue'
</script>
