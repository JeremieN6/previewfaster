<template>
  <teleport to="body">
    <div v-if="open && slide" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 px-4 py-8">
      <div class="relative mx-auto w-full max-w-6xl rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
        <button
          type="button"
          class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          @click="emitClose"
        >
          <span class="sr-only">Fermer</span>
          ✕
        </button>
        <div class="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[4fr_2fr]">
          <div class="flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Édition</p>
                <h3 class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ slide.packName }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ slide.name }}</p>
              </div>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
                  :disabled="activeIndex === 0"
                  @click="prevSlide"
                >
                  ‹
                </button>
                <button
                  type="button"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
                  :disabled="activeIndex === slides.length - 1"
                  @click="nextSlide"
                >
                  ›
                </button>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                <span>Pack complet</span>
                <span>{{ slides.length }} écrans</span>
              </div>
              <div class="mt-4 grid gap-4" :class="slides.length === 5 ? 'sm:grid-cols-2 lg:grid-cols-5' : 'sm:grid-cols-3 lg:grid-cols-5'">
                <div
                  v-for="(s, idx) in slides"
                  :key="s.id"
                  class="group relative aspect-[9/16] overflow-hidden rounded-[42px] border transition"
                  :class="activeIndex === idx ? 'border-blue-500 shadow-xl' : 'border-gray-200 dark:border-gray-700'"
                  @click="jumpTo(idx)"
                >
                  <div class="absolute inset-0" :style="backgroundStyle"></div>
                  <div v-if="s.overlay" class="absolute inset-0" :style="{ backgroundImage: s.overlay }"></div>
                  <div class="relative z-10 h-full w-full">
                    <div
                      v-if="showLogo"
                      class="absolute overflow-hidden border border-white/20 bg-white/15 shadow-lg backdrop-blur"
                      :style="logoStyle"
                    >
                      <img :src="logoSrc" alt="Logo" class="h-full w-full object-contain" />
                    </div>
                    <template v-for="zone in s.textZones" :key="zone.id">
                      <div class="absolute" :style="textZoneStyle(zone)">
                        <p :class="zone.className">
                          {{ zone.id === 'title' ? titleText : bodyText }}
                        </p>
                      </div>
                    </template>
                    <div v-if="s.renderMode === 'device'" class="absolute" :style="deviceZoneStyleFromSlide(s)">
                      <DeviceMockup :frame="s.frame" :screenshot-src="screenshotSrc" />
                    </div>
                  </div>
                  <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-2 text-center text-[10px] font-medium text-white opacity-0 group-hover:opacity-100">
                    {{ s.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div class="space-y-5">
              <div>
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Capture utilisée</label>
                <select
                  v-model="selectedScreenshotId"
                  class="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                  :disabled="!store.state.screenshots.length"
                >
                  <option v-for="shot in store.state.screenshots" :key="shot.id" :value="shot.id">
                    {{ shot.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Carte texte</label>
                <select
                  v-model="selectedTextCardId"
                  class="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                  :disabled="!store.state.textCards.length"
                >
                  <option v-for="card in store.state.textCards" :key="card.id" :value="card.id">
                    {{ card.title }}
                  </option>
                </select>
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Mode de fond</label>
                <div class="mt-3 flex gap-2">
                  <button
                    v-for="mode in backgroundModes"
                    :key="mode.value"
                    type="button"
                    class="flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition"
                    :class="
                      localBackground.mode === mode.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-100'
                        : 'border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-300'
                    "
                    @click="localBackground.mode = mode.value"
                  >
                    {{ mode.label }}
                  </button>
                </div>
              </div>

              <div v-if="localBackground.mode === 'solid'" class="grid grid-cols-1 gap-4">
                <label class="text-sm font-semibold text-slate-700 dark:text-gray-200">
                  Couleur
                  <input type="color" v-model="localBackground.solid" class="mt-2 h-10 w-full rounded" />
                </label>
              </div>

              <div v-else-if="localBackground.mode === 'gradient'" class="grid grid-cols-2 gap-4">
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Début
                  <input type="color" v-model="localBackground.gradientStart" class="mt-2 h-10 w-full rounded" />
                </label>
                <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Fin
                  <input type="color" v-model="localBackground.gradientEnd" class="mt-2 h-10 w-full rounded" />
                </label>
              </div>

              <div v-else class="space-y-3">
                <div>
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-200" for="bgImageInput">URL de l'image</label>
                  <input
                    id="bgImageInput"
                    type="url"
                    placeholder="https://..."
                    v-model="localBackground.imageUrl"
                    class="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                  />
                </div>
                <div class="relative">
                  <label class="text-sm font-semibold text-gray-700 dark:text-gray-200">Ou uploader une image</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    @change="handleImageUpload"
                    class="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:file:bg-blue-900/40 dark:file:text-blue-200"
                  />
                </div>
              </div>

              <button
                type="button"
                class="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60"
                :disabled="isExporting || !store.state.screenshots.length"
                @click="exportPng"
              >
                {{ isExporting ? 'Export en cours…' : 'Exporter en PNG 1080×1920' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import domtoimage from 'dom-to-image-more'
import { templatePacks } from '../data/templates'
import { useBuilderStore } from '../store/builderStore'
import DeviceMockup from './DeviceMockup.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  slide: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])
const store = useBuilderStore()
const canvasRef = ref(null)
const placeholderImage = 'https://placehold.co/640x1280/e2e8f0/94a3b8?text=Ajoute+tes+captures'
const selectedScreenshotId = ref(null)
const selectedTextCardId = ref(null)
const localBackground = ref({ mode: 'solid', solid: '#0f172a', gradientStart: '#0f172a', gradientEnd: '#2563eb', imageUrl: '' })
const isExporting = ref(false)
const backgroundModes = [
  { value: 'solid', label: 'Couleur' },
  { value: 'gradient', label: 'Dégradé' },
  { value: 'image', label: 'Image' }
]
const slides = computed(() => {
  if (!props.slide) return []
  const pack = templatePacks.find((p) => p.id === props.slide.packId)
  return pack?.slides || []
})
const activeIndex = ref(0)

const overrides = computed(() => (props.slide ? store.getSlideOverride(props.slide.id) : null))
const activeScreenshot = computed(() => {
  if (!props.slide) return null
  const overrideId = selectedScreenshotId.value || overrides.value?.screenshotId
  return store.state.screenshots.find((shot) => shot.id === overrideId) || store.state.screenshots[0] || null
})
const activeTextCard = computed(() => {
  if (!props.slide) return null
  const overrideId = selectedTextCardId.value || overrides.value?.textCardId
  return store.state.textCards.find((card) => card.id === overrideId) || store.state.textCards[0] || null
})
const screenshotSrc = computed(() => activeScreenshot.value?.url || props.slide?.baseScreenshot || placeholderImage)
const titleText = computed(() => activeTextCard.value?.title || props.slide?.defaultTitle || '')
const bodyText = computed(() => activeTextCard.value?.text || props.slide?.defaultText || '')
const backgroundStyle = computed(() => {
  if (!props.slide) return {}
  if (localBackground.value.mode === 'gradient') {
    return {
      backgroundImage: `linear-gradient(180deg, ${localBackground.value.gradientStart}, ${localBackground.value.gradientEnd})`,
      backgroundSize: 'cover'
    }
  }
  if (localBackground.value.mode === 'image') {
    const image = localBackground.value.imageUrl
    return image
      ? {
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      : { backgroundColor: '#0f172a' }
  }
  return { backgroundColor: localBackground.value.solid }
})
const overlayStyle = computed(() => {
  if (!props.slide?.overlay) return null
  return {
    backgroundImage: props.slide.overlay
  }
})
const isDeviceVariant = computed(() => props.slide?.renderMode === 'device')
const deviceZoneStyle = computed(() => {
  if (!isDeviceVariant.value || !props.slide?.screenshotArea) return {}
  return {
    width: props.slide.screenshotArea.width,
    height: props.slide.screenshotArea.height,
    top: props.slide.screenshotArea.top,
    left: props.slide.screenshotArea.left,
    position: 'absolute'
  }
})
const deviceZoneStyleFromSlide = (s) => {
  if (s.renderMode !== 'device' || !s.screenshotArea) return {}
  return {
    width: s.screenshotArea.width,
    height: s.screenshotArea.height,
    top: s.screenshotArea.top,
    left: s.screenshotArea.left,
    position: 'absolute'
  }
}
const textZoneStyle = (zone) => ({
  position: 'absolute',
  top: zone.top,
  left: zone.left,
  width: zone.width
})

const logoSrc = computed(() => props.slide?.baseLogo || null)
const showLogo = computed(() => Boolean(props.slide?.logoZone && logoSrc.value))
const logoStyle = computed(() => {
  if (!props.slide?.logoZone) return {}
  return {
    position: 'absolute',
    top: props.slide.logoZone.top,
    left: props.slide.logoZone.left,
    width: props.slide.logoZone.width,
    height: props.slide.logoZone.height,
    borderRadius: props.slide.logoZone.borderRadius || '12px'
  }
})

// plus de carousel; affichage simultané des écrans

const syncFromSlide = () => {
  if (!props.slide) return
  const override = overrides.value
  activeIndex.value = slides.value.findIndex((s) => s.id === props.slide.id)
  if (activeIndex.value === -1) activeIndex.value = 0
  selectedScreenshotId.value = override?.screenshotId || store.state.screenshots[0]?.id || null
  selectedTextCardId.value = override?.textCardId || store.state.textCards[0]?.id || null
  localBackground.value = {
    mode: override?.background?.mode || props.slide.background.mode,
    solid: override?.background?.solid || props.slide.background.solid,
    gradientStart: override?.background?.gradientStart || props.slide.background.gradientStart,
    gradientEnd: override?.background?.gradientEnd || props.slide.background.gradientEnd,
    imageUrl: override?.background?.imageUrl || props.slide.background.imageUrl || ''
  }
}

watch(
  () => props.slide,
  () => {
    syncFromSlide()
  },
  { immediate: true }
)

watch(
  [selectedScreenshotId, selectedTextCardId, localBackground],
  () => {
    if (!props.slide) return
    // appliquer aux 5 écrans du pack pour cohérence
    slides.value.forEach((s) => {
      store.setSlideOverride(s.id, {
        screenshotId: selectedScreenshotId.value || store.state.screenshots[0]?.id || null,
        textCardId: selectedTextCardId.value || store.state.textCards[0]?.id || null,
        background: { ...localBackground.value }
      })
    })
  },
  { deep: true }
)

watch(
  () => store.state.screenshots.length,
  () => {
    if (!store.state.screenshots.find((shot) => shot.id === selectedScreenshotId.value)) {
      selectedScreenshotId.value = store.state.screenshots[0]?.id || null
    }
  }
)

watch(
  () => store.state.textCards.length,
  () => {
    if (!store.state.textCards.find((card) => card.id === selectedTextCardId.value)) {
      selectedTextCardId.value = store.state.textCards[0]?.id || null
    }
  }
)

const emitClose = () => {
  emit('close')
}

const prevSlide = () => {
  if (activeIndex.value === 0) return
  activeIndex.value -= 1
  const slide = slides.value[activeIndex.value]
  if (slide) {
    store.setSelectedTemplateId(slide.id)
  }
}

const nextSlide = () => {
  if (activeIndex.value >= slides.value.length - 1) return
  activeIndex.value += 1
  const slide = slides.value[activeIndex.value]
  if (slide) {
    store.setSelectedTemplateId(slide.id)
  }
}

const jumpTo = (index) => {
  activeIndex.value = index
  const slide = slides.value[index]
  if (slide) {
    store.setSelectedTemplateId(slide.id)
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (!/image\/(png|jpe?g)$/i.test(file.type)) {
    alert('Format non supporté. Utilisez JPG ou PNG.')
    return
  }
  localBackground.value.imageUrl = URL.createObjectURL(file)
}

const exportPng = async () => {
  if (!canvasRef.value || !props.slide) return
  isExporting.value = true
  try {
    const dataUrl = await domtoimage.toPng(canvasRef.value, {
      quality: 1,
      width: 1080,
      height: 1920
    })
    const link = document.createElement('a')
    link.download = `${props.slide.name}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Export PNG failed', error)
  } finally {
    isExporting.value = false
  }
}
</script>
