export const initialDesignSections = [
  {
    id: 'design-1',
    title: 'Design 1',
    downloadLabel: 'Télécharger ce design',
    cards: [
      {
        id: 'design-1-card-1',
        variant: 'mockup-dark',
        theme: 'purple-dark',
        title: 'One app<br>All the rides',
        screenshotUrl: 'https://placehold.co/390x844/667eea/FFFFFF?text=Screenshot+1',
        background: {
          mode: 'gradient',
          solid: '#1a1a2e',
          gradientStart: '#2d1b4e',
          gradientEnd: '#1a0f2e',
          imageUrl: ''
        },
        options: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'screenshotUrl', label: 'Capture', type: 'image' },
          { key: 'background', label: 'Fond', type: 'background' }
        ]
      },
      {
        id: 'design-1-card-2',
        variant: 'mockup-dark',
        theme: 'purple-medium',
        title: 'Be there soon<br>Really soon',
        screenshotUrl: 'https://placehold.co/390x844/764ba2/FFFFFF?text=Screenshot+2',
        background: {
          mode: 'gradient',
          solid: '#2d1b4e',
          gradientStart: '#4a2c6b',
          gradientEnd: '#2d1b4e',
          imageUrl: ''
        },
        options: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'screenshotUrl', label: 'Capture', type: 'image' },
          { key: 'background', label: 'Fond', type: 'background' }
        ]
      },
      {
        id: 'design-1-card-3',
        variant: 'mockup-dark',
        theme: 'beige-warm',
        title: 'Being flexible can<br>save you money',
        screenshotUrl: 'https://placehold.co/390x844/d4a574/FFFFFF?text=Screenshot+3',
        background: {
          mode: 'gradient',
          solid: '#8b6f47',
          gradientStart: '#8b6f47',
          gradientEnd: '#5d4a31',
          imageUrl: ''
        },
        options: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'screenshotUrl', label: 'Capture', type: 'image' },
          { key: 'background', label: 'Fond', type: 'background' }
        ]
      },
      {
        id: 'design-1-card-4',
        variant: 'mockup-dark',
        theme: 'gray-urban',
        title: 'How you get there<br>is up to you',
        screenshotUrl: 'https://placehold.co/390x844/8b9ba8/FFFFFF?text=Screenshot+4',
        background: {
          mode: 'gradient',
          solid: '#4a5568',
          gradientStart: '#4a5568',
          gradientEnd: '#2d3748',
          imageUrl: ''
        },
        options: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'screenshotUrl', label: 'Capture', type: 'image' },
          { key: 'background', label: 'Fond', type: 'background' }
        ]
      },
      {
        id: 'design-1-card-5',
        variant: 'mockup-dark',
        theme: 'green-dark',
        title: 'Schedule ahead,<br>leave stress behind',
        screenshotUrl: 'https://placehold.co/390x844/3d5a4a/FFFFFF?text=Screenshot+5',
        background: {
          mode: 'gradient',
          solid: '#2d4a3e',
          gradientStart: '#2d4a3e',
          gradientEnd: '#1a2f26',
          imageUrl: ''
        },
        options: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'screenshotUrl', label: 'Capture', type: 'image' },
          { key: 'background', label: 'Fond', type: 'background' }
        ]
      }
    ]
  },
  {
    id: 'design-2',
    title: 'Design 2',
    downloadLabel: 'Télécharger ce design',
    cards: [
      {
        id: 'design-2-card-1',
        variant: 'feature-card',
        title: 'The official<br>Premier League<br>app',
        logoUrl: 'https://placehold.co/80x80/3d195b/FFFFFF?text=Logo',
        background: {
          mode: 'image',
          imageUrl: 'https://placehold.co/350x700/e9c9db/FFFFFF?text=Background+Image',
          solid: '#3d195b',
          gradientStart: '#3d195b',
          gradientEnd: '#1a0d2e'
        },
        options: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'logoUrl', label: 'Logo', type: 'image' },
          { key: 'background', label: 'Fond', type: 'background' }
        ]
      },
      {
        id: 'design-2-card-2',
        variant: 'image-only',
        background: {
          mode: 'image',
          imageUrl: 'https://placehold.co/350x700/c8102e/FFFFFF?text=Full+Screen+Image',
          solid: '#c8102e',
          gradientStart: '#c8102e',
          gradientEnd: '#8b0c22'
        },
        options: [
          { key: 'background', label: 'Image', type: 'background' }
        ]
      },
      {
        id: 'design-2-card-3',
        variant: 'image-text',
        title: 'The new<br>home of the<br>Premier League',
        background: {
          mode: 'image',
          imageUrl: 'https://placehold.co/350x700/f7a5c7/FFFFFF?text=Background+Image',
          solid: '#f7a5c7',
          gradientStart: '#f7a5c7',
          gradientEnd: '#d868a3'
        },
        options: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'background', label: 'Fond', type: 'background' }
        ]
      },
      {
        id: 'design-2-card-4',
        variant: 'mockup-light',
        title: 'Follow every game<br>with Matchday Live',
        subtitle: 'Verified live scores, statistics and table updates, including links to watch official broadcasts live wherever you are',
        screenshotUrl: 'https://placehold.co/390x844/FFFFFF/000000?text=App+Screenshot',
        background: {
          mode: 'gradient',
          solid: '#3d195b',
          gradientStart: '#3d195b',
          gradientEnd: '#1a0d2e',
          imageUrl: ''
        },
        options: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'subtitle', label: 'Sous-titre', type: 'text' },
          { key: 'screenshotUrl', label: 'Capture', type: 'image' },
          { key: 'background', label: 'Fond', type: 'background' }
        ]
      },
      {
        id: 'design-2-card-5',
        variant: 'mockup-light',
        title: "Don't miss<br>a moment with<br>Matchday Stories",
        subtitle: 'Vertical storytelling of every match from every ground as it happens',
        screenshotUrl: 'https://placehold.co/390x844/FFFFFF/000000?text=App+Screenshot',
        background: {
          mode: 'gradient',
          solid: '#3d195b',
          gradientStart: '#764ba2',
          gradientEnd: '#3d195b',
          imageUrl: ''
        },
        options: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'subtitle', label: 'Sous-titre', type: 'text' },
          { key: 'screenshotUrl', label: 'Capture', type: 'image' },
          { key: 'background', label: 'Fond', type: 'background' }
        ]
      }
    ]
  }
]
