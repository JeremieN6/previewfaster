<template>
  <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
    <header class="mb-4">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Étape 3</p>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Choisis une catégorie</h3>
      <p class="text-sm text-gray-500 dark:text-gray-300">La liste de mockups à droite se mettra à jour automatiquement.</p>
    </header>

    <ul class="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden dark:border-gray-700 dark:divide-gray-700">
      <li
        v-for="category in categories"
        :key="category.id"
        class="bg-white dark:bg-gray-800"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold transition"
          :class="
            store.state.selectedCategory === category.id
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/40'
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
      </li>
    </ul>
  </section>
</template>

<script setup>
import { useBuilderStore } from '../store/builderStore'

const categories = [
  { id: 'all', label: 'Tous les templates', caption: 'Afficher tous les packs' },
  { id: 'nutrition', label: 'Nutrition', caption: 'Alma / santé / food' },
  { id: 'sports', label: 'Sports', caption: 'Premier League & stats' },
  { id: 'messaging', label: 'Messaging', caption: 'Chat / messages / social' },
  { id: 'business', label: 'Business', caption: 'Dashboards & SaaS' },
  { id: 'finance', label: 'Finance', caption: 'Fintech & analytics' },
  { id: 'education', label: 'Education', caption: 'Cours & onboarding' },
  { id: 'shopping', label: 'Shopping', caption: 'E-commerce & drops' },
  { id: 'lifestyle', label: 'Lifestyle', caption: 'Stories & inspiration' }
]

const store = useBuilderStore()
</script>
