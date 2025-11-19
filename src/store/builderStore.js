import { computed, reactive } from 'vue'

const createId = () => Math.random().toString(36).slice(2, 10)

const defaultTextCards = [
  {
    id: createId(),
    title: 'Boost your KPIs',
    subtitle: 'Screens that convert in under 5 minutes'
  },
  {
    id: createId(),
    title: 'Tell a better story',
    subtitle: 'Mix copy + mockups for social-ready assets'
  }
]

const state = reactive({
  screenshots: [],
  textCards: defaultTextCards,
  selectedCategory: 'business',
  selectedTemplateId: null,
  overrides: {}
})

const isValidImage = (file) => /image\/(png|jpe?g)$/i.test(file.type)

const makeScreenshot = (file) => ({
  id: createId(),
  file,
  name: file.name,
  url: URL.createObjectURL(file)
})

export function useBuilderStore() {
  const screenshotCount = computed(() => state.screenshots.length)

  const addScreenshots = (files) => {
    const incoming = Array.from(files).filter(isValidImage)
    if (!incoming.length) {
      return { ok: false, message: 'Formats acceptés: JPG ou PNG.' }
    }

    const total = state.screenshots.length + incoming.length
    if (total > 10) {
      return { ok: false, message: 'Limite atteinte: 10 captures maximum.' }
    }

    incoming.forEach((file) => state.screenshots.push(makeScreenshot(file)))
    return { ok: true }
  }

  const removeScreenshot = (id) => {
    const index = state.screenshots.findIndex((shot) => shot.id === id)
    if (index !== -1) {
      URL.revokeObjectURL(state.screenshots[index].url)
      state.screenshots.splice(index, 1)
    }
  }

  const clearScreenshots = () => {
    state.screenshots.forEach((shot) => URL.revokeObjectURL(shot.url))
    state.screenshots.splice(0, state.screenshots.length)
  }

  const addTextCard = () => {
    state.textCards.push({ id: createId(), title: 'Nouveau titre', subtitle: 'Nouveau sous-titre' })
  }

  const updateTextCard = (id, payload) => {
    const card = state.textCards.find((item) => item.id === id)
    if (!card) return
    Object.assign(card, payload)
  }

  const duplicateTextCard = (id) => {
    const card = state.textCards.find((item) => item.id === id)
    if (!card) return
    state.textCards.push({ id: createId(), title: `${card.title} (copy)`, subtitle: card.subtitle })
  }

  const deleteTextCard = (id) => {
    if (state.textCards.length <= 1) return
    const index = state.textCards.findIndex((item) => item.id === id)
    if (index !== -1) {
      state.textCards.splice(index, 1)
    }
  }

  const setSelectedCategory = (category) => {
    state.selectedCategory = category
  }

  const setSelectedTemplateId = (templateId) => {
    state.selectedTemplateId = templateId
  }

  const closeModal = () => {
    state.selectedTemplateId = null
  }

  const setSlideOverride = (slideId, override) => {
    state.overrides[slideId] = {
      ...state.overrides[slideId],
      ...override
    }
  }

  const getSlideOverride = (slideId) => state.overrides[slideId] || null

  return {
    state,
    screenshotCount,
    addScreenshots,
    removeScreenshot,
    clearScreenshots,
    addTextCard,
    updateTextCard,
    duplicateTextCard,
    deleteTextCard,
    setSelectedCategory,
    setSelectedTemplateId,
    closeModal,
    setSlideOverride,
    getSlideOverride
  }
}
