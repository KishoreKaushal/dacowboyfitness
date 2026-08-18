<script setup lang="ts">
import JournalEntryComponent from '../ui/JournalEntry.vue'
import { journalEntries } from '../../data/content'
</script>

<template>
  <section id="journal" class="journal-section">
    <div class="journal-inner">
      <div class="max-w-2xl mb-24">
        <h2 class="font-headline-md text-5xl section-heading mb-6">The Journal</h2>
        <p class="text-lg section-subtitle">Occasional essays on the divergence of modern living and ancient biology.</p>
      </div>
      <div class="space-y-12">
        <JournalEntryComponent
          v-for="entry in journalEntries"
          :key="entry.issue"
          :issue="entry.issue"
          :title="entry.title"
        />
      </div>
      <div class="mt-16">
        <router-link to="/journal" class="view-all-link font-label-sm">
          VIEW ALL JOURNALS
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.journal-section {
  background-color: var(--color-surface-container-lowest);
  padding: 128px 0;
  border-top: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}
.journal-inner {
  padding: 0 20px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .journal-inner {
    padding: 0 64px;
  }
}
.section-heading {
  color: var(--color-primary);
}
.section-subtitle {
  color: var(--color-on-surface-variant);
}
.view-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  text-decoration: none;
  border: 1px solid var(--border-subtle);
  padding: 12px 24px;
  transition: all 0.3s ease;
}
.view-all-link:hover {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border-color: var(--color-primary);
}
</style>
