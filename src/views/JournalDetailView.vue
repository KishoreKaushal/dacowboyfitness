<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getJournalBySlug } from '../data/mockJournals'
import ReadingProgressBar from '../components/journal/ReadingProgressBar.vue'
import JournalHeader from '../components/journal/JournalHeader.vue'
import JournalHeroFigure from '../components/journal/JournalHeroFigure.vue'
import JournalBlockRenderer from '../components/journal/JournalBlockRenderer.vue'
import RelatedJournals from '../components/journal/RelatedJournals.vue'

const route = useRoute()

const slug = computed(() => (route.params.slug as string) || '')
const journal = computed(() => getJournalBySlug(slug.value))
</script>

<template>
  <!-- Reading Progress Bar -->
  <ReadingProgressBar />

  <!-- Found State -->
  <div v-if="journal" class="journal-detail">
    <JournalHeader
      :title="journal.title"
      :author="journal.author"
      :date="journal.date"
      :read-time-minutes="journal.readTimeMinutes"
      :tags="journal.tags"
    />

    <JournalHeroFigure
      v-if="journal.coverImage"
      :src="journal.coverImage.src"
      :alt="journal.coverImage.alt"
      :caption="journal.coverImage.caption"
    />

    <JournalBlockRenderer :blocks="journal.blocks" />

    <RelatedJournals :journals="journal.relatedJournals" />
  </div>

  <!-- Not Found State -->
  <div v-else class="not-found">
    <div class="not-found-inner">
      <h1 class="not-found-title font-display-lg">404</h1>
      <p class="not-found-text">Journal entry not found.</p>
      <router-link to="/journal" class="not-found-link font-label-sm">
        ← BACK TO JOURNALS
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.journal-detail {
  padding-top: 80px;
  min-height: 100vh;
  padding-bottom: 128px;
}
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.not-found-inner {
  max-width: 400px;
}
.not-found-title {
  font-size: 72px;
  color: var(--color-primary);
  margin-bottom: 16px;
}
.not-found-text {
  color: var(--color-on-surface-variant);
  font-size: 18px;
  margin-bottom: 32px;
}
.not-found-link {
  color: var(--caption-text);
  text-decoration: none;
  font-size: 12px;
  letter-spacing: 0.05em;
  transition: color 0.3s ease;
}
.not-found-link:hover {
  color: var(--color-primary);
}
</style>
