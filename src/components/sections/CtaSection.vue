<script setup lang="ts">
import { ctaContent, siteConfig } from '../../data/content'
</script>

<template>
  <section class="cta-section">
    <div class="max-w-2xl mx-auto space-y-12">
      <h2 class="font-display-lg text-5xl md:text-7xl leading-tight cta-heading">{{ ctaContent.heading }}</h2>
      <div class="space-y-6 text-lg md:text-xl leading-relaxed cta-body">
        <p v-for="(para, i) in ctaContent.paragraphs" :key="i">{{ para }}</p>
      </div>
      <div class="flex justify-center">
        <button class="btn-primary btn-active">{{ ctaContent.cta }}</button>
      </div>
      <div class="flex justify-center gap-8 mt-8">
        <a :href="siteConfig.instagram" target="_blank" class="social-link">
          <span class="material-symbols-outlined icon">photo_camera</span>
        </a>
        <a :href="`mailto:${siteConfig.email}`" class="social-link">
          <span class="material-symbols-outlined icon">mail</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  padding: 192px 20px;
  text-align: center;
}
.cta-heading {
  color: var(--cta-heading-color);
}
.cta-body {
  color: var(--color-on-surface-variant);
}
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: 20px 48px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
}
.btn-primary:hover {
  opacity: 0.9;
}
.social-link {
  color: var(--icon-muted);
  transition: color 0.3s ease;
  text-decoration: none;
}
.social-link:hover {
  color: var(--color-primary);
}
.icon {
  font-variation-settings: 'wght' 200;
}
</style>
