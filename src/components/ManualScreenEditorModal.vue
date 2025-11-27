<template>
  <teleport to="body">
    <div
      v-if="open && screen"
      class="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-slate-900/70 px-4 py-8"
      @click.self="emitClose"
    >
      <div class="relative w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <button
          type="button"
          class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          @click="emitClose"
        >
          <span class="sr-only">Fermer</span>
          ✕
        </button>

        <div class="space-y-6">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Écran manuel</p>
            <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ screenDisplayLabel }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Personnalise ce visuel exactement comme sur le builder principal.</p>
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <div class="space-y-5">
              <fieldset v-if="fieldControls.media" class="space-y-2">
                <label class="text-sm font-semibold text-gray-800 dark:text-gray-100">Capture utilisée</label>
                <select
                  v-model="selectedScreenshotId"
                  class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900"
                  :disabled="!screenshots.length"
                >
                  <option :value="null" disabled>Ajoute des images pour personnaliser</option>
                  <option v-for="shot in screenshots" :key="shot.id" :value="shot.id">{{ shot.name }}</option>
                </select>
              </fieldset>

              <fieldset v-if="fieldControls.title" class="space-y-2">
                <label class="text-sm font-semibold text-gray-800 dark:text-gray-100">Titre</label>
                <textarea
                  v-model="title"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900"
                  placeholder="Titre personnalisé"
                ></textarea>
                <p class="text-xs text-gray-400">Utilise Entrée pour forcer un retour à la ligne.</p>
              </fieldset>

              <fieldset v-if="fieldControls.subtitle" class="space-y-2">
                <label class="text-sm font-semibold text-gray-800 dark:text-gray-100">Sous-titre</label>
                <textarea
                  v-model="subtitle"
                  rows="3"
                  class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900"
                  placeholder="Ajoute une description"
                ></textarea>
              </fieldset>

              <fieldset v-if="fieldControls.overlay" class="space-y-2">
                <label class="text-sm font-semibold text-gray-800 dark:text-gray-100">Overlay (CSS)</label>
                <input
                  v-model="overlayCss"
                  type="text"
                  class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-mono focus:border-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900"
                  placeholder="linear-gradient(...)"
                />
              </fieldset>

              <fieldset v-if="fieldControls.background" class="space-y-3">
                <label class="text-sm font-semibold text-gray-800 dark:text-gray-100">Fond</label>
                <div class="flex gap-2">
                  <button
                    v-for="mode in backgroundModes"
                    :key="mode.value"
                    type="button"
                    class="flex-1 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wider"
                    :class="backgroundMode === mode.value ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/40 dark:text-blue-100' : 'border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-300'"
                    @click="backgroundMode = mode.value"
                  >
                    {{ mode.label }}
                  </button>
                </div>
                <div v-if="backgroundMode === 'solid'" class="space-y-2">
                  <input type="color" v-model="solidColor" class="h-12 w-full rounded-xl border border-gray-200 dark:border-gray-700" />
                </div>
                <div v-else-if="backgroundMode === 'gradient'" class="grid grid-cols-2 gap-3">
                  <div>
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Début</span>
                    <input type="color" v-model="gradientStart" class="mt-1 h-12 w-full rounded-xl border border-gray-200 dark:border-gray-700" />
                  </div>
                  <div>
                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Fin</span>
                    <input type="color" v-model="gradientEnd" class="mt-1 h-12 w-full rounded-xl border border-gray-200 dark:border-gray-700" />
                  </div>
                  <div class="col-span-2">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Angle (°)</label>
                    <input type="range" min="0" max="360" v-model.number="gradientAngle" class="mt-1 w-full" />
                  </div>
                </div>
                <div v-else class="space-y-3">
                  <div class="space-y-2">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Captures importées</label>
                    <select
                      v-model="backgroundScreenshotId"
                      class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900"
                      :disabled="!screenshots.length"
                    >
                      <option :value="null">Aucune capture</option>
                      <option v-for="shot in screenshots" :key="`background-${shot.id}`" :value="shot.id">{{ shot.name }}</option>
                    </select>
                    <p class="text-[11px] text-gray-400 dark:text-gray-500">Choisis l'une des captures importées via la colonne de gauche.</p>
                  </div>

                  <div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center dark:border-gray-600 dark:bg-gray-900/50">
                    <input ref="backgroundInput" type="file" accept="image/png,image/jpeg,image/webp" class="sr-only" @change="handleBackgroundUpload" />
                    <p class="text-xs text-gray-500 dark:text-gray-400">WEBP, PNG ou JPG recommandé (max 5 Mo).</p>
                    <button type="button" class="mt-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm ring-1 ring-blue-200 transition hover:bg-blue-50" @click="triggerBackgroundInput">
                      Importer une image
                    </button>
                  </div>

                  <p v-if="backgroundUploadError" class="text-xs text-red-500">{{ backgroundUploadError }}</p>

                  <div
                    v-if="backgroundUploadedUrl"
                    class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                        <img :src="backgroundUploadedUrl" alt="Fond importé" class="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ backgroundUploadName || 'Fond importé' }}</p>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400">Prioritaire sur la capture sélectionnée.</p>
                      </div>
                    </div>
                    <button type="button" class="text-xs font-semibold text-red-500" @click="clearBackgroundUpload">Retirer</button>
                  </div>

                  <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">URL personnalisée</label>
                    <input
                      v-model="backgroundImageUrl"
                      type="url"
                      placeholder="https://..."
                      class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900"
                      @input="onBackgroundUrlInput"
                    />
                    <p class="text-[11px] text-gray-400">Prioritaire sur la capture sélectionnée.</p>
                  </div>
                </div>
              </fieldset>
            </div>

            <div class="space-y-5">
              <fieldset v-if="fieldControls.logo" class="space-y-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                <legend class="text-sm font-semibold text-gray-800 dark:text-gray-100">Logo</legend>
                <div v-if="logoOptions.allowUpload" class="space-y-2">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Image du logo</label>
                  <div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center dark:border-gray-600 dark:bg-gray-900/50">
                    <input ref="logoInput" type="file" accept="image/png,image/jpeg,image/webp" class="sr-only" @change="handleLogoUpload" />
                    <p class="text-xs text-gray-500 dark:text-gray-400">WEBP, PNG ou JPG recommandé (max 5 Mo).</p>
                    <button type="button" class="mt-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm ring-1 ring-blue-200 transition hover:bg-blue-50" @click="triggerLogoInput">
                      Importer un logo
                    </button>
                  </div>
                  <p v-if="logoError" class="text-xs text-red-500">{{ logoError }}</p>
                  <div v-if="logoImageUrl" class="mt-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-900">
                    <div class="flex items-center gap-3">
                      <img :src="logoImageUrl" alt="Logo importé" class="h-10 w-10 rounded-full object-contain" />
                      <span class="text-xs text-gray-600">Logo chargé</span>
                    </div>
                    <button type="button" class="text-xs font-semibold text-red-500" @click="clearLogoImage">Retirer</button>
                  </div>
                </div>

                <div v-if="logoOptions.allowLabel" class="space-y-2">
                  <label class="text-sm font-semibold text-gray-800 dark:text-gray-100">Texte</label>
                  <input v-model="logoLabel" type="text" placeholder="Texte" class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
                </div>

                <div v-if="logoOptions.allowColors" class="grid grid-cols-2 gap-3">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Fond
                    <input type="color" v-model="logoBg" class="mt-1 h-10 w-full rounded" />
                  </label>
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Texte
                    <input type="color" v-model="logoText" class="mt-1 h-10 w-full rounded" />
                  </label>
                </div>
              </fieldset>

              <fieldset v-if="fieldControls.mockup" class="space-y-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
                <legend class="text-sm font-semibold text-gray-800 dark:text-gray-100">Mockup</legend>

                <div v-if="mockupOptions.allowScreenshot" class="space-y-2">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Capture utilisée</label>
                  <select
                    v-model="mockupScreenshotId"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900"
                    :disabled="!screenshots.length"
                  >
                    <option :value="null">Utiliser la capture principale</option>
                    <option v-for="shot in screenshots" :key="`mockup-${shot.id}`" :value="shot.id">{{ shot.name }}</option>
                  </select>
                </div>

                <div v-if="mockupOptions.allowUpload" class="space-y-2">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Image importée</label>
                  <div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center dark:border-gray-600 dark:bg-gray-900/50">
                    <input ref="mockupInput" type="file" accept="image/png,image/jpeg,image/webp" class="sr-only" @change="handleMockupUpload" />
                    <p class="text-xs text-gray-500 dark:text-gray-400">WEBP, PNG ou JPG recommandé (max 5 Mo).</p>
                    <button type="button" class="mt-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-blue-600 shadow-sm ring-1 ring-blue-200 transition hover:bg-blue-50" @click="triggerMockupInput">
                      Importer un visuel
                    </button>
                  </div>
                  <p v-if="mockupUploadError" class="text-xs text-red-500">{{ mockupUploadError }}</p>
                  <div v-if="mockupUploadedUrl" class="mt-2 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-900">
                    <div class="flex items-center gap-3">
                      <div class="h-12 w-12 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                        <img :src="mockupUploadedUrl" alt="Mockup importé" class="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ mockupUploadName || 'Visuel importé' }}</p>
                        <p class="text-[11px] text-gray-500 dark:text-gray-400">Prioritaire sur les captures.</p>
                      </div>
                    </div>
                    <button type="button" class="text-xs font-semibold text-red-500" @click="clearMockupUpload">Retirer</button>
                  </div>
                </div>

                <div v-if="mockupOptions.allowUrl" class="space-y-2">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400">URL personnalisée</label>
                  <input
                    v-model="mockupUrlInput"
                    type="url"
                    placeholder="https://..."
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <p class="text-[11px] text-gray-400">Utilisée si aucune image importée n'est présente.</p>
                </div>

                <div v-if="mockupOptions.allowObjectPosition" class="space-y-1">
                  <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Object position</label>
                  <input
                    v-model="mockupObjectPosition"
                    type="text"
                    class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-mono focus:border-blue-600 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-900"
                    placeholder="center 50%"
                  />
                </div>
              </fieldset>

              <button
                type="button"
                class="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                @click="emitClose"
              >
                Fermer
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
import { useBuilderStore } from '../store/builderStore'
import manualScreensData from '../data/manualScreens.json'

const props = defineProps({
  open: { type: Boolean, default: false },
  screen: { type: Object, default: null }
})

const emit = defineEmits(['close'])
const store = useBuilderStore()

const screenOrderMap = manualScreensData.screens.reduce((acc, screen, index) => {
  acc[screen.id] = index + 1
  return acc
}, {})

const inferScreenOrder = (screen) => {
  if (!screen) return null
  if (typeof screen.order === 'number') {
    return screen.order
  }
  if (screenOrderMap[screen.id]) {
    return screenOrderMap[screen.id]
  }
  const match = screen.id ? screen.id.match(/(\d+)/) : null
  return match ? Number(match[1]) : null
}

const selectedScreenshotId = ref(null)
const title = ref('')
const subtitle = ref('')
const overlayCss = ref('')
const backgroundMode = ref('gradient')
const solidColor = ref('#0f172a')
const gradientStart = ref('#f4b51e')
const gradientEnd = ref('#f03a47')
const gradientAngle = ref(210)
const backgroundImageUrl = ref('')
const backgroundScreenshotId = ref(null)
const backgroundUploadedUrl = ref('')
const backgroundUploadName = ref('')
const backgroundUploadError = ref('')
const logoLabel = ref('Logo')
const logoBg = ref('#7e3af2')
const logoText = ref('#ffffff')
const logoImageUrl = ref('')
const logoError = ref('')
const mockupScreenshotId = ref(null)
const mockupObjectPosition = ref('center 52%')
const mockupUrlInput = ref('')
const mockupUploadedUrl = ref('')
const mockupUploadName = ref('')
const mockupUploadError = ref('')
const ready = ref(false)
const logoInput = ref(null)
const mockupInput = ref(null)
const backgroundInput = ref(null)

const backgroundModes = [
  { value: 'solid', label: 'Couleur' },
  { value: 'gradient', label: 'Dégradé' },
  { value: 'image', label: 'Image' }
]

const screenshots = computed(() => store.state.screenshots)

const defaultLogoOptions = { allowUpload: true, allowLabel: true, allowColors: true }
const defaultMockupOptions = { enabled: true, allowScreenshot: true, allowUpload: false, allowUrl: true, allowObjectPosition: true }

const fieldControls = computed(() => {
  const base = props.screen
  if (!base) {
    return {
      media: false,
      title: false,
      subtitle: false,
      overlay: false,
      background: false,
      logo: false,
      logoOptions: defaultLogoOptions,
      mockup: false,
      mockupOptions: defaultMockupOptions
    }
  }
  const editorFields = base.editor?.fields || {}
  const pickBoolean = (key, fallback) => (typeof editorFields[key] === 'boolean' ? editorFields[key] : fallback)
  const logoConfig = typeof editorFields.logo === 'object' ? editorFields.logo : null
  const mockupConfig = typeof editorFields.mockup === 'object' ? editorFields.mockup : null

  const hasMedia = Boolean(base.media?.type === 'image')
  const hasTitle = base.title !== undefined && base.title !== null
  const hasSubtitle = Boolean(base.subtitle)
  const hasOverlay = Boolean(base.overlay)
  const hasBackground = Boolean(base.background)
  const hasLogo = Boolean(base.logo)
  const hasMockup = Boolean(base.mockup?.enabled)

  return {
    media: pickBoolean('media', hasMedia),
    title: pickBoolean('title', hasTitle),
    subtitle: pickBoolean('subtitle', hasSubtitle),
    overlay: pickBoolean('overlay', hasOverlay),
    background: pickBoolean('background', hasBackground),
    logo: logoConfig ? logoConfig.enabled !== false : pickBoolean('logo', hasLogo),
    logoOptions: {
      ...defaultLogoOptions,
      ...(logoConfig || {})
    },
    mockup: mockupConfig ? mockupConfig.enabled !== false : pickBoolean('mockup', hasMockup),
    mockupOptions: {
      ...defaultMockupOptions,
      ...(mockupConfig || {})
    }
  }
})

const logoOptions = computed(() => fieldControls.value.logoOptions)
const mockupOptions = computed(() => fieldControls.value.mockupOptions)
const resolvedMockupImage = computed(() => mockupUploadedUrl.value || mockupUrlInput.value || '')
const screenDisplayLabel = computed(() => {
  if (!props.screen) return ''
  const order = inferScreenOrder(props.screen)
  if (order) {
    return `Écran ${order}`
  }
  return props.screen.title || props.screen.id
})

const getScreenshotUrl = (id) => {
  if (!id) return null
  return store.state.screenshots.find((shot) => shot.id === id)?.url || null
}

const buildBackgroundStyle = () => {
  if (backgroundMode.value === 'solid') {
    return solidColor.value
  }
  if (backgroundMode.value === 'gradient') {
    return `linear-gradient(${gradientAngle.value}deg, ${gradientStart.value}, ${gradientEnd.value})`
  }
  if (backgroundMode.value === 'image' && backgroundImageUrl.value) {
    return `url(${backgroundImageUrl.value}) center/cover no-repeat`
  }
  return null
}

const hydrateBackgroundFromStyle = (style = '', type = 'solid') => {
  if (!style) {
    backgroundMode.value = type === 'image' ? 'image' : type === 'gradient' ? 'gradient' : 'solid'
    return
  }
  if (style.includes('gradient')) {
    backgroundMode.value = 'gradient'
    const matches = style.match(/#(?:[0-9a-fA-F]{3}){1,2}/g) || []
    gradientStart.value = matches[0] || gradientStart.value
    gradientEnd.value = matches[matches.length - 1] || gradientEnd.value
    const angleMatch = style.match(/([0-9]{1,3})deg/)
    gradientAngle.value = angleMatch ? Number(angleMatch[1]) : gradientAngle.value
    return
  }
  if (style.startsWith('url')) {
    backgroundMode.value = 'image'
    const urlMatch = style.match(/url\(([^)]+)\)/)
    backgroundImageUrl.value = urlMatch ? urlMatch[1].replace(/['"]/g, '') : ''
    return
  }
  backgroundMode.value = 'solid'
  solidColor.value = style
}

const hydrateFromScreen = () => {
  const base = props.screen
  if (!base) return
  const override = store.getSlideOverride(base.id) || {}
  const controls = fieldControls.value

  selectedScreenshotId.value = controls.media ? override.screenshotId || store.state.screenshots[0]?.id || null : null
  title.value = controls.title ? override.title ?? base.title ?? '' : base.title ?? ''
  subtitle.value = controls.subtitle ? override.subtitle ?? base.subtitle ?? '' : base.subtitle ?? ''
  overlayCss.value = controls.overlay ? override.overlayStyle ?? base.overlay?.style ?? '' : ''

  if (controls.background) {
    const initialBg = override.backgroundStyle || base.background?.style || ''
    hydrateBackgroundFromStyle(initialBg, base.background?.type)
    backgroundScreenshotId.value = override.backgroundScreenshotId || null
    const backgroundAsset = store.getBackgroundAsset(base.id)
    if (backgroundAsset) {
      backgroundUploadedUrl.value = backgroundAsset.url
      backgroundUploadName.value = backgroundAsset.name
      backgroundImageUrl.value = backgroundAsset.url
    } else {
      backgroundUploadedUrl.value = ''
      backgroundUploadName.value = ''
    }
    backgroundUploadError.value = ''
  } else {
    backgroundMode.value = 'gradient'
    solidColor.value = '#0f172a'
    gradientStart.value = '#f4b51e'
    gradientEnd.value = '#f03a47'
    gradientAngle.value = 210
    backgroundImageUrl.value = ''
    backgroundScreenshotId.value = null
    backgroundUploadedUrl.value = ''
    backgroundUploadName.value = ''
    backgroundUploadError.value = ''
  }

  if (controls.logo && base.logo) {
    logoLabel.value = override.logo?.label ?? base.logo.label ?? 'Logo'
    logoBg.value = override.logo?.background ?? base.logo.background ?? '#ffffff'
    logoText.value = override.logo?.textColor ?? base.logo.textColor ?? '#000000'
    logoImageUrl.value = override.logo?.imageUrl || base.logo.imageUrl || store.getLogoAsset(base.id)?.url || ''
    if (logoImageUrl.value) {
      logoBg.value = 'transparent'
    }
  } else {
    logoLabel.value = base.logo?.label ?? 'Logo'
    logoBg.value = base.logo?.background ?? '#ffffff'
    logoText.value = base.logo?.textColor ?? '#000000'
    logoImageUrl.value = ''
  }

  if (controls.mockup && base.mockup?.enabled) {
    const overrideMockup = override.mockup || {}
    const mockupAsset = store.getMockupAsset(base.id)
    mockupUploadedUrl.value = mockupAsset?.url || ''
    mockupUploadName.value = mockupAsset?.name || ''
    mockupUrlInput.value = overrideMockup.contentImage && overrideMockup.contentImage !== mockupUploadedUrl.value ? overrideMockup.contentImage : ''
    mockupScreenshotId.value = overrideMockup.screenshotId || null
    mockupObjectPosition.value = overrideMockup.imageStyle?.objectPosition || base.mockup.imageStyle?.objectPosition || 'center 52%'
  } else {
    mockupUrlInput.value = ''
    mockupUploadedUrl.value = ''
    mockupUploadName.value = ''
    mockupScreenshotId.value = null
    mockupObjectPosition.value = 'center 52%'
  }

  logoError.value = ''
  mockupUploadError.value = ''
  ready.value = true
}

watch(
  () => props.screen,
  (screen) => {
    ready.value = false
    if (!screen) return
    hydrateFromScreen()
  },
  { immediate: true }
)

watch(
  [
    selectedScreenshotId,
    title,
    subtitle,
    overlayCss,
    backgroundMode,
    solidColor,
    gradientStart,
    gradientEnd,
    gradientAngle,
    backgroundImageUrl,
    backgroundScreenshotId,
    backgroundUploadedUrl,
    logoLabel,
    logoBg,
    logoText,
    logoImageUrl,
    mockupUrlInput,
    mockupUploadedUrl,
    mockupScreenshotId,
    mockupObjectPosition,
    fieldControls
  ],
  () => {
    if (!ready.value || !props.screen) return
    const controls = fieldControls.value
    const payload = {}

    if (controls.media) {
      payload.screenshotId = selectedScreenshotId.value
    }
    if (controls.title) {
      payload.title = title.value
    }
    if (controls.subtitle) {
      payload.subtitle = subtitle.value
    }
    if (controls.overlay) {
      payload.overlayStyle = overlayCss.value || null
    }
    if (controls.background) {
      payload.backgroundStyle = buildBackgroundStyle()
      payload.backgroundMode = backgroundMode.value
      payload.backgroundScreenshotId = backgroundMode.value === 'image' ? backgroundScreenshotId.value : null
      const backgroundAsset = props.screen ? store.getBackgroundAsset(props.screen.id) : null
      payload.backgroundUploadAssetId = backgroundMode.value === 'image' && backgroundAsset ? backgroundAsset.id : null
    }

    if (controls.logo && props.screen.logo) {
      const options = logoOptions.value
      const baseLogo = props.screen.logo
      const logoPayload = {
        visible: baseLogo.visible ?? true,
        label: baseLogo.label,
        background: baseLogo.background,
        textColor: baseLogo.textColor,
        imageUrl: logoImageUrl.value || baseLogo.imageUrl || null
      }
      if (options.allowLabel) {
        logoPayload.label = logoLabel.value
      }
      if (options.allowColors) {
        logoPayload.background = logoBg.value
        logoPayload.textColor = logoText.value
      }
      if (logoPayload.imageUrl) {
        logoPayload.background = 'transparent'
      }
      payload.logo = logoPayload
    }

    if (controls.mockup && props.screen.mockup?.enabled) {
      const options = mockupOptions.value
      const fallbackScreenshot = options.allowScreenshot ? getScreenshotUrl(mockupScreenshotId.value || selectedScreenshotId.value) : null
      const contentImage = resolvedMockupImage.value || fallbackScreenshot || props.screen.mockup.contentImage
      const mockupPayload = {
        contentImage
      }
      if (options.allowScreenshot) {
        mockupPayload.screenshotId = mockupScreenshotId.value || null
      }
      if (options.allowObjectPosition) {
        mockupPayload.imageStyle = {
          ...(props.screen.mockup.imageStyle || {}),
          objectPosition: mockupObjectPosition.value
        }
      }
      payload.mockup = mockupPayload
    }
    if (Object.keys(payload).length) {
      store.setSlideOverride(props.screen.id, payload)
    }
  },
  { deep: true }
)

const triggerLogoInput = () => {
  if (logoInput.value) {
    logoInput.value.click()
  }
}

const triggerBackgroundInput = () => {
  if (backgroundInput.value) {
    backgroundInput.value.click()
  }
}

const handleLogoUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file || !props.screen) return
  const result = store.setLogoAsset(props.screen.id, file)
  if (!result.ok) {
    logoError.value = result.message
  } else {
    logoError.value = ''
    logoImageUrl.value = result.asset.url
  }
  event.target.value = ''
}

const clearLogoImage = () => {
  if (!props.screen) return
  store.removeLogoAsset(props.screen.id)
  logoImageUrl.value = ''
  if (props.screen.logo) {
    logoBg.value = props.screen.logo.background ?? '#ffffff'
    logoText.value = props.screen.logo.textColor ?? '#000000'
  }
}

const handleBackgroundUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file || !props.screen) return
  const result = store.setBackgroundAsset(props.screen.id, file)
  if (!result.ok) {
    backgroundUploadError.value = result.message
  } else {
    backgroundUploadError.value = ''
    backgroundMode.value = 'image'
    backgroundUploadedUrl.value = result.asset.url
    backgroundUploadName.value = result.asset.name
    backgroundImageUrl.value = result.asset.url
    backgroundScreenshotId.value = null
  }
  event.target.value = ''
}

const clearBackgroundUpload = () => {
  if (!props.screen) return
  store.removeBackgroundAsset(props.screen.id)
  backgroundUploadedUrl.value = ''
  backgroundUploadName.value = ''
  backgroundUploadError.value = ''
  if (backgroundMode.value === 'image') {
    if (backgroundScreenshotId.value) {
      const url = getScreenshotUrl(backgroundScreenshotId.value)
      backgroundImageUrl.value = url || ''
    } else {
      backgroundImageUrl.value = ''
    }
  }
}

const onBackgroundUrlInput = () => {
  backgroundMode.value = 'image'
  backgroundScreenshotId.value = null
  if (props.screen && backgroundUploadedUrl.value) {
    store.removeBackgroundAsset(props.screen.id)
    backgroundUploadedUrl.value = ''
    backgroundUploadName.value = ''
  }
  backgroundUploadError.value = ''
}

const triggerMockupInput = () => {
  if (mockupInput.value) {
    mockupInput.value.click()
  }
}

const handleMockupUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file || !props.screen) return
  const result = store.setMockupAsset(props.screen.id, file)
  if (!result.ok) {
    mockupUploadError.value = result.message
  } else {
    mockupUploadError.value = ''
    mockupUploadedUrl.value = result.asset.url
    mockupUploadName.value = result.asset.name
    mockupUrlInput.value = ''
  }
  event.target.value = ''
}

const clearMockupUpload = () => {
  if (!props.screen) return
  store.removeMockupAsset(props.screen.id)
  mockupUploadedUrl.value = ''
  mockupUploadName.value = ''
  mockupUploadError.value = ''
}

const emitClose = () => emit('close')

watch(backgroundScreenshotId, (newId, oldId) => {
  if (!ready.value || !props.screen) return
  if (backgroundMode.value !== 'image') return
  if (newId) {
    const url = getScreenshotUrl(newId)
    if (url) {
      if (backgroundUploadedUrl.value) {
        store.removeBackgroundAsset(props.screen.id)
        backgroundUploadedUrl.value = ''
        backgroundUploadName.value = ''
      }
      backgroundImageUrl.value = url
      backgroundUploadError.value = ''
    }
  } else if (!backgroundUploadedUrl.value) {
    backgroundImageUrl.value = ''
  }
})
</script>
