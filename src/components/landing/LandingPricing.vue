<template>
  <section class="bg-gray-50 dark:bg-gray-800">
    <div class="mx-auto max-w-screen-xl px-4 py-16 lg:py-20 lg:px-6">
      <div class="mx-auto mb-12 max-w-screen-md text-center">
        <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Le tarif varie selon vos besoins</h2>
        <p class="text-lg text-gray-500 dark:text-gray-400">
          Gratuit pour débuter, plan Pro quand vous avez besoin d’exports illimités, de templates premium et d’un support prioritaire.
        </p>
      </div>
      <div class="space-y-8 lg:grid lg:grid-cols-2 lg:space-y-0 lg:gap-8">
        <article
          v-for="plan in plans"
          :key="plan.title"
          class="flex flex-col rounded-lg border border-gray-100 bg-white p-6 text-center shadow dark:border-gray-700 dark:bg-gray-800"
        >
          <h3 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">{{ plan.title }}</h3>
          <p class="text-gray-500 dark:text-gray-400">{{ plan.description }}</p>
          <div class="my-8 flex items-center justify-center">
            <span class="mr-2 text-5xl font-extrabold text-gray-900 dark:text-white">{{ plan.price }}</span>
            <!--<span class="text-gray-500 dark:text-gray-400">/ mois</span>-->
          </div>
          <ul class="mb-8 space-y-4 text-left">
            <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-gray-700 dark:text-gray-200">
              <svg class="h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
              <span>{{ feature }}</span>
            </li>
          </ul>
          <button
            type="button"
            :class="[
              'rounded-lg px-5 py-2.5 text-sm font-medium transition',
              plan.highlight
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
            ]"
          >
            {{ plan.cta }}
          </button>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const plans = [
  {
    title: '💸 Gratuit à vie',
    price: '0€',
    description: 'Parfait pour tester et produire vos premiers mockups marketing.',
    features: ['5 exports HD / mois', '12 templates iOS & Android', 'Blocs texte personnalisables', 'Sauvegarde locale & thème sombre'],
    cta: 'Commencer gratuitement',
    highlight: false
  },
  {
    title: '🔥 Plan Pro',
    price: '19,90€',
    description: 'Idéal pour les studios qui livrent des visuels chaque semaine.',
    features: ['Exports illimités (PNG + ZIP)', 'Templates premium mis à jour', 'Exports partagés avec vos clients', 'Support prioritaire + roadmap privée'],
    cta: 'Acheter maintenant',
    highlight: true
  }
]
</script>
