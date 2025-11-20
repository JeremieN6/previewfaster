<template>
  <section class="space-y-4">
    <header class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">{{ pack.name }}</h3>
        <p class="text-xs text-gray-400 dark:text-gray-500">{{ pack.slides.length }} écrans</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus:outline-none"
        @click="choose(pack.slides[0].id)"
      >
        Choisir ce template
      </button>
    </header>
    <div class="flex gap-4 overflow-x-auto overflow-y-hidden pb-2">
      <div
        v-for="slide in pack.slides"
        :key="slide.id"
        class="relative flex w-[199px] flex-shrink-0 flex-col items-center"
      >
        <div class="relative h-[430px] w-[199px] overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div v-if="needsAssets" class="absolute inset-0 flex items-center justify-center p-4">
            <p class="text-center text-[11px] font-medium text-gray-500 dark:text-gray-400">Upload au moins 5 images pour activer les previews live.</p>
          </div>
          <div v-else class="h-full w-full">
            <TemplatePreview :slide="slide" @select="choose" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import TemplatePreview from './TemplatePreview.vue'
import { useBuilderStore } from '../store/builderStore'

const props = defineProps({
  pack: { type: Object, required: true }
})

const emit = defineEmits(['choose'])
const store = useBuilderStore()
const needsAssets = computed(() => store.state.screenshots.length < 5)

const choose = (slideId) => {
  if (needsAssets.value) return
  emit('choose', slideId)
}
</script>
