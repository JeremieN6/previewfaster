import { initialDesignSections } from './designs'

const categoryMap = {
  'design-1': ['business', 'lifestyle', 'shopping'],
  'design-2': ['business', 'education', 'lifestyle']
}

const variantConfig = {
  'mockup-dark': {
    frame: 'dark',
    renderMode: 'device',
    screenshotArea: {
      width: '64%',
      height: '74%',
      top: '16%',
      left: '18%'
    },
    overlay: null,
    textZones: [
      {
        id: 'title',
        top: '6%',
        left: '12%',
        width: '76%',
        className: 'text-white text-[11px] font-semibold leading-snug'
      },
      {
        id: 'text',
        top: '82%',
        left: '12%',
        width: '76%',
        className: 'text-indigo-100 text-[9px] leading-tight'
      }
    ]
  },
  'mockup-light': {
    frame: 'light',
    renderMode: 'device',
    screenshotArea: {
      width: '58%',
      height: '72%',
      top: '18%',
      left: '22%'
    },
    logoZone: {
      top: '4%',
      left: '40%',
      width: '20%',
      height: '10%',
      borderRadius: '9999px'
    },
    overlay: null,
    textZones: [
      {
        id: 'title',
        top: '14%',
        left: '15%',
        width: '70%',
        className: 'font-serif text-slate-900 text-[20px] font-semibold leading-tight'
      },
      {
        id: 'text',
        top: '32%',
        left: '15%',
        width: '70%',
        className: 'text-slate-600 text-[13px]'
      }
    ]
  },
  'feature-card': {
    frame: 'gradient',
    renderMode: 'background',
    overlay: 'linear-gradient(180deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0) 45%, rgba(2,6,23,0.55) 100%)',
    logoZone: {
      top: '8%',
      left: '8%',
      width: '18%',
      height: '18%',
      borderRadius: '9999px'
    },
    textZones: [
      {
        id: 'title',
        top: '12%',
        left: '10%',
        width: '80%',
        className: 'text-white text-[26px] font-semibold leading-tight'
      },
      {
        id: 'text',
        top: '30%',
        left: '10%',
        width: '80%',
        className: 'text-white/80 text-[16px]'
      }
    ]
  },
  'image-only': {
    frame: 'gradient',
    renderMode: 'background',
    overlay: null,
    textZones: []
  },
  'image-text': {
    frame: 'gradient',
    renderMode: 'background',
    overlay: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.65) 100%)',
    textZones: [
      {
        id: 'title',
        top: '12%',
        left: '10%',
        width: '80%',
        className: 'text-white text-[26px] font-semibold leading-tight'
      },
      {
        id: 'text',
        top: '46%',
        left: '10%',
        width: '80%',
        className: 'text-white/75 text-[16px]'
      }
    ]
  }
}

const stripHtml = (value = '') => value.replace(/<br\s*\/?>(\s)?/gi, ' ').trim()

export const templatePacks = initialDesignSections.map((section) => ({
  id: section.id,
  name: section.title,
  categories: categoryMap[section.id] || ['business'],
  slides: section.cards.map((card, index) => {
    const preset = variantConfig[card.variant] || variantConfig['mockup-dark']
    return {
      id: card.id,
      name: `${section.title} · ${index + 1}`,
      variant: card.variant,
      frame: preset.frame,
      renderMode: preset.renderMode,
      packId: section.id,
      packName: section.title,
      order: index,
      background: card.background,
      overlay: preset.overlay || null,
      screenshotArea: preset.screenshotArea || {
        width: '60%',
        height: '70%',
        top: '18%',
        left: '20%'
      },
      textZones: preset.textZones,
      logoZone: preset.logoZone || null,
      defaultTitle: stripHtml(card.title || 'Titre personnalisé'),
      defaultText: stripHtml(card.subtitle || 'Ajoute ton texte'),
      baseScreenshot: card.screenshotUrl || 'https://placehold.co/390x844/e2e8f0/1e293b?text=Screenshot',
      baseLogo: card.logoUrl || null
    }
  })
}))

export const templateSlides = templatePacks.flatMap((pack) =>
  pack.slides.map((slide) => ({
    ...slide,
    categories: pack.categories
  }))
)
