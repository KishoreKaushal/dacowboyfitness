<script setup lang="ts">
import { heroContent, siteConfig } from '../../data/content'
</script>

<template>
  <section class="hero">
    <div class="max-w-4xl space-y-12">
      <blockquote class="font-display-lg text-4xl md:text-6xl italic leading-tight quote-text">
        {{ heroContent.quote }}
      </blockquote>
      <p class="font-label-sm text-sm tracking-[0.2em] uppercase attribution">{{ heroContent.attribution }}</p>
      <div class="space-y-8 pt-8">
        <p class="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed subtitle">
          {{ heroContent.subtitle }}
        </p>
        <div class="flex flex-col md:flex-row gap-6 justify-center pt-4">
          <button class="btn-primary btn-active">
            {{ heroContent.primaryCta }}
          </button>
          <a
            :href="siteConfig.bookingUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-ghost btn-active flex items-center justify-center text-center"
          >
            {{ heroContent.secondaryCta }}
          </a>
        </div>
      </div>
    </div>
    <div class="scroll-indicator">
      <span class="material-symbols-outlined">expand_more</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 128px 20px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .hero {
    padding: 128px 64px;
  }
}
.quote-text {
  color: var(--hero-quote-color);
}
.attribution {
  color: var(--color-on-surface-variant);
}
.subtitle {
  color: var(--color-on-surface-variant);
}
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: 16px 40px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
  text-decoration: none;
}
.btn-primary:hover {
  opacity: 0.9;
}
.btn-ghost {
  border: 1px solid var(--border-medium);
  color: var(--color-primary);
  padding: 16px 40px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
}
.btn-ghost:hover {
  background-color: var(--btn-ghost-hover);
}
.scroll-indicator {
  position: absolute;
  bottom: 48px;
  opacity: 0.3;
  animation: bounce 2s infinite;
  color: var(--color-on-surface);
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}
</style>
