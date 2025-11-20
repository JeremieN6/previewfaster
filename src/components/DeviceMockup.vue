<template>
  <div v-if="mode === 'frame'"
    class="pointer-events-none relative h-full w-full rounded-[42px] border-[10px] p-[6px]"
    :class="outerFrameClasses"
  >
    <div class="absolute inset-0 rounded-[38px] border border-white/10 opacity-40"></div>
    <div
      class="absolute left-1/2 top-[2.5%] flex h-3 w-20 -translate-x-1/2 items-center justify-center rounded-b-2xl"
      :class="notchClasses"
    >
      <span class="h-2 w-10 rounded-full opacity-60" :class="notchDetailClasses"></span>
    </div>
    <div class="relative h-full w-full rounded-[28px] p-[6px]" :class="bezelClasses">
      <div class="h-full w-full overflow-hidden rounded-[24px]" :class="screenClasses">
        <img :src="screenshotSrc" alt="Mockup" class="h-full w-full object-cover" />
      </div>
    </div>
  </div>

  <div v-else class="pointer-events-none relative h-full w-full overflow-hidden rounded-[28px]">
    <img :src="screenshotSrc" alt="Mockup" class="h-full w-full object-cover" />
    <div
      class="pointer-events-none absolute inset-0 rounded-[28px]"
      :class="overlayRimClasses"
    ></div>
    <div
      class="pointer-events-none absolute left-1/2 top-[2%] h-[3.2%] w-[36%] -translate-x-1/2 rounded-b-2xl"
      :class="overlayNotchClasses"
    ></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  frame: {
    type: String,
    default: 'dark'
  },
  screenshotSrc: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    default: 'frame' // 'frame' | 'overlay'
  }
})

const isLight = computed(() => props.frame === 'light')

const outerFrameClasses = computed(() =>
  isLight.value
    ? 'border-gray-200 bg-white shadow-[0_18px_45px_rgba(148,163,184,0.35)]'
    : 'border-slate-900 bg-slate-950 shadow-[0_32px_65px_rgba(2,6,23,0.75)]'
)
const bezelClasses = computed(() => (isLight.value ? 'bg-gray-200' : 'bg-black'))
const notchClasses = computed(() => (isLight.value ? 'bg-gray-100 shadow-inner shadow-slate-300/60' : 'bg-slate-900 shadow-inner shadow-slate-800/80'))
const notchDetailClasses = computed(() => (isLight.value ? 'bg-gray-300' : 'bg-slate-700'))
const screenClasses = computed(() => (isLight.value ? 'bg-white' : 'bg-black'))

// Overlay mode styles (drawn within given box)
const overlayRimClasses = computed(() =>
  isLight.value
    ? 'ring-1 ring-inset ring-gray-300/70 shadow-[inset_0_0_0_6px_rgba(229,231,235,0.85),_0_20px_40px_rgba(0,0,0,0.25)]'
    : 'ring-1 ring-inset ring-slate-700/60 shadow-[inset_0_0_0_6px_rgba(15,23,42,0.85),_0_24px_56px_rgba(2,6,23,0.65)]'
)
const overlayNotchClasses = computed(() => (isLight.value ? 'bg-gray-200' : 'bg-slate-800'))
</script>
