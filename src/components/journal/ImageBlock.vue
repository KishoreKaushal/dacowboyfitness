<script setup lang="ts">
import type { ImageBlockData } from '../../types/journal'

defineProps<{
  block: ImageBlockData
}>()
</script>

<template>
  <div class="image-block">
    <figure class="image-figure">
      <div class="image-wrap">
        <img
          :src="block.src"
          :alt="block.alt || ''"
          class="block-image img-grayscale"
          loading="lazy"
        />
      </div>
      <figcaption v-if="block.caption" class="image-caption font-label-sm">
        {{ block.caption }}
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.image-block {
  margin: 64px 0;
}
.image-figure {
  width: 100%;
}
.image-wrap {
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  background-color: var(--color-surface-container);
}
.block-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}
.image-caption {
  margin-top: 16px;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--caption-text);
  text-align: right;
}
</style>
