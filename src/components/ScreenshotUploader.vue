<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <header class="mb-4">
      <p class="text-sm font-semibold uppercase tracking-wide text-slate-500">Screenshots</p>
      <h3 class="text-lg font-semibold text-slate-900">Ajoute 5 à 10 captures</h3>
      <p class="text-sm text-slate-500">PNG ou JPG uniquement.</p>
    </header>

    <div
      class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors"
      :class="[
        isDragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-slate-300 hover:border-slate-400'
      ]"
      @dragover.prevent="() => (isDragging = true)"
      @dragleave.prevent="() => (isDragging = false)"
      @drop.prevent="onDrop"
    >
      <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
          <path
            fill-rule="evenodd"
            d="M12 2.25a.75.75 0 01.75.75V11h3.25a.75.75 0 010 1.5h-3.25v7.75a.75.75 0 01-1.5 0V12.5H7a.75.75 0 010-1.5h4.25V3a.75.75 0 01.75-.75z"
            clip-rule="evenodd"
          />
          <path d="M4.5 9a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1A.75.75 0 014.5 9zm12.5 0a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1a.75.75 0 01-.75-.75z" />
          <path
            d="M6 5.75A2.75 2.75 0 018.75 3h6.5A2.75 2.75 0 0118 5.75v12.5A2.75 2.75 0 0115.25 21h-6.5A2.75 2.75 0 016 18.25V5.75zm2.75-1.25C8.06 4.5 7.5 5.06 7.5 5.75v12.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25h-6.5z"
          />
        </svg>
      </div>
      <p class="text-sm font-medium text-slate-700">
        Glisse tes fichiers ici ou
        <label for="uploader" class="cursor-pointer text-indigo-600 underline">clique pour sélectionner</label>
      </p>
      <input
        id="uploader"
        ref="fileInput"
        type="file"
        accept="image/png,image/jpeg"
        multiple
        class="sr-only"
        @change="onInput"
      />
      <p class="mt-2 text-xs text-slate-500">Minimum 5, maximum 10 captures.</p>
    </div>

    <p class="mt-3 text-sm font-medium" :class="enoughScreenshots ? 'text-green-600' : 'text-amber-600'">
      {{ store.state.screenshots.length }}/10 captures · {{ statusMessage }}
    </p>

    <p v-if="errorMessage" class="mt-2 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-600">
      {{ errorMessage }}
    </p>

    <ul class="mt-4 space-y-2">
      <li
        v-for="screenshot in store.state.screenshots"
        :key="screenshot.id"
        class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"
      >
        <span class="truncate">{{ screenshot.name }}</span>
        <button
          type="button"
          class="text-xs font-semibold text-rose-600 hover:text-rose-700"
          @click="remove(screenshot.id)"
        >
          Supprimer
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useBuilderStore } from '../store/builderStore'

const store = useBuilderStore()
const fileInput = ref(null)
const isDragging = ref(false)
const errorMessage = ref('')

const enoughScreenshots = computed(() => store.state.screenshots.length >= 5)
const statusMessage = computed(() => {
  if (enoughScreenshots.value) return 'OK'
  const remaining = Math.max(0, 5 - store.state.screenshots.length)
  return `Encore ${remaining} à ajouter`
})

const handleFiles = (fileList) => {
  if (!fileList?.length) return
  const result = store.addScreenshots(fileList)
  errorMessage.value = result.ok ? '' : result.message
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const onInput = (event) => {
  handleFiles(event.target.files)
}

const onDrop = (event) => {
  isDragging.value = false
  handleFiles(event.dataTransfer.files)
}

const remove = (id) => {
  store.removeScreenshot(id)
}
</script>
