<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useJournals } from '../composables/useJournals'
import type { JournalEntry } from '../types/journal'
import ReadingProgressBar from '../components/journal/ReadingProgressBar.vue'
import JournalHeader from '../components/journal/JournalHeader.vue'
import JournalHeroFigure from '../components/journal/JournalHeroFigure.vue'
import JournalBlockRenderer from '../components/journal/JournalBlockRenderer.vue'
import RelatedJournals from '../components/journal/RelatedJournals.vue'

const props = defineProps<{
  slug?: string
}>()

const route = useRoute()
const { fetchJournalBySlug, isLoading } = useJournals()

const journal = ref<JournalEntry | null>(null)
const hasLoaded = ref(false)
const currentSlug = computed(() => props.slug || (route.params.slug as string) || '')

async function loadJournal() {
  if (!currentSlug.value) return
  hasLoaded.value = false
  journal.value = await fetchJournalBySlug(currentSlug.value)
  hasLoaded.value = true
}

onMounted(() => {
  loadJournal()
})

watch(currentSlug, () => {
  loadJournal()
})
</script>

<template>
  <div class="journal-view-wrapper">
    <!-- Reading Progress Bar -->
    <ReadingProgressBar />

    <!-- Loading Skeleton State -->
    <div v-if="isLoading && !hasLoaded" class="journal-loading">
      <div class="skeleton-header">
        <div class="skeleton-pill"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-meta"></div>
      </div>
    </div>

    <!-- Found State -->
    <div v-else-if="journal" class="journal-detail">
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
  </div>
</template>

<style scoped>
.journal-view-wrapper {
  min-height: 100vh;
}

.journal-detail {
  padding-top: 80px;
  min-height: 100vh;
  padding-bottom: 128px;
}

.journal-loading {
  padding-top: 120px;
  max-width: 800px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  min-height: 80vh;
}

.skeleton-pill {
  width: 80px;
  height: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
  margin-bottom: 24px;
  animation: pulse 1.5s infinite;
}

.skeleton-title {
  width: 80%;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 16px;
  animation: pulse 1.5s infinite;
}

.skeleton-meta {
  width: 40%;
  height: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
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
