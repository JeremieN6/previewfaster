<template>
  <button
    type="button"
    class="group relative mx-auto flex w-full max-w-[120px] flex-col items-center gap-2 rounded-2xl border border-transparent bg-white/0 p-2 text-left transition hover:-translate-y-1 hover:border-indigo-200"
    @click="emitSelect"
  >
    <div class="relative w-full overflow-hidden rounded-[26px] shadow-lg" :style="canvasStyle">
      <div class="relative aspect-[9/16] w-full overflow-hidden rounded-[26px]" :style="backgroundStyle">
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
    <div class="w-full text-left">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ slide.packName }}</p>
      <p class="text-sm font-semibold text-slate-900">{{ slide.name }}</p>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useBuilderStore } from '../store/builderStore'

const props = defineProps({
  slide: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])
const store = useBuilderStore()
const placeholderImage = 'https://placehold.co/400x800/e2e8f0/64748b?text=Ajoute+tes+captures'

const overrides = computed(() => store.getSlideOverride(props.slide.id))

const activeScreenshot = computed(() => {
  const overrideId = overrides.value?.screenshotId
  if (overrideId) {
    return store.state.screenshots.find((shot) => shot.id === overrideId) || null
  }
  return store.state.screenshots[0] || null
})

const activeTextCard = computed(() => {
  const overrideId = overrides.value?.textCardId
  if (overrideId) {
    return store.state.textCards.find((card) => card.id === overrideId) || store.state.textCards[0]
  }
  return store.state.textCards[0] || null
})

const background = computed(() => overrides.value?.background || props.slide.background)

const backgroundStyle = computed(() => {
  if (!background.value) return {}
  if (background.value.mode === 'gradient') {
    return {
      backgroundImage: `linear-gradient(180deg, ${background.value.gradientStart}, ${background.value.gradientEnd})`
    }
  }
  return { backgroundColor: background.value.solid }
})

const canvasStyle = computed(() => ({ backgroundColor: 'rgba(15, 23, 42, 0.04)' }))

const screenshotStyle = computed(() => ({
  width: props.slide.screenshotArea.width,
  height: props.slide.screenshotArea.height,
  top: props.slide.screenshotArea.top,
  left: props.slide.screenshotArea.left,
  boxShadow: props.slide.screenshotArea.shadow,
  position: 'absolute'
}))

const textZoneStyle = (zone) => ({
  position: 'absolute',
  top: zone.top,
  left: zone.left,
  width: zone.width
})

const emitSelect = () => {
  emit('select', props.slide.id)
}
</script>
