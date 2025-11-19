export const templatePacks = [
  {
    id: 'neon-business',
    name: 'Neon Business',
    categories: ['business', 'finance', 'navigation'],
    slides: [
      {
        id: 'neon-business-1',
        name: 'Launch Metrics',
        description: 'Bold hero with gradient background',
        background: {
          mode: 'gradient',
          solid: '#111827',
          gradientStart: '#0f172a',
          gradientEnd: '#1d4ed8'
        },
        screenshotArea: {
          width: '68%',
          height: '76%',
          top: '14%',
          left: '16%',
          borderRadius: '32px',
          shadow: '0 20px 45px rgba(15, 23, 42, 0.55)'
        },
        textZones: [
          {
            id: 'title',
            top: '5%',
            left: '10%',
            width: '80%',
            className: 'text-white text-[11px] font-semibold leading-snug'
          },
          {
            id: 'subtitle',
            top: '82%',
            left: '10%',
            width: '80%',
            className: 'text-indigo-100 text-[10px] leading-tight'
          }
        ]
      },
      {
        id: 'neon-business-2',
        name: 'KPI Spotlight',
        description: 'Split background with pill CTA',
        background: {
          mode: 'gradient',
          solid: '#020617',
          gradientStart: '#312e81',
          gradientEnd: '#0f172a'
        },
        screenshotArea: {
          width: '60%',
          height: '78%',
          top: '12%',
          left: '5%',
          borderRadius: '26px',
          shadow: '0 18px 35px rgba(49, 46, 129, 0.45)'
        },
        textZones: [
          {
            id: 'title',
            top: '18%',
            left: '68%',
            width: '26%',
            className: 'text-white text-[11px] font-semibold'
          },
          {
            id: 'subtitle',
            top: '42%',
            left: '68%',
            width: '26%',
            className: 'text-slate-200 text-[9px] leading-tight'
          }
        ]
      },
      {
        id: 'neon-business-3',
        name: 'Navigation Coach',
        description: 'Card with angled phone',
        background: {
          mode: 'solid',
          solid: '#0f0f0f',
          gradientStart: '#0f0f0f',
          gradientEnd: '#0f0f0f'
        },
        screenshotArea: {
          width: '70%',
          height: '78%',
          top: '14%',
          left: '16%',
          borderRadius: '32px',
          shadow: '0 25px 50px rgba(0,0,0,0.45)'
        },
        textZones: [
          {
            id: 'title',
            top: '6%',
            left: '10%',
            width: '80%',
            className: 'text-amber-200 text-[11px] uppercase tracking-wide'
          },
          {
            id: 'subtitle',
            top: '82%',
            left: '10%',
            width: '80%',
            className: 'text-slate-200 text-[9px]'
          }
        ]
      },
      {
        id: 'neon-business-4',
        name: 'Finance Loop',
        description: 'Bold grid layout',
        background: {
          mode: 'gradient',
          solid: '#111827',
          gradientStart: '#0f172a',
          gradientEnd: '#0ea5e9'
        },
        screenshotArea: {
          width: '64%',
          height: '70%',
          top: '18%',
          left: '18%',
          borderRadius: '28px',
          shadow: '0 20px 40px rgba(14, 165, 233, 0.35)'
        },
        textZones: [
          {
            id: 'title',
            top: '6%',
            left: '12%',
            width: '76%',
            className: 'text-white text-[11px] font-semibold'
          },
          {
            id: 'subtitle',
            top: '84%',
            left: '12%',
            width: '76%',
            className: 'text-cyan-50 text-[9px]'
          }
        ]
      },
      {
        id: 'neon-business-5',
        name: 'Command Center',
        description: 'Stacked cards',
        background: {
          mode: 'solid',
          solid: '#020617',
          gradientStart: '#020617',
          gradientEnd: '#020617'
        },
        screenshotArea: {
          width: '58%',
          height: '74%',
          top: '20%',
          left: '22%',
          borderRadius: '30px',
          shadow: '0 24px 45px rgba(15,23,42,0.6)'
        },
        textZones: [
          {
            id: 'title',
            top: '8%',
            left: '20%',
            width: '60%',
            className: 'text-white text-[10px] uppercase tracking-[0.15em]'
          },
          {
            id: 'subtitle',
            top: '84%',
            left: '15%',
            width: '70%',
            className: 'text-slate-300 text-[9px]'
          }
        ]
      }
    ]
  },
  {
    id: 'soft-lifestyle',
    name: 'Soft Lifestyle',
    categories: ['lifestyle', 'education', 'shopping'],
    slides: [
      {
        id: 'soft-lifestyle-1',
        name: 'Pastel Stories',
        description: 'Soft gradients with large copy',
        background: {
          mode: 'gradient',
          solid: '#fdf2f8',
          gradientStart: '#fbcfe8',
          gradientEnd: '#e0f2fe'
        },
        screenshotArea: {
          width: '65%',
          height: '75%',
          top: '14%',
          left: '18%',
          borderRadius: '32px',
          shadow: '0 20px 35px rgba(244, 114, 182, 0.35)'
        },
        textZones: [
          {
            id: 'title',
            top: '6%',
            left: '15%',
            width: '70%',
            className: 'text-pink-700 text-[11px] font-semibold'
          },
          {
            id: 'subtitle',
            top: '82%',
            left: '15%',
            width: '70%',
            className: 'text-slate-600 text-[9px]'
          }
        ]
      },
      {
        id: 'soft-lifestyle-2',
        name: 'Editorial Frame',
        description: 'Left column copy with frame',
        background: {
          mode: 'solid',
          solid: '#fef3c7',
          gradientStart: '#fef3c7',
          gradientEnd: '#fde68a'
        },
        screenshotArea: {
          width: '55%',
          height: '70%',
          top: '18%',
          left: '38%',
          borderRadius: '28px',
          shadow: '0 18px 30px rgba(249, 168, 38, 0.35)'
        },
        textZones: [
          {
            id: 'title',
            top: '20%',
            left: '8%',
            width: '26%',
            className: 'text-amber-900 text-[11px] font-semibold'
          },
          {
            id: 'subtitle',
            top: '42%',
            left: '8%',
            width: '26%',
            className: 'text-amber-700 text-[9px]'
          }
        ]
      },
      {
        id: 'soft-lifestyle-3',
        name: 'Moodboard',
        description: 'Collage look with overlay text',
        background: {
          mode: 'gradient',
          solid: '#ecfeff',
          gradientStart: '#bae6fd',
          gradientEnd: '#fdf2f8'
        },
        screenshotArea: {
          width: '70%',
          height: '60%',
          top: '30%',
          left: '15%',
          borderRadius: '24px',
          shadow: '0 18px 30px rgba(14,165,233,0.25)'
        },
        textZones: [
          {
            id: 'title',
            top: '8%',
            left: '10%',
            width: '80%',
            className: 'text-slate-700 text-[11px] font-semibold'
          },
          {
            id: 'subtitle',
            top: '20%',
            left: '10%',
            width: '80%',
            className: 'text-slate-500 text-[9px]'
          }
        ]
      },
      {
        id: 'soft-lifestyle-4',
        name: 'Shopping Drop',
        description: 'Product focus frame',
        background: {
          mode: 'solid',
          solid: '#fef9c3',
          gradientStart: '#fef9c3',
          gradientEnd: '#fde68a'
        },
        screenshotArea: {
          width: '62%',
          height: '72%',
          top: '16%',
          left: '20%',
          borderRadius: '30px',
          shadow: '0 22px 35px rgba(234,179,8,0.35)'
        },
        textZones: [
          {
            id: 'title',
            top: '6%',
            left: '15%',
            width: '70%',
            className: 'text-rose-600 text-[11px] font-semibold'
          },
          {
            id: 'subtitle',
            top: '84%',
            left: '15%',
            width: '70%',
            className: 'text-rose-400 text-[9px]'
          }
        ]
      },
      {
        id: 'soft-lifestyle-5',
        name: 'Learning Stack',
        description: 'Education inspired gradient',
        background: {
          mode: 'gradient',
          solid: '#fdf2f8',
          gradientStart: '#ede9fe',
          gradientEnd: '#cffafe'
        },
        screenshotArea: {
          width: '58%',
          height: '70%',
          top: '18%',
          left: '24%',
          borderRadius: '28px',
          shadow: '0 18px 35px rgba(99,102,241,0.25)'
        },
        textZones: [
          {
            id: 'title',
            top: '10%',
            left: '12%',
            width: '76%',
            className: 'text-indigo-700 text-[11px] font-semibold'
          },
          {
            id: 'subtitle',
            top: '84%',
            left: '12%',
            width: '76%',
            className: 'text-indigo-400 text-[9px]'
          }
        ]
      }
    ]
  }
]

export const templateSlides = templatePacks.flatMap((pack) =>
  pack.slides.map((slide) => ({
    ...slide,
    packId: pack.id,
    packName: pack.name,
    categories: pack.categories
  }))
)
