<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <header class="mb-4 flex items-center justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">Cartes texte</p>
        <h3 class="text-lg font-semibold text-slate-900">Synchronise les contenus</h3>
      </div>
      <button
        type="button"
        class="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        @click="store.addTextCard()"
      >
        + Ajouter
      </button>
    </header>

    <div class="space-y-4">
      <article
        v-for="card in store.state.textCards"
        :key="card.id"
        class="rounded-xl border border-slate-100 bg-slate-50 p-4"
      >
        <div class="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>Carte {{ card.title ? '“' + card.title + '”' : '' }}</span>
          <div class="flex gap-3">
            <button type="button" class="font-semibold text-indigo-600" @click="store.duplicateTextCard(card.id)">
              Dupliquer
            </button>
            <button
              type="button"
              class="font-semibold text-rose-600"
              :disabled="store.state.textCards.length <= 1"
              :class="{ 'opacity-50': store.state.textCards.length <= 1 }"
              @click="store.deleteTextCard(card.id)"
            >
              Supprimer
            </button>
          </div>
        </div>

        <label class="mb-3 block text-sm font-medium text-slate-700">
          Titre
          <input
            type="text"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
            :value="card.title"
            @input="update(card.id, 'title', $event.target.value)"
          />
        </label>

        <label class="block text-sm font-medium text-slate-700">
          Sous-titre
          <textarea
            rows="2"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
            :value="card.subtitle"
            @input="update(card.id, 'subtitle', $event.target.value)"
          />
        </label>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useBuilderStore } from '../store/builderStore'

const store = useBuilderStore()

const update = (id, key, value) => {
  store.updateTextCard(id, { [key]: value })
}
</script>
