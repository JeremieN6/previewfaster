<template>
  <div
    v-if="card.variant === 'mockup-dark'"
    class="card"
    :data-theme="card.theme"
    :ref="registerCardRef"
  >
    <div class="card-tools">
      <button class="options-btn" type="button" @click="emit('open-options', card)">Option</button>
    </div>
    <div class="card-background" :style="backgroundStyle"></div>
    <div class="card-content">
      <div class="card-header">
        <h2 class="card-title" v-html="card.title"></h2>
      </div>
      <div class="iphone-mockup">
        <div class="iphone-frame">
          <div class="iphone-notch"></div>
          <div class="iphone-screen">
            <img :src="card.screenshotUrl" alt="App Screenshot" class="screenshot-image" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else-if="card.variant === 'feature-card'"
    class="card card-design2"
    :ref="registerCardRef"
  >
    <img
      v-if="isImageBackground"
      class="card-bg-image"
      :src="card.background.imageUrl"
      alt="Background"
    />
    <div v-else class="card-background-d2" :style="backgroundStyle"></div>
    <div class="gradient-overlay"></div>
    <div class="card-tools">
      <button class="options-btn" type="button" @click="emit('open-options', card)">Option</button>
    </div>
    <div class="card-content-d2">
      <img :src="card.logoUrl" alt="Logo" class="app-logo" />
      <h2 class="card-title-d2" v-html="card.title"></h2>
    </div>
  </div>

  <div
    v-else-if="card.variant === 'image-only'"
    class="card card-design2"
    :ref="registerCardRef"
  >
    <img
      v-if="isImageBackground"
      class="card-bg-image"
      :src="card.background.imageUrl"
      alt="Background"
    />
    <div v-else class="card-background-d2" :style="backgroundStyle"></div>
    <div class="card-tools">
      <button class="options-btn" type="button" @click="emit('open-options', card)">Option</button>
    </div>
  </div>

  <div
    v-else-if="card.variant === 'image-text'"
    class="card card-design2"
    :ref="registerCardRef"
  >
    <img
      v-if="isImageBackground"
      class="card-bg-image"
      :src="card.background.imageUrl"
      alt="Background"
    />
    <div v-else class="card-background-d2" :style="backgroundStyle"></div>
    <div class="gradient-overlay"></div>
    <div class="card-tools">
      <button class="options-btn" type="button" @click="emit('open-options', card)">Option</button>
    </div>
    <div class="card-content-d2">
      <h2 class="card-title-d2" v-html="card.title"></h2>
    </div>
  </div>

  <div
    v-else-if="card.variant === 'mockup-light'"
    class="card card-design2"
    :ref="registerCardRef"
  >
    <div class="card-background-d2" :style="backgroundStyle"></div>
    <div class="card-content-d2-center">
      <h2 class="card-title-top" v-html="card.title"></h2>
      <p v-if="card.subtitle" class="card-subtitle">{{ card.subtitle }}</p>
      <div class="iphone-mockup-white">
        <div class="iphone-frame-white">
          <div class="iphone-notch-white"></div>
          <div class="iphone-screen-white">
            <img :src="card.screenshotUrl" alt="App Screenshot" class="screenshot-image" />
          </div>
        </div>
      </div>
    </div>
    <div class="card-tools">
      <button class="options-btn" type="button" @click="emit('open-options', card)">Option</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  registerCardRef: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['open-options'])

const isImageBackground = computed(() => {
  return props.card.background?.mode === 'image' && props.card.background.imageUrl
})

const backgroundStyle = computed(() => {
  const background = props.card.background
  if (!background) return {}
  if (background.mode === 'color') {
    return { background: background.solid }
  }
  if (background.mode === 'gradient') {
    return {
      backgroundImage: `linear-gradient(180deg, ${background.gradientStart} 0%, ${background.gradientEnd} 100%)`
    }
  }
  if (background.mode === 'image') {
    return {
      backgroundImage: `url(${background.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {}
})
</script>
