<template>
  <section class="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
    <LandingNav />
    <main class="bg-gradient-to-b from-gray-50 via-white to-white py-12 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header class="mb-12 space-y-3">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">Template catalog</p>
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Choisis un pack en un clic</h1>
          <p class="max-w-3xl text-base text-gray-500 dark:text-gray-400">
            Toutes les collections importées automatiquement depuis scrnshts.club et autres sources. Chaque pack contient les métadonnées nécessaires
            pour être utilisé dans Builder Manual.
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500">Catalogue version {{ catalogMeta.version }} · Maj {{ formattedDate }}</p>
        </header>

        <div class="space-y-10">
          <TemplateGalleryPack v-for="pack in templateCatalog" :key="pack.id" :pack="pack" @select="handleSelect" />
        </div>
      </div>
    </main>
    <LandingNewsletter />
    <LandingFooter />
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import LandingNav from '../components/landing/LandingNav.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
import LandingNewsletter from '../components/landing/LandingNewsletter.vue'
import TemplateGalleryPack from '../components/TemplateGalleryPack.vue'
import { templateCatalog, catalogMeta } from '../data/templates/catalog'

const router = useRouter()
const formattedDate = computed(() => new Date(catalogMeta.lastUpdate).toLocaleDateString('fr-FR'))

const handleSelect = (packId) => {
  router.push({ name: 'builder-manual', query: { packId } })
}
</script>
