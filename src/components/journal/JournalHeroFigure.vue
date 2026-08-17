<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  caption?: string
}>()
</script>

<template>
  <div class="hero-container">
    <figure class="hero-figure">
      <div class="hero-image-wrap">
        <img
          :src="src"
          :alt="alt || ''"
          class="hero-img img-grayscale"
          loading="eager"
        />
      </div>
      <figcaption v-if="caption" class="hero-caption font-label-sm">
        {{ caption }}
      </figcaption>
    </figure>
  </div>
</template>

<style scoped>
.hero-container {
  width: 100%;
  max-width: 1152px;
  margin: 0 auto 128px;
  padding: 0 20px;
}
@media (min-width: 768px) {
  .hero-container {
    padding: 0 64px;
  }
}
.hero-figure {
  width: 100%;
  position: relative;
}
.hero-image-wrap {
  aspect-ratio: 21 / 9;
  width: 100%;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid var(--border-subtle);
  background: var(--glass-bg-start);
  backdrop-filter: blur(20px);
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.hero-caption {
  margin-top: 16px;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--caption-text);
  text-align: right;
}
</style>
