<script setup lang="ts">
import { cowboyWayContent, images } from '../../data/content'
</script>

<template>
  <section id="cowboy-way" class="section-padding">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div class="lg:col-span-7 space-y-8">
        <h2 class="font-headline-md text-5xl md:text-7xl section-heading tracking-tighter">{{ cowboyWayContent.heading }}</h2>
        <div class="divider"></div>
        <div class="text-lg md:text-xl leading-loose space-y-6 body-text font-body-md">
          <p v-for="(para, i) in cowboyWayContent.paragraphs" :key="i">{{ para }}</p>
        </div>
      </div>
      <div class="lg:col-span-5 relative aspect-square group">
        <div class="glow-bg"></div>
        <div
          class="horse-image glass-card"
          :style="{ backgroundImage: `url(${images.horse})` }"
          :aria-label="images.horseAlt"
          role="img"
        ></div>
        <div class="principle-card glass-card hidden md:block">
          <p class="font-label-sm text-xs principle-label uppercase tracking-widest">{{ cowboyWayContent.principleLabel }}</p>
          <p class="font-display-lg text-2xl principle-text">{{ cowboyWayContent.principleText }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-padding {
  padding: 128px 20px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .section-padding {
    padding: 128px 64px;
  }
}
.section-heading {
  color: var(--color-primary);
}
.divider {
  width: 96px;
  height: 1px;
  background-color: var(--divider-color);
}
.body-text {
  color: var(--color-on-surface-variant);
}
.glow-bg {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  filter: blur(48px);
  opacity: 0.2;
  background: linear-gradient(135deg, var(--glass-bg-start), var(--glass-bg-end));
  transition: opacity 0.3s ease;
}
.group:hover .glow-bg {
  opacity: 0.4;
}
.horse-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 10;
  border: 1px solid var(--border-light);
}
.principle-card {
  position: absolute;
  bottom: -32px;
  right: -32px;
  padding: 32px;
  border: 1px solid var(--border-subtle);
  z-index: 20;
}
.principle-label {
  color: var(--icon-muted);
}
.principle-text {
  color: var(--color-primary);
}
</style>
