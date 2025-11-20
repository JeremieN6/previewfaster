<template>
  <section class="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
    <header class="mb-4 flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Étape 2</p>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Cartes texte</h3>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500"
        @click="store.addTextCard()"
      >
        + Ajouter
      </button>
    </header>

    <p class="mb-4 text-sm text-gray-600 dark:text-gray-300">
      Utilise des cartes compactes pour propager titres et textes sur chaque template.
    </p>

    <div class="space-y-3">
      <article
        v-for="card in store.state.textCards"
        :key="card.id"
        class="rounded-xl border border-gray-100 bg-gray-50 shadow-sm transition dark:border-gray-700 dark:bg-gray-900"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between px-4 py-3 text-left"
          @click="toggle(card.id)"
        >
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ card.title || 'Carte sans titre' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ card.text?.slice(0, 60) || 'Ajoute un texte descriptif' }}</p>
          </div>
          <svg
            class="h-4 w-4 text-gray-500 transition"
            :class="{ 'rotate-180': openCardId === card.id }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="openCardId === card.id" class="border-t border-gray-100 px-4 py-4 text-sm dark:border-gray-700">
          <div class="space-y-3">
            <label class="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Titre
              <input
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                :value="card.title"
                @input="update(card.id, 'title', $event.target.value)"
              />
            </label>
            <label class="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Texte
              <textarea
                rows="2"
                class="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                :value="card.text"
                @input="update(card.id, 'text', $event.target.value)"
              />
            </label>
            <div class="flex gap-3 text-xs font-semibold">
              <button
                type="button"
                class="rounded-lg border border-blue-100 px-3 py-2 text-blue-600 hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-300"
                @click="store.duplicateTextCard(card.id)"
              >
                Dupliquer
              </button>
              <button
                type="button"
                class="rounded-lg border border-red-100 px-3 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:text-red-300"
                :disabled="store.state.textCards.length <= 1"
                @click="store.deleteTextCard(card.id)"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useBuilderStore } from '../store/builderStore'

const store = useBuilderStore()
const openCardId = ref(store.state.textCards[0]?.id || null)

const update = (id, key, value) => {
  store.updateTextCard(id, { [key]: value })
}

const toggle = (id) => {
  openCardId.value = openCardId.value === id ? null : id
}
</script>
