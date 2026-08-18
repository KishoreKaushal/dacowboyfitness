<script setup lang="ts">
import { computed } from 'vue'
import type { VideoBlockData } from '../../types/journal'
// @ts-ignore
import 'vidstack/styles/defaults.css'
// @ts-ignore
import 'vidstack/styles/community-skin/video.css'
// @ts-ignore
import 'vidstack/elements'

const props = defineProps<{
  block: VideoBlockData
}>()

// Extract YouTube ID if applicable for clean embedding/playback
const youtubeId = computed(() => {
  if (!props.block.src) return null
  const url = props.block.src.trim()
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
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
      <!-- YouTube Embed with Vidstack Container & Obsidian Styling -->
      <media-player
        v-if="isYouTube"
        :src="`youtube/${youtubeId}`"
        aspect-ratio="16/9"
        playsinline
        class="media-player-container"
      >
        <media-outlet>
          <iframe
            :src="embedUrl"
            class="video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure"
            allowfullscreen
            loading="lazy"
            title="Video Player"
          ></iframe>
        </media-outlet>
      </media-player>

      <!-- Direct HTML5 video fallback -->
      <media-player
        v-else
        :src="block.src"
        aspect-ratio="16/9"
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
