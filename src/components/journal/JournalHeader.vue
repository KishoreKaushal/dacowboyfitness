<script setup lang="ts">
import { formatJournalDate } from '../../data/mockJournals'

const props = defineProps<{
  title: string
  author: string
  date: string
  readTimeMinutes: number
  tags: string[]
}>()

const formattedDate = formatJournalDate(props.date)
</script>

<template>
  <header class="journal-header">
    <router-link to="/journal" class="back-link">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
      </svg>
      BACK TO JOURNALS
    </router-link>

    <div class="tags-row">
      <span v-for="tag in tags" :key="tag" class="tag-chip font-label-sm">
        {{ tag }}
      </span>
    </div>

    <h1 class="article-title font-display-lg">{{ title }}</h1>

    <div class="meta-row font-label-sm">
      <span>{{ formattedDate }}</span>
      <span class="meta-dot"></span>
      <span>{{ readTimeMinutes }} MIN READ</span>
      <span class="meta-dot"></span>
      <span class="meta-author">{{ author }}</span>
    </div>
  </header>
</template>

<style scoped>
.journal-header {
  max-width: 800px;
  margin: 0 auto;
  padding: 96px 20px 64px;
}
@media (min-width: 768px) {
  .journal-header {
    padding: 96px 0 64px;
  }
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: var(--caption-text);
  text-decoration: none;
  margin-bottom: 48px;
  transition: color 0.3s ease;
}
.back-link:hover {
  color: var(--color-primary);
}
.tags-row {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.tag-chip {
  padding: 4px 12px;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--tag-chip-text);
  background: var(--tag-chip-bg);
  border: 1px solid var(--tag-chip-border);
  border-radius: 2px;
}
.article-title {
  font-size: 32px;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-primary);
  margin-bottom: 32px;
}
@media (min-width: 768px) {
  .article-title {
    font-size: 72px;
    line-height: 80px;
    margin-bottom: 48px;
  }
}
.meta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--caption-text);
}
.meta-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--border-subtle);
}
.meta-author {
  color: var(--color-primary);
}
</style>
