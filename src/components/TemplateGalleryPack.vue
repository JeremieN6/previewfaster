<template>
  <section class="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="space-y-2">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{{ pack.category || 'Template pack' }}</p>
        <div class="flex flex-wrap items-center gap-3">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ pack.name }}</h3>
          <span class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-100">{{ screens.length }} écrans</span>
        </div>
        <p class="max-w-2xl text-sm text-gray-500 dark:text-gray-400">{{ pack.description }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in pack.tags"
            :key="tag"
            class="rounded-full border border-gray-200 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400"
            >{{ tag }}</span
          >
        </div>
      </div>
      <div class="flex flex-col gap-2 text-sm font-semibold">
        <a
          v-if="pack.sourceUrl"
          class="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-gray-600 transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200"
          :href="pack.sourceUrl"
          target="_blank"
          rel="noreferrer"
        >
          Voir la source
        </a>
        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-500"
          @click="$emit('select', pack.id)"
        >
          Utiliser ce pack
        </button>
      </div>
    </div>

    <div class="relative mt-6">
      <button
        type="button"
        class="absolute left-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white text-xl font-bold text-gray-500 shadow-lg transition hover:bg-blue-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        @click="scroll(-1)"
      >
        <span aria-hidden="true">‹</span>
        <span class="sr-only">Précédent</span>
      </button>
      <div ref="carouselRef" class="no-scrollbar flex gap-4 overflow-x-auto pb-4">
        <article
          v-for="screen in screens"
          :key="screen.id"
          class="relative flex w-[220px] flex-shrink-0 flex-col rounded-3xl border border-gray-100 bg-gradient-to-b from-white to-gray-50 p-3 shadow-sm dark:border-gray-800 dark:from-gray-800 dark:to-gray-900"
        >
          <header class="flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Écran {{ screen.order }}</p>
              <p class="text-xs font-semibold text-gray-700 dark:text-gray-100 line-clamp-2">{{ screen.title || 'Sans titre' }}</p>
            </div>
          </header>
          <div class="mt-3 h-[360px] overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-inner dark:border-gray-700">
            <img :src="screen.media?.src" :alt="screen.title || screen.id" class="h-full w-full object-cover" loading="lazy" />
          </div>
          <p class="mt-3 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">{{ screen.subtitle || screen.caption || 'Aperçu écran' }}</p>
        </article>
      </div>
      <button
        type="button"
        class="absolute right-0 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full border border-gray-200 bg-white text-xl font-bold text-gray-500 shadow-lg transition hover:bg-blue-50 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
        @click="scroll(1)"
      >
        <span aria-hidden="true">›</span>
        <span class="sr-only">Suivant</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  pack: { type: Object, required: true }
})

defineEmits(['select'])

const carouselRef = ref(null)
const screens = props.pack?.data?.screens?.map((screen, index) => ({
  ...screen,
  order: index + 1
})) || []

const scroll = (direction) => {
  if (!carouselRef.value) return
  carouselRef.value.scrollBy({ left: direction * 260, behavior: 'smooth' })
}
</script>

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
