<template>
  <transition name="fade">
    <div
      v-if="open && card && options.length"
      class="fixed bottom-6 left-1/2 z-50 w-full max-w-5xl -translate-x-1/2 rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-2xl backdrop-blur-xl dark:bg-slate-800/95"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.2em] text-white/60">Édition en cours</p>
          <h3 class="text-2xl font-semibold">{{ cardLabel }}</h3>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-for="option in options"
            :key="option.key"
            type="button"
            class="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-brand-400"
            :class="option.key === activeOptionKey ? 'bg-brand-500 text-white border-brand-500 shadow-brand' : 'bg-white/5 text-white/80'"
            @click="$emit('select-option', option.key)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-2" v-if="activeOption">
        <div v-if="activeOption.type === 'text'" class="space-y-3">
          <label class="text-sm font-semibold uppercase tracking-wide text-white/70">Contenu</label>
          <textarea
            v-model="textValue"
            rows="4"
            class="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-base text-white placeholder-white/40 focus:border-brand-400 focus:ring-brand-400"
            placeholder="Saisissez votre texte"
          ></textarea>
        </div>

        <div v-else-if="activeOption.type === 'image'" class="space-y-3">
          <label class="text-sm font-semibold uppercase tracking-wide text-white/70">Image URL</label>
          <input
            v-model="imageValue"
            type="text"
            class="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder-white/40 focus:border-brand-400 focus:ring-brand-400"
            placeholder="https://..."
          />
          <div v-if="imageValue" class="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img :src="imageValue" alt="Prévisualisation" class="w-full object-cover" />
          </div>
        </div>

        <div v-else-if="activeOption.type === 'background'" class="space-y-4 md:col-span-2">
          <label class="text-sm font-semibold uppercase tracking-wide text-white/70">Fond</label>
          <div class="flex flex-wrap gap-3">
            <button
              v-for="mode in backgroundModes"
              :key="mode.value"
              type="button"
              class="rounded-full border px-4 py-2 text-sm font-semibold transition"
              :class="backgroundDraft.mode === mode.value ? 'border-brand-500 bg-brand-500 text-white' : 'border-white/20 bg-white/5 text-white/70 hover:border-brand-300'"
              @click="setBackgroundMode(mode.value)"
            >
              {{ mode.label }}
            </button>
          </div>
          <div class="grid gap-4 md:grid-cols-3" v-if="backgroundDraft.mode !== 'image'">
            <div class="space-y-2">
              <span class="text-xs uppercase tracking-wide text-white/60">Couleur 1</span>
              <input v-model="backgroundDraft.gradientStart" type="color" class="h-14 w-full rounded-2xl border border-white/20 bg-transparent" />
            </div>
            <div class="space-y-2" v-if="backgroundDraft.mode === 'gradient'">
              <span class="text-xs uppercase tracking-wide text-white/60">Couleur 2</span>
              <input v-model="backgroundDraft.gradientEnd" type="color" class="h-14 w-full rounded-2xl border border-white/20 bg-transparent" />
            </div>
            <div class="space-y-2" v-if="backgroundDraft.mode === 'color'">
              <span class="text-xs uppercase tracking-wide text-white/60">Couleur plein</span>
              <input v-model="backgroundDraft.solid" type="color" class="h-14 w-full rounded-2xl border border-white/20 bg-transparent" />
            </div>
          </div>
          <div class="space-y-2" v-if="backgroundDraft.mode === 'image'">
            <span class="text-xs uppercase tracking-wide text-white/60">Image</span>
            <input
              v-model="backgroundDraft.imageUrl"
              type="text"
              class="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-white placeholder-white/40 focus:border-brand-400 focus:ring-brand-400"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          class="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white/80 hover:border-white"
          @click="$emit('close')"
        >
          Fermer
        </button>
        <button
          type="button"
          class="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/40 hover:bg-brand-400"
          @click="handleSave"
          :disabled="!activeOption"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

const props = defineProps({
  open: Boolean,
  card: Object,
  options: {
    type: Array,
    default: () => []
  },
  activeOptionKey: String
})

const emit = defineEmits(['close', 'select-option', 'save'])

const textValue = ref('')
const imageValue = ref('')
const backgroundDraft = reactive({
  mode: 'gradient',
  solid: '#111827',
  gradientStart: '#312e81',
  gradientEnd: '#4338ca',
  imageUrl: ''
})

const backgroundModes = [
  { label: 'Couleur', value: 'color' },
  { label: 'Dégradé', value: 'gradient' },
  { label: 'Image', value: 'image' }
]

const activeOption = computed(() => props.options.find((option) => option.key === props.activeOptionKey))
const cardLabel = computed(() => props.card ? `Écran ${props.card.id}` : '')

watch(
  () => [props.card, props.activeOptionKey],
  () => {
    if (!props.card || !activeOption.value) return
    const option = activeOption.value
    if (option.type === 'text') {
      textValue.value = decodeText(props.card[option.key] || '')
    } else if (option.type === 'image') {
      imageValue.value = props.card[option.key] || ''
    } else if (option.type === 'background') {
      if (props.card.background) {
        Object.assign(backgroundDraft, JSON.parse(JSON.stringify(props.card.background)))
      } else {
        Object.assign(backgroundDraft, {
          mode: 'gradient',
          solid: '#111827',
          gradientStart: '#312e81',
          gradientEnd: '#4338ca',
          imageUrl: ''
        })
      }
    }
  },
  { immediate: true }
)

function decodeText(value) {
  return value?.replace(/<br\s*\/?\s*>/gi, '\n') || ''
}

function encodeText(value) {
  return (value || '').split('\n').join('<br>')
}

function handleSave() {
  if (!props.card || !activeOption.value) return
  const option = activeOption.value
  if (option.type === 'text') {
    emit('save', { key: option.key, value: encodeText(textValue.value) })
  } else if (option.type === 'image') {
    emit('save', { key: option.key, value: imageValue.value })
  } else if (option.type === 'background') {
    emit('save', { key: option.key, value: { ...backgroundDraft } })
  }
}

function setBackgroundMode(value) {
  backgroundDraft.mode = value
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.shadow-brand {
  box-shadow: 0 15px 40px rgba(99, 102, 241, 0.35);
}
</style>
