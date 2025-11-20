<template>
  <button
    type="button"
    class="group flex w-full flex-col gap-2"
    @click="emitSelect"
  >
    <div class="relative h-[430px] w-[199px] overflow-hidden rounded-[34px] border border-white/10 bg-slate-900 p-4 shadow" :style="backgroundStyle">
      <div
        v-if="overlayStyle"
        class="pointer-events-none absolute inset-0 rounded-[30px] border border-white/10 opacity-90"
        :style="overlayStyle"
      ></div>
      <div class="relative z-10 flex min-h-[220px] flex-col justify-between">
        <div
          v-if="showLogo"
          class="absolute overflow-hidden rounded-full border border-white/30 bg-white/30 shadow-lg backdrop-blur"
          :style="logoStyle"
        >
          <img :src="logoSrc" alt="Logo" class="h-full w-full object-contain" />
        </div>
        <div class="space-y-2" v-if="hasText">
          <p
            v-for="zone in slide.textZones"
            :key="zone.id"
            :class="zone.className"
            class="text-sm leading-snug"
          >
            {{ zone.id === 'title' ? titleText : bodyText }}
          </p>
        </div>

        <div v-if="isDevice" class="flex justify-center pt-4">
          <div class="h-40 w-24">
            <DeviceMockup :frame="slide.frame" :screenshot-src="screenshotSrc" />
          </div>
        </div>

        <div v-else class="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/20 shadow-lg">
          <img :src="screenshotSrc" alt="Screenshot" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>
    <div>
      <p class="mt-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">{{ slide.packName }}</p>
      <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ slide.name }}</p>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useBuilderStore } from '../store/builderStore'
import DeviceMockup from './DeviceMockup.vue'

const props = defineProps({
  slide: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])
const store = useBuilderStore()

const overrides = computed(() => store.getSlideOverride(props.slide.id))

const activeScreenshot = computed(() => {
  const overrideId = overrides.value?.screenshotId
  if (overrideId) {
    return store.state.screenshots.find((shot) => shot.id === overrideId) || null
  }
  return store.state.screenshots[0] || null
})

const screenshotSrc = computed(() => activeScreenshot.value?.url || props.slide.baseScreenshot)

const activeTextCard = computed(() => {
  const overrideId = overrides.value?.textCardId
  if (overrideId) {
    return store.state.textCards.find((card) => card.id === overrideId) || store.state.textCards[0]
  }
  return store.state.textCards[0] || null
})

const titleText = computed(() => activeTextCard.value?.title || props.slide.defaultTitle)
const bodyText = computed(() => activeTextCard.value?.text || props.slide.defaultText)
const hasText = computed(() => props.slide.textZones && props.slide.textZones.length > 0)

const background = computed(() => overrides.value?.background || props.slide.background)

const backgroundStyle = computed(() => {
  if (!background.value) return {}
  if (background.value.mode === 'gradient') {
    return {
      backgroundImage: `linear-gradient(180deg, ${background.value.gradientStart}, ${background.value.gradientEnd})`
    }
  }
  if (background.value.mode === 'image' && background.value.imageUrl) {
    return {
      backgroundImage: `url(${background.value.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return { backgroundColor: background.value.solid }
})

const overlayStyle = computed(() =>
  props.slide.overlay
    ? {
        backgroundImage: props.slide.overlay,
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit'
      }
    : null
)

const isDevice = computed(() => props.slide.renderMode === 'device')

const logoSrc = computed(() => props.slide.baseLogo || null)
const showLogo = computed(() => Boolean(props.slide.logoZone && logoSrc.value))
const logoStyle = computed(() => {
  if (!props.slide.logoZone) return {}
  return {
    position: 'absolute',
    top: props.slide.logoZone.top,
    left: props.slide.logoZone.left,
    width: props.slide.logoZone.width,
    height: props.slide.logoZone.height,
    borderRadius: props.slide.logoZone.borderRadius || '9999px'
  }
})

const emitSelect = () => {
  emit('select', props.slide.id)
}
</script>
