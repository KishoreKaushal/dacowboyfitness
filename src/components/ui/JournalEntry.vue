<script setup lang="ts">
defineProps<{
  issue: string
  title: string
}>()
</script>

<template>
  <article class="group cursor-pointer">
    <div class="entry-row">
      <div class="space-y-2 max-w-2xl">
        <span class="font-label-sm text-xs issue-label uppercase tracking-[0.3em]">{{ issue }}</span>
        <h3 class="font-display-lg text-3xl md:text-4xl entry-title">{{ title }}</h3>
      </div>
      <div class="mt-6 md:mt-0">
        <span class="font-label-sm text-xs read-btn">READ ESSAY</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.entry-row {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 48px 0;
  border-bottom: 1px solid var(--border-subtle);
  transition: border-color 0.3s ease;
}
@media (min-width: 768px) {
  .entry-row {
    flex-direction: row;
    align-items: center;
  }
}
.group:hover .entry-row {
  border-color: var(--border-hover);
}
.issue-label {
  color: var(--icon-muted);
}
.entry-title {
  color: var(--color-primary);
  transition: all 0.5s ease;
}
.group:hover .entry-title {
  font-style: italic;
}
.read-btn {
  border: 1px solid var(--border-subtle);
  padding: 8px 16px;
  color: var(--color-on-surface);
  transition: all 0.3s ease;
}
.group:hover .read-btn {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border-color: var(--color-primary);
}
</style>
