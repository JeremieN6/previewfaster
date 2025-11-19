<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <header class="mb-4">
      <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">Catégories</p>
      <h3 class="text-lg font-semibold text-slate-900">Filtre tes templates</h3>
    </header>

    <div class="flex flex-col gap-2">
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="flex items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition-colors"
        :class="
          store.state.selectedCategory === category.id
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 text-slate-700 hover:border-slate-400'
        "
        @click="store.setSelectedCategory(category.id)"
      >
        <span>{{ category.label }}</span>
        <span class="text-xs font-normal text-white/80" v-if="store.state.selectedCategory === category.id">Actif</span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { useBuilderStore } from '../store/builderStore'

const categories = [
  { id: 'business', label: 'Business' },
  { id: 'education', label: 'Education' },
  { id: 'finance', label: 'Finance' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'lifestyle', label: 'Lifestyle' }
]

const store = useBuilderStore()
</script>
