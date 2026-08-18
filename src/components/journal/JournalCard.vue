<script setup lang="ts">
import { formatJournalDate } from '../../data/mockJournals'

const props = defineProps<{
  slug: string
  title: string
  date: string
  coverImage?: string
  readTimeMinutes?: number
}>()

const formattedDate = formatJournalDate(props.date)
</script>

<template>
  <router-link :to="`/journal/${slug}`" class="card-link group">
    <article class="journal-card glass-card">
      <div class="card-image-wrap" v-if="coverImage">
        <img
          :src="coverImage"
          :alt="title"
          class="card-image img-grayscale"
          loading="lazy"
        />
      </div>
      <div class="card-body">
        <div>
          <div class="card-date font-label-sm">{{ formattedDate }}</div>
          <h4 class="card-title font-headline-md">{{ title }}</h4>
        </div>
        <div class="card-action font-label-sm">
          READ ENTRY
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </article>
  </router-link>
</template>

<style scoped>
.card-link {
  display: block;
  text-decoration: none;
}
.journal-card {
  border-radius: 0.75rem;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.group:hover .journal-card {
  transform: scale(0.98);
}
.card-image-wrap {
  height: 192px;
  overflow: hidden;
  border-bottom: 1px solid var(--border-subtle);
}
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease, filter 0.4s ease;
}
.group:hover .card-image {
  transform: scale(1.05);
  filter: grayscale(0%);
}
.card-body {
  padding: 24px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--color-surface);
}
.card-date {
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--caption-text);
  margin-bottom: 12px;
}
.card-title {
  font-size: 20px;
  line-height: 28px;
  letter-spacing: -0.01em;
  font-weight: 500;
  color: var(--color-primary);
  margin-bottom: 16px;
}
.card-action {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--color-primary);
  transition: gap 0.3s ease;
}
.group:hover .card-action {
  gap: 12px;
}
</style>
