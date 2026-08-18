<script setup lang="ts">
import type { JournalBlock } from '../../types/journal'
import MarkdownBlock from './MarkdownBlock.vue'
import VideoBlock from './VideoBlock.vue'
import ImageBlock from './ImageBlock.vue'

defineProps<{
  blocks: JournalBlock[]
}>()
</script>

<template>
  <article class="block-renderer">
    <template v-for="block in blocks" :key="block.id">
      <MarkdownBlock
        v-if="block.type === 'markdown'"
        :content="block.content"
      />
      <VideoBlock
        v-else-if="block.type === 'video'"
        :block="block"
      />
      <ImageBlock
        v-else-if="block.type === 'image'"
        :block="block"
      />
    </template>
  </article>
</template>

<style scoped>
.block-renderer {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 18px;
  line-height: 32px;
}
@media (min-width: 768px) {
  .block-renderer {
    padding: 0;
  }
}
</style>
