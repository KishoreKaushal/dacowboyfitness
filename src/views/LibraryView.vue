<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseAccess } from '../composables/useCourseAccess'
import CourseCard from '../components/ui/CourseCard.vue'

const router = useRouter()
const { ownedCourses } = useCourseAccess()

const featuredCourse = computed(() => {
  if (!ownedCourses.value.length) return null
  return ownedCourses.value.find(c => (c.completedLessonsCount || 0) < c.lessonsCount) || ownedCourses.value[0]
})

function resumeCourse() {
  if (featuredCourse.value) {
    router.push(`/course/${featuredCourse.value.id}`)
  }
}

function browseCourses() {
  router.push({ path: '/', hash: '#courses' })
}
</script>

<template>
  <div class="min-h-screen pt-28 pb-24 px-5 md:px-16 max-w-[1200px] mx-auto space-y-16">
    <!-- Header -->
    <header class="space-y-3">
      <span class="font-mono text-xs uppercase tracking-widest text-muted">MY LIBRARY</span>
      <h1 class="font-serif text-3xl md:text-5xl font-medium" style="color: var(--color-primary)">
        Continue Your Study
      </h1>
      <p class="text-sm md:text-base text-muted max-w-xl">
        Access your unlocked course materials, track lecture progress, and deepen your biological understanding.
      </p>
    </header>

    <!-- IF HAS OWNED COURSES -->
    <template v-if="ownedCourses.length">
      <!-- Continue Watching Featured Strip -->
      <section v-if="featuredCourse" class="space-y-4">
        <h2 class="font-mono text-xs uppercase tracking-widest text-muted">CONTINUE WATCHING</h2>
        <div
          @click="resumeCourse"
          class="relative w-full h-[360px] md:h-[440px] rounded-2xl overflow-hidden glass-card cursor-pointer group border shadow-xl flex flex-col justify-end p-6 md:p-10"
          style="border-color: var(--border-subtle)"
        >
          <!-- Hero Background Image -->
          <div class="absolute inset-0 z-0 overflow-hidden bg-neutral-900">
            <img
              :src="featuredCourse.image"
              :alt="featuredCourse.alt"
              class="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
            />
          </div>

          <!-- Subtle Gradient Overlay -->
          <div
            class="absolute inset-0 z-10 pointer-events-none"
            style="background: linear-gradient(to top, var(--color-surface) 10%, transparent 80%)"
          ></div>

          <!-- Card Content -->
          <div class="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div class="space-y-2 max-w-2xl">
              <span class="font-mono text-xs uppercase tracking-widest text-muted">COURSE IN PROGRESS</span>
              <h3 class="font-serif text-2xl md:text-4xl font-medium" style="color: var(--color-primary)">
                {{ featuredCourse.title }}
              </h3>
              <p class="text-sm line-clamp-2" style="color: var(--color-on-surface-variant)">
                {{ featuredCourse.description }}
              </p>
            </div>

            <button
              class="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg shrink-0 flex items-center gap-2 group-hover:gap-3"
              style="background: var(--color-primary); color: var(--color-on-primary)"
            >
              <span>Resume Study</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <!-- Bottom Progress Bar -->
          <div class="absolute bottom-0 left-0 right-0 h-1.5 z-30" style="background: var(--border-light)">
            <div
              class="h-full transition-all duration-500"
              style="background: var(--color-primary)"
              :style="{ width: `${Math.round(((featuredCourse.completedLessonsCount || 0) / featuredCourse.lessonsCount) * 100)}%` }"
            ></div>
          </div>
        </div>
      </section>

      <!-- Owned Courses Grid -->
      <section class="space-y-6">
        <h2 class="font-mono text-xs uppercase tracking-widest text-muted">ALL OWNED COURSES</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCard v-for="course in ownedCourses" :key="course.id" :course="course" />
        </div>
      </section>
    </template>

    <!-- IF NO OWNED COURSES (EMPTY STATE) -->
    <section v-else class="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl glass-card border max-w-lg mx-auto space-y-6" style="border-color: var(--border-subtle)">
      <div class="w-16 h-16 rounded-full glass-card flex items-center justify-center border" style="border-color: var(--border-medium)">
        <svg class="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <div class="space-y-2">
        <h2 class="font-serif text-2xl font-medium" style="color: var(--color-primary)">Your Library is Empty</h2>
        <p class="text-sm text-muted max-w-xs mx-auto">
          Unlock a course from our curriculum to begin studying physical foundations.
        </p>
      </div>
      <button
        @click="browseCourses"
        class="px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg"
        style="background: var(--color-primary); color: var(--color-on-primary)"
      >
        Browse Courses
      </button>
    </section>
  </div>
</template>
