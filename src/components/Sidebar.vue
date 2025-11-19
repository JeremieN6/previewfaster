<template>
  <aside class="w-full lg:w-80">
    <div class="sticky top-6 space-y-6">
      <ScreenshotUploader />
      <TextCardsEditor />
      <CategoryList />
    </div>
  </aside>
</template>

<script setup>
import ScreenshotUploader from './ScreenshotUploader.vue'
import TextCardsEditor from './TextCardsEditor.vue'
import CategoryList from './CategoryList.vue'
</script>
