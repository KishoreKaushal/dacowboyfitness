<script setup lang="ts">
import type { Course } from '../../data/content'

defineProps<{
  course: Course
}>()
</script>

<template>
  <div class="glass-card p-1 flex flex-col h-full group cursor-pointer">
    <div
      class="course-image"
      :style="{ backgroundImage: `url(${course.image})` }"
      :aria-label="course.alt"
      role="img"
    />
    <div class="p-8 space-y-4">
      <h3 class="font-display-lg text-2xl course-title">{{ course.title }}</h3>
      <p class="text-sm course-description leading-relaxed">{{ course.description }}</p>
      <div class="pt-4 flex items-center gap-2 course-cta">
        <span class="font-label-sm text-xs tracking-widest uppercase">Begin Study</span>
        <span class="material-symbols-outlined text-sm">arrow_forward</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.course-image {
  aspect-ratio: 4/5;
  background-size: cover;
  background-position: center;
  width: 100%;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.7s ease;
}
.group:hover .course-image {
  filter: grayscale(0%);
  opacity: 1;
}
.course-title {
  color: var(--color-primary);
}
.course-description {
  color: var(--color-on-surface-variant);
}
.course-cta {
  color: var(--color-on-surface);
  transition: gap 0.3s ease;
}
.group:hover .course-cta {
  gap: 16px;
}
</style>
