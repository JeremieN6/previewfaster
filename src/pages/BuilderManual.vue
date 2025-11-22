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

            <div class="min-w-0">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Zone templates manuelles</p>
                <h3 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white">Commence ici</h3>
                <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Ajoute ton propre rendu à cet emplacement. Remplace ce bloc par tes composants quand tu es prêt.
                </p>
              </div>
              <div class="mt-8">
                <div class="manual-scroll-area w-full overflow-x-scroll overscroll-x-contain pb-4 [-webkit-overflow-scrolling:touch]">
                  <section class="space-y-4">
                    <header class="flex items-center justify-between">
                      <div>
                        <h3 class="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Premier League</h3>
                        <p class="text-xs text-gray-400 dark:text-gray-500">5 écrans</p>
                      </div>
                      <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 focus:outline-none"
                        @click="openManualEditor('screen-1')"
                      >
                        Personnaliser ce pack
                      </button>
                    </header>
                    <div class="flex gap-6 flex-nowrap">
                    <!-- Screen 1 -->
                    <div class="relative flex-none h-[520px] w-[260px] overflow-hidden rounded-3xl border border-white/20 bg-slate-900/60 shadow-lg shadow-slate-900/40 dark:border-white/10">
                      <img :src="screensById['screen-1']?.media?.src" class="h-full w-full object-cover" alt="Screen 1" />
                      
                      <!-- Ombre haut vers bas -->
                      <div class="absolute inset-0 pointer-events-none rounded-3xl" :style="overlayStyleFor('screen-1')"></div>

                      <div class="pointer-events-none absolute inset-0 flex flex-col justify-between p-5">
                        <div class="flex justify-start" v-if="screensById['screen-1']?.logo?.visible">
                          <div
                            class="h-16 w-16 overflow-hidden rounded-full text-center shadow-lg backdrop-blur"
                            :style="{ background: screensById['screen-1']?.logo?.background, color: screensById['screen-1']?.logo?.textColor }"
                          >
                            <img
                              v-if="screensById['screen-1']?.logo?.imageUrl"
                              :src="screensById['screen-1']?.logo?.imageUrl"
                              alt="Logo écran"
                              class="h-full w-full object-contain"
                            />
                            <div v-else class="flex h-full items-center justify-center text-sm font-semibold">{{ screensById['screen-1']?.logo?.label }}</div>
                          </div>
                        </div>
                        <h2 class="absolute bottom-5 left-5 right-5 mt-auto max-h-48 overflow-hidden pr-10 text-3xl font-bold leading-[1.1] text-white whitespace-pre-line break-words line-clamp-4">{{ screensById['screen-1']?.title }}</h2>
                      </div>
                      <button type="button" class="absolute right-4 top-4 z-20 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-white" @click="openManualEditor('screen-1')">
                        Modifier
                      </button>
                    </div>
                    <!-- Screen 2 -->
                    <div class="relative flex-none h-[520px] w-[260px] overflow-hidden rounded-3xl border border-white/20 bg-slate-900/60 shadow-lg shadow-slate-900/40 dark:border-white/10">
                      <img :src="screensById['screen-2']?.media?.src" class="h-full w-full object-cover" alt="Screen 2" />
                      <button type="button" class="absolute right-4 top-4 z-20 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-white" @click="openManualEditor('screen-2')">
                        Modifier
                      </button>
                    </div>

                    <!-- Screen 3 -->
                    <div class="relative flex-none h-[520px] w-[260px] overflow-hidden rounded-3xl border border-white/20 bg-slate-900/60 shadow-lg shadow-slate-900/40 dark:border-white/10">
                      <img :src="screensById['screen-3']?.media?.src" class="h-full w-full object-cover" alt="Screen 3" />
                      
                      <!-- Ombre haut vers bas -->
                      <div class="absolute inset-0 pointer-events-none rounded-3xl" :style="overlayStyleFor('screen-3')"></div>

                      <div class="pointer-events-none absolute inset-0 flex flex-col justify-between p-5">
                        <h2 class="absolute bottom-5 left-5 right-5 mt-auto max-h-48 overflow-hidden pr-6 text-3xl font-bold leading-[1.1] text-white whitespace-pre-line break-words line-clamp-4">{{ screensById['screen-3']?.title }}</h2>
                      </div>
                      <button type="button" class="absolute right-4 top-4 z-20 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-white" @click="openManualEditor('screen-3')">
                        Modifier
                      </button>
                    </div>

                    <!-- Screen 4 -->
                    <div class="relative flex-none h-[520px] w-[260px] overflow-hidden rounded-3xl border border-white/20 bg-slate-900/60 shadow-lg shadow-slate-900/40 dark:border-white/10">
                      <div class="absolute inset-0" :style="backgroundStyleFor('screen-4')"></div>

                      <div class="pointer-events-none absolute inset-0"></div>

                      <div class="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-start pt-4">
                        <h2 class="max-h-28 overflow-hidden px-6 text-center text-xl font-bold leading-tight text-white whitespace-pre-line break-words drop-shadow-lg line-clamp-3">{{ screensById['screen-4']?.title }}</h2>
                        <p class="mt-3 max-h-28 overflow-hidden px-6 text-center text-xs leading-snug text-white/90 whitespace-pre-line break-words drop-shadow-md line-clamp-3">{{ screensById['screen-4']?.subtitle }}</p>
                      </div>

                      <div v-if="screenFourMockup" class="mockup-device" :style="screenFourMockup.deviceStyle">
                        <img
                            :src="screenFourMockup.frame || phoneMockupUrl"
                            alt="iPhone mockup"
                            class="mockup-device__frame"
                            :style="screenFourMockup.frameStyle"
                          />
                        <div class="mockup-screen" :style="screenFourMockup.screenStyle">
                          <img :src="screenFourMockup.contentImage" alt="Interface personnalisée" class="mockup-screen__image" :style="screenFourMockup.imageStyle" />
                        </div>
                      </div>
                      <button type="button" class="absolute right-4 top-4 z-20 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-white" @click="openManualEditor('screen-4')">
                        Modifier
                      </button>
                    </div>

                    <!-- Screen 5 -->
                    <div class="relative flex-none h-[520px] w-[260px] overflow-hidden rounded-3xl border border-white/20 bg-slate-900/60 shadow-lg shadow-slate-900/40 dark:border-white/10">
                      <div class="absolute inset-0" :style="backgroundStyleFor('screen-5')"></div>

                      <div class="pointer-events-none absolute inset-0"></div>

                      <div class="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-start pt-4">
                        <h2 class="max-h-28 overflow-hidden px-6 text-center text-xl font-bold leading-tight text-white whitespace-pre-line break-words drop-shadow-lg line-clamp-3">{{ screensById['screen-5']?.title }}</h2>
                        <p class="mt-3 max-h-28 overflow-hidden px-6 text-center text-xs leading-relaxed text-white/90 whitespace-pre-line break-words drop-shadow-md line-clamp-3">{{ screensById['screen-5']?.subtitle }}</p>
                      </div>

                      <div v-if="screenFiveMockup" class="mockup-device" :style="screenFiveMockup.deviceStyle">
                        <img
                            :src="screenFiveMockup.frame || phoneMockupUrl"
                            alt="iPhone mockup"
                            class="mockup-device__frame"
                            :style="screenFiveMockup.frameStyle"
                          />
                        <div class="mockup-screen" :style="screenFiveMockup.screenStyle">
                          <img :src="screenFiveMockup.contentImage" alt="Matchday Stories preview" class="mockup-screen__image" :style="screenFiveMockup.imageStyle" />
                        </div>
                      </div>
                      <button type="button" class="absolute right-4 top-4 z-20 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-white" @click="openManualEditor('screen-5')">
                        Modifier
                      </button>
                    </div>
                  </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <LandingNewsletter />
    <LandingFooter />
    <ManualScreenEditorModal :open="Boolean(activeScreen)" :screen="activeScreen" @close="closeManualEditor" />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import LandingNav from '../components/landing/LandingNav.vue'
import LandingFooter from '../components/landing/LandingFooter.vue'
import LandingNewsletter from '../components/landing/LandingNewsletter.vue'
import ScreenshotUploader from '../components/ScreenshotUploader.vue'
import TextCardsEditor from '../components/TextCardsEditor.vue'
import Sidebar from '../components/Sidebar.vue'
import ManualScreenEditorModal from '../components/ManualScreenEditorModal.vue'
import manualScreensData from '../data/manualScreens.json'
import { useBuilderStore } from '../store/builderStore'

const phoneMockupUrl = '/docs/mockup/mockup7.png'
const baseScreens = manualScreensData.screens
const baseScreensById = baseScreens.reduce((acc, screen) => {
  acc[screen.id] = screen
  return acc
}, {})

const store = useBuilderStore()

const resolvedScreens = computed(() => {
  return baseScreens.map((screen, index) => {
    const override = store.getSlideOverride(screen.id) || {}
    const fallbackScreenshot = store.state.screenshots[index] || store.state.screenshots[0] || null
    const selectedScreenshot = override.screenshotId
      ? store.state.screenshots.find((shot) => shot.id === override.screenshotId)
      : fallbackScreenshot

    const resolvedMediaSrc = override.mediaSrc || selectedScreenshot?.url || screen.media?.src
    const mergedLogo = screen.logo
      ? {
          ...screen.logo,
          ...override.logo
        }
      : null

    const buildMockup = () => {
      if (!screen.mockup?.enabled) return null
      const overrideMockup = override.mockup || {}
      const mockupScreenshot = overrideMockup.screenshotId
        ? store.state.screenshots.find((shot) => shot.id === overrideMockup.screenshotId)
        : selectedScreenshot
      return {
        ...screen.mockup,
        ...overrideMockup,
        deviceStyle: { ...screen.mockup.deviceStyle, ...(overrideMockup.deviceStyle || {}) },
        frameStyle: { ...screen.mockup.frameStyle, ...(overrideMockup.frameStyle || {}) },
        screenStyle: { ...screen.mockup.screenStyle, ...(overrideMockup.screenStyle || {}) },
        imageStyle: { ...screen.mockup.imageStyle, ...(overrideMockup.imageStyle || {}) },
        contentImage: overrideMockup.contentImage || mockupScreenshot?.url || screen.mockup.contentImage,
        frame: overrideMockup.frame || screen.mockup.frame
      }
    }

    return {
      ...screen,
      title: override.title ?? screen.title,
      subtitle: override.subtitle ?? screen.subtitle,
      overlay: override.overlayStyle ? { ...(screen.overlay || {}), style: override.overlayStyle } : screen.overlay,
      background: override.backgroundStyle ? { ...(screen.background || {}), style: override.backgroundStyle } : screen.background,
      media: { ...(screen.media || {}), src: resolvedMediaSrc },
      logo: mergedLogo,
      mockup: buildMockup()
    }
  })
})

const screensById = computed(() => {
  const map = {}
  resolvedScreens.value.forEach((screen) => {
    map[screen.id] = screen
  })
  return map
})

const backgroundStyleFor = (id) => {
  const style = screensById.value[id]?.background?.style
  return style ? { background: style } : undefined
}

const overlayStyleFor = (id) => {
  const style = screensById.value[id]?.overlay?.style
  return style ? { background: style } : undefined
}

const screenFourMockup = computed(() => screensById.value['screen-4']?.mockup ?? null)
const screenFiveMockup = computed(() => screensById.value['screen-5']?.mockup ?? null)

const activeScreenId = ref(null)
const activeScreen = computed(() => (activeScreenId.value ? baseScreensById[activeScreenId.value] : null))
const openManualEditor = (id) => {
  activeScreenId.value = id
}
const closeManualEditor = () => {
  activeScreenId.value = null
}
</script>

<style scoped>
.manual-scroll-area {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.manual-scroll-area::-webkit-scrollbar {
  display: none;
}

.mockup-device {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.mockup-device__frame {
  position: absolute;
  left: 50%;
  top: 50%;
  max-width: none;
  transform: translate(-50%, 0);
  filter: drop-shadow(0 35px 55px rgba(0, 1, 3, 0.55));
  z-index: 10;
}

.mockup-screen {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 210px;
  height: 480px;
  transform: translate(-50%, -50%);
  border-radius: 38px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 35px 55px rgba(15, 23, 42, 0.45);
  background: #050a1a;
}

.mockup-screen__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 52%;
}
</style>