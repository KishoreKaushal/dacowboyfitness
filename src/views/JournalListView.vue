<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useJournals } from '../composables/useJournals'
import type { JournalEntrySummary } from '../types/journal'
import JournalCard from '../components/journal/JournalCard.vue'

const { fetchPublishedJournals } = useJournals()

const allJournals = ref<JournalEntrySummary[]>([])
const activeTag = ref<string | null>(null)

const allTags = computed(() => {
  const set = new Set<string>()
  allJournals.value.forEach((j) => {
    j.tags?.forEach((t) => set.add(t))
  })
  return Array.from(set).sort()
})

const filteredJournals = computed(() => {
  if (!activeTag.value) return allJournals.value
  return allJournals.value.filter((j) => j.tags?.includes(activeTag.value!))
})

function selectTag(tag: string | null) {
  activeTag.value = tag
}

onMounted(async () => {
  allJournals.value = await fetchPublishedJournals()
})
</script>

<template>
  <div class="journal-list">
    <!-- Archive Header -->
    <header class="list-header">
      <h1 class="list-title font-display-lg">The Journal</h1>
      <p class="list-subtitle">
        Occasional essays on the divergence of modern living and ancient biology.
      </p>
    </header>

    <!-- Tag Filter -->
    <div class="filter-row">
      <button
        class="filter-chip font-label-sm"
        :class="{ 'filter-chip--active': activeTag === null }"
        @click="selectTag(null)"
      >
        ALL
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="filter-chip font-label-sm"
        :class="{ 'filter-chip--active': activeTag === tag }"
        @click="selectTag(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Journal Grid -->
    <div class="journal-grid">
      <JournalCard
        v-for="entry in filteredJournals"
        :key="entry.slug"
        :slug="entry.slug"
        :title="entry.title"
        :date="entry.date"
        :cover-image="entry.coverImage"
        :read-time-minutes="entry.readTimeMinutes"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredJournals.length === 0" class="empty-state">
      <p class="empty-text">No journal entries found for this category.</p>
    </div>
  </div>
</template>

<style scoped>
.journal-list {
  padding-top: 80px;
  min-height: 100vh;
  padding-bottom: 128px;
  max-width: 1152px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}
@media (min-width: 768px) {
  .journal-list {
    padding-left: 64px;
    padding-right: 64px;
  }
}

.list-header {
  padding: 96px 0 48px;
  max-width: 640px;
}
.list-title {
  font-size: 48px;
  line-height: 56px;
  letter-spacing: -0.02em;
  color: var(--color-primary);
  margin-bottom: 24px;
}
@media (min-width: 768px) {
  .list-title {
    font-size: 72px;
    line-height: 80px;
  }
}
.list-subtitle {
  font-size: 18px;
  line-height: 32px;
  color: var(--color-on-surface-variant);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 48px;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: 48px;
}
.filter-chip {
  padding: 8px 16px;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--caption-text);
  background: transparent;
  border: 1px solid var(--border-subtle);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.filter-chip:hover {
  color: var(--color-primary);
  border-color: var(--border-hover);
}
.filter-chip--active {
  color: var(--color-on-primary);
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.journal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 640px) {
  .journal-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .journal-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.empty-state {
  text-align: center;
  padding: 96px 0;
}
.empty-text {
  color: var(--caption-text);
  font-size: 16px;
}
</style>
