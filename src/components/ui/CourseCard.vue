<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Course } from '../../data/content'

const props = defineProps<{
  course: Course
}>()

const router = useRouter()

const progressPercent = computed(() => {
  if (!props.course.lessonsCount || props.course.completedLessonsCount === undefined) return 0
  return Math.round((props.course.completedLessonsCount / props.course.lessonsCount) * 100)
})

function navigateToCourse() {
  router.push(`/course/${props.course.id}`)
}
</script>

<template>
  <div
    @click="navigateToCourse"
    class="glass-card p-1 flex flex-col h-full group cursor-pointer relative overflow-hidden transition-transform duration-200 active:scale-[0.98]"
  >
    <!-- Image container -->
    <div class="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-neutral-900">
      <div
        class="course-image"
        :style="{ backgroundImage: `url(${course.image})` }"
        :aria-label="course.alt"
        role="img"
      />

      <!-- Optional status chip (Top-Left) -->
      <div class="absolute top-3 left-3 z-10">
        <span
          v-if="course.isOwned"
          class="font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md backdrop-blur-md border shadow-sm"
          style="background: var(--glass-bg-start); color: var(--color-on-surface); border-color: var(--border-medium)"
        >
          OWNED
        </span>
        <span
          v-else
          class="font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md backdrop-blur-md border shadow-sm"
          style="background: var(--glass-bg-start); color: var(--color-on-surface); border-color: var(--border-subtle)"
        >
          {{ course.price || '₹499' }}
        </span>
      </div>

      <!-- Optional Progress bar (Bottom of image) -->
      <div
        v-if="course.isOwned && course.completedLessonsCount !== undefined"
        class="absolute bottom-0 left-0 right-0 h-1 z-10"
        style="background: var(--border-light)"
      >
        <div
          class="h-full transition-all duration-500"
          style="background: var(--color-primary)"
          :style="{ width: `${progressPercent}%` }"
        ></div>
      </div>
    </div>

    <!-- Content body -->
    <div class="p-6 md:p-8 space-y-4 flex flex-col flex-grow justify-between">
      <div class="space-y-2">
        <h3 class="font-serif text-xl md:text-2xl font-medium course-title">
          {{ course.title }}
        </h3>
        <p class="text-sm course-description leading-relaxed">
          {{ course.description }}
        </p>
      </div>

      <!-- Footer CTA row -->
      <div class="pt-2 flex items-center justify-between">
        <div class="flex items-center gap-2 course-cta">
          <span class="font-mono text-xs tracking-widest uppercase font-semibold">
            {{ course.isOwned ? 'CONTINUE STUDY' : 'BEGIN STUDY' }}
          </span>
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </div>

        <span
          v-if="course.isOwned && course.completedLessonsCount !== undefined"
          class="font-mono text-[11px] text-muted"
        >
          {{ progressPercent }}%
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.course-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: grayscale(100%);
  opacity: 0.65;
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
  gap: 14px;
}
</style>
