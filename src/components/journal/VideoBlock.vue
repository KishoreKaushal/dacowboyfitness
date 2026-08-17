<script setup lang="ts">
import type { VideoBlockData } from '../../types/journal'

defineProps<{
  block: VideoBlockData
}>()
</script>

<template>
  <div class="video-block">
    <div class="video-container">
      <div class="video-overlay"></div>
      <iframe
        :src="block.src"
        class="video-iframe"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        loading="lazy"
        title="Video Player"
      ></iframe>
    </div>
    <p v-if="block.caption" class="video-caption font-label-sm">
      {{ block.caption }}
    </p>
  </div>
</template>

<style scoped>
.video-block {
  margin: 64px 0;
}
.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  background-color: var(--color-surface-container);
}
.video-overlay {
  position: absolute;
  inset: 0;
  background: var(--video-overlay-bg);
  z-index: 1;
  pointer-events: none;
}
.video-iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
.video-caption {
  margin-top: 16px;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--caption-text);
  text-align: right;
}
</style>
