<script setup lang="ts">
import { aboutContent } from '../../data/content'
</script>

<template>
  <section id="about" class="section-padding">
    <div class="max-w-4xl space-y-12">
      <h2 class="font-headline-md text-5xl md:text-7xl section-heading tracking-tighter">{{ aboutContent.heading }}</h2>
      <div class="divider"></div>
      <div class="font-body-md text-lg md:text-xl leading-loose space-y-6 body-text">
        <p v-for="(para, i) in aboutContent.paragraphs" :key="i">{{ para }}</p>
      </div>
      <div class="pt-12">
        <p class="font-label-sm text-xs closing-quote uppercase tracking-[0.3em]">{{ aboutContent.closingQuote }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-padding {
  padding: 128px 20px;
  max-width: 1200px;
  margin: 0 auto;
  border-top: 1px solid var(--border-light);
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
.closing-quote {
  color: var(--icon-muted);
}
</style>
