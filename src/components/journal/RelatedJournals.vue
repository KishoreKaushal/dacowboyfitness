<script setup lang="ts">
import type { JournalEntrySummary } from '../../types/journal'
import JournalCard from './JournalCard.vue'

defineProps<{
  journals: JournalEntrySummary[]
}>()
</script>

<template>
  <section class="related-section" v-if="journals.length">
    <h3 class="related-heading font-label-sm">Recommended Reads</h3>
    <div class="related-grid">
      <JournalCard
        v-for="entry in journals"
        :key="entry.slug"
        :slug="entry.slug"
        :title="entry.title"
        :date="entry.date"
        :cover-image="entry.coverImage"
        :read-time-minutes="entry.readTimeMinutes"
      />
    </div>
  </section>
</template>

<style scoped>
.related-section {
  max-width: 1152px;
  margin: 128px auto 0;
  padding: 0 20px;
}
@media (min-width: 768px) {
  .related-section {
    padding: 0 64px;
  }
}
.related-heading {
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--caption-text);
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 16px;
  margin-bottom: 32px;
}
.related-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 768px) {
  .related-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
