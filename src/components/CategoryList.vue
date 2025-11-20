<template>
  <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
    <header class="mb-4">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Étape 3</p>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Choisis une catégorie</h3>
      <p class="text-sm text-gray-500 dark:text-gray-300">La liste de mockups à droite se mettra à jour automatiquement.</p>
    </header>

    <div class="space-y-2">
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition"
        :class="
          store.state.selectedCategory === category.id
            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-200'
            : 'border-gray-200 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-200'
        "
        @click="store.setSelectedCategory(category.id)"
      >
        <div>
          <p>{{ category.label }}</p>
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400">{{ category.caption }}</p>
        </div>
        <span
          class="text-xs font-semibold"
          :class="store.state.selectedCategory === category.id ? 'text-blue-600 dark:text-blue-200' : 'text-gray-400'"
        >
          {{ store.state.selectedCategory === category.id ? 'Actif' : 'Choisir' }}
        </span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { useBuilderStore } from '../store/builderStore'

const categories = [
  { id: 'all', label: 'Tous les templates', caption: 'Afficher tous les packs' },
  { id: 'business', label: 'Business', caption: 'Dashboards & SaaS' },
  { id: 'education', label: 'Education', caption: 'Cours & onboarding' },
  { id: 'finance', label: 'Finance', caption: 'Fintech & analytics' },
  { id: 'navigation', label: 'Navigation', caption: 'Mobilité & carte' },
  { id: 'shopping', label: 'Shopping', caption: 'E-commerce & drops' },
  { id: 'lifestyle', label: 'Lifestyle', caption: 'Stories & inspiration' }
]

const store = useBuilderStore()
</script>
