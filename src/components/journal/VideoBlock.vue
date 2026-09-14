<script setup lang="ts">
import { computed } from 'vue'
import type { VideoBlockData } from '../../types/journal'
// @ts-ignore
import 'vidstack/styles/defaults.css'
// @ts-ignore
import 'vidstack/styles/community-skin/video.css'
// @ts-ignore
import { defineCustomElements } from 'vidstack/elements'

defineCustomElements()

const props = defineProps<{
  block: VideoBlockData
}>()

// Robust extraction of 11-char YouTube ID from any youtube.com or youtu.be URL
const youtubeId = computed(() => {
  if (!props.block.src) return null
  const url = props.block.src.trim()
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/i
  const match = url.match(regExp)
  return match ? match[1] : null
})

const isYouTube = computed(() => !!youtubeId.value)

const embedUrl = computed(() => {
  if (youtubeId.value) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId.value}?rel=0&modestbranding=1`
  }
  return props.block.src
})
</script>

<template>
  <div class="video-block">
    <div class="video-container">
      <!-- YouTube Embed with Obsidian container styling -->
      <iframe
        v-if="isYouTube"
        :src="embedUrl"
        class="video-iframe"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        loading="lazy"
        title="Journal Video Player"
      ></iframe>

      <!-- Direct HTML5 / HLS video stream with Vidstack -->
      <media-player
        v-else
        :src="block.src"
        :aspect-ratio="block.aspectRatio || '16/9'"
        playsinline
        class="media-player-container"
      >
        <media-outlet></media-outlet>
        <media-community-skin></media-community-skin>
      </media-player>
    </div>
    <p v-if="block.caption" class="video-caption font-label-sm">
      {{ block.caption }}
    </p>
  </div>
</template>

<style scoped>
.video-block {
  margin: 48px 0;
}

.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
  background-color: var(--color-surface-container-lowest, #0e0e0e);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.media-player-container {
  width: 100%;
  height: 100%;
  display: block;
}

.video-iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.video-caption {
  margin-top: 14px;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--caption-text, #8e9192);
  text-align: right;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
}
</style>
