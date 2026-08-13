<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseAccess } from '../composables/useCourseAccess'
import { useAuth } from '../composables/useAuth'
import { useCheckout } from '../composables/useCheckout'

const route = useRoute()
const router = useRouter()

const { getCourseById, isCourseUnlocked, toggleLessonCompletion } = useCourseAccess()
const { isAuthenticated, openAuthModal } = useAuth()
const { openCheckout } = useCheckout()

const courseId = computed(() => (route.params.id as string) || '1')
const course = computed(() => getCourseById(courseId.value) || getCourseById('1')!)

const isUnlocked = computed(() => isCourseUnlocked(course.value?.id || ''))

const activeLessonId = ref<string>('')

// Set initial active lesson once course is loaded
const activeLesson = computed(() => {
  if (!course.value) return null
  if (activeLessonId.value) {
    const found = course.value.lessons.find(l => l.id === activeLessonId.value)
    if (found) return found
  }
  return course.value.lessons[0] || null
})

const completedLessonsCount = computed(() => {
  if (!course.value) return 0
  return course.value.lessons.filter(l => l.isCompleted).length
})

const progressPercent = computed(() => {
  if (!course.value || !course.value.lessons.length) return 0
  return Math.round((completedLessonsCount.value / course.value.lessons.length) * 100)
})

function selectLesson(lessonId: string) {
  activeLessonId.value = lessonId
}

function handleUnlockClick() {
  if (!isAuthenticated.value) {
    openAuthModal()
  } else {
    openCheckout(course.value)
  }
}

function handleToggleComplete() {
  if (course.value && activeLesson.value) {
    toggleLessonCompletion(course.value.id, activeLesson.value.id)
  }
}
</script>

<template>
  <div v-if="course" class="min-h-screen pt-28 pb-24 px-5 md:px-16 max-w-[1400px] mx-auto">
    <!-- Breadcrumb Nav -->
    <div class="mb-8 flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted">
      <button @click="router.push('/')" class="hover:text-primary transition-colors">Courses</button>
      <span>/</span>
      <span style="color: var(--color-on-surface)">{{ course.title }}</span>
    </div>

    <!-- LOCKED STATE (User does not own course or is not signed in) -->
    <div v-if="!isUnlocked" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Left Column: Course Specs & Curriculum -->
      <div class="lg:col-span-8 space-y-12">
        <header class="space-y-4 border-b pb-8" style="border-color: var(--border-subtle)">
          <div class="flex items-center gap-2">
            <span
              class="font-mono text-xs uppercase tracking-widest px-2.5 py-1 rounded-md border"
              style="background: var(--glass-bg-start); color: var(--color-on-surface); border-color: var(--border-subtle)"
            >
              LOCKED COURSE
            </span>
          </div>
          <h1 class="font-serif text-3xl md:text-5xl font-medium" style="color: var(--color-primary)">
            {{ course.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-3 font-mono text-xs text-muted uppercase tracking-wider">
            <span>{{ course.lessonsCount }} LESSONS</span>
            <span>•</span>
            <span>{{ course.duration }}</span>
            <span>•</span>
            <span>FIRST PRINCIPLES</span>
          </div>
          <p class="text-base md:text-lg leading-relaxed max-w-2xl" style="color: var(--color-on-surface-variant)">
            {{ course.longDescription || course.description }}
          </p>
        </header>

        <!-- What you'll learn -->
        <section v-if="course.outcomes && course.outcomes.length" class="space-y-4">
          <h2 class="font-serif text-xl md:text-2xl font-medium" style="color: var(--color-primary)">
            What You'll Learn
          </h2>
          <ul class="space-y-3 font-sans text-sm md:text-base" style="color: var(--color-on-surface-variant)">
            <li v-for="(outcome, idx) in course.outcomes" :key="idx" class="flex items-start gap-3">
              <svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ outcome }}</span>
            </li>
          </ul>
        </section>

        <!-- Locked Curriculum List -->
        <section class="space-y-6">
          <h2 class="font-serif text-xl md:text-2xl font-medium border-b pb-4" style="color: var(--color-primary); border-color: var(--border-subtle)">
            Curriculum Breakdown
          </h2>
          <div class="flex flex-col border-t" style="border-color: var(--border-subtle)">
            <div
              v-for="lesson in course.lessons"
              :key="lesson.id"
              class="flex items-center justify-between py-4 border-b opacity-60 hover:opacity-100 transition-opacity"
              style="border-color: var(--border-subtle)"
            >
              <div class="flex items-center gap-4">
                <svg class="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span class="font-sans text-sm font-medium" style="color: var(--color-on-surface)">
                  {{ lesson.title }}
                </span>
              </div>
              <span class="font-mono text-xs text-muted">{{ lesson.duration }}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Sticky Unlock Card -->
      <div class="lg:col-span-4 relative">
        <div
          class="sticky top-28 glass-card rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col gap-6 border shadow-2xl"
          style="border-color: var(--border-subtle)"
        >
          <!-- Blurred Hero Image with Lock Glyph -->
          <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/10 group">
            <img :src="course.image" :alt="course.alt" class="w-full h-full object-cover grayscale opacity-40 blur-[2px]" />
            <div class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
              <div class="w-14 h-14 rounded-full glass-card flex items-center justify-center border" style="border-color: var(--border-medium)">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Pricing & Benefits -->
          <div class="space-y-2">
            <div class="font-mono text-3xl font-bold" style="color: var(--color-primary)">
              {{ course.price }}
            </div>
            <p class="font-mono text-xs text-muted uppercase tracking-wider">
              ONE-TIME PAYMENT · LIFETIME ACCESS
            </p>
          </div>

          <!-- Unlock Action Buttons -->
          <div class="space-y-3 pt-2">
            <button
              v-if="!isAuthenticated"
              @click="openAuthModal"
              class="w-full py-4 px-4 rounded-xl font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              style="background: var(--color-primary); color: var(--color-on-primary)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Sign in to unlock</span>
            </button>

            <button
              v-else
              @click="handleUnlockClick"
              class="w-full py-4 px-4 rounded-xl font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              style="background: var(--color-primary); color: var(--color-on-primary)"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <span>Unlock — {{ course.price }}</span>
            </button>
          </div>

          <div class="text-center pt-2">
            <p class="font-mono text-[10px] text-muted">Secure Checkout · Razorpay & Local Mockup</p>
          </div>
        </div>
      </div>
    </div>

    <!-- UNLOCKED / PLAYER STATE (User is signed in and owns course) -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Video Player & Lesson Notes (Span 8) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- 16:9 Video Player Container -->
        <div class="w-full aspect-video rounded-2xl overflow-hidden glass-card relative border shadow-2xl" style="border-color: var(--border-subtle)">
          <iframe
            v-if="activeLesson && activeLesson.videoUrl"
            :src="activeLesson.videoUrl"
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            title="Lesson Video Player"
          ></iframe>
          <div v-else class="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6 text-center">
            <p class="font-serif text-lg">Sample Video Player</p>
          </div>
        </div>

        <!-- Active Lesson Header & Controls -->
        <div class="space-y-4 pt-2 border-b pb-6" style="border-color: var(--border-subtle)">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="font-mono text-xs uppercase tracking-widest text-muted">
                LESSON {{ course.lessons.findIndex(l => l.id === activeLesson?.id) + 1 }} OF {{ course.lessons.length }}
              </span>
              <span>•</span>
              <span class="font-mono text-xs text-muted">{{ activeLesson?.duration }}</span>
            </div>

            <button
              @click="handleToggleComplete"
              class="px-4 py-2 rounded-lg border font-mono text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
              :style="{
                background: activeLesson?.isCompleted ? 'var(--color-primary)' : 'transparent',
                color: activeLesson?.isCompleted ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                borderColor: 'var(--border-medium)'
              }"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ activeLesson?.isCompleted ? 'Completed' : 'Mark Complete' }}</span>
            </button>
          </div>

          <h1 class="font-serif text-2xl md:text-4xl font-medium" style="color: var(--color-primary)">
            {{ activeLesson?.title }}
          </h1>
        </div>

        <!-- Lesson Notes / Summary -->
        <div class="space-y-4">
          <h3 class="font-mono text-xs uppercase tracking-widest text-muted">Lesson Insights</h3>
          <p class="text-base leading-relaxed" style="color: var(--color-on-surface-variant)">
            {{ activeLesson?.notes || 'Focus on understanding first principles mechanics before applying resistance.' }}
          </p>
        </div>
      </div>

      <!-- Right Column: Curriculum Playlist Sidebar (Span 4) -->
      <div class="lg:col-span-4">
        <div
          class="glass-card rounded-2xl p-6 border space-y-6 sticky top-28"
          style="border-color: var(--border-subtle)"
        >
          <!-- Sidebar Header & Progress Bar -->
          <div class="space-y-3 border-b pb-4" style="border-color: var(--border-subtle)">
            <div class="flex items-center justify-between font-mono text-xs">
              <span class="uppercase tracking-wider font-semibold" style="color: var(--color-on-surface)">Course Curriculum</span>
              <span class="text-muted">{{ progressPercent }}% COMPLETE</span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full h-1.5 rounded-full overflow-hidden" style="background: var(--border-light)">
              <div
                class="h-full transition-all duration-500"
                style="background: var(--color-primary)"
                :style="{ width: `${progressPercent}%` }"
              ></div>
            </div>
          </div>

          <!-- Lesson List -->
          <div class="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            <button
              v-for="(lesson, idx) in course.lessons"
              :key="lesson.id"
              @click="selectLesson(lesson.id)"
              class="w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 group"
              :style="{
                background: activeLesson?.id === lesson.id ? 'var(--glass-hover-bg)' : 'transparent',
                borderColor: activeLesson?.id === lesson.id ? 'var(--border-hover)' : 'var(--border-light)'
              }"
            >
              <div class="flex items-center gap-3 min-w-0">
                <!-- Checkbox / Complete status -->
                <div
                  class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors"
                  :style="{
                    borderColor: lesson.isCompleted ? 'var(--color-primary)' : 'var(--border-medium)',
                    background: lesson.isCompleted ? 'var(--color-primary)' : 'transparent'
                  }"
                >
                  <svg v-if="lesson.isCompleted" class="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                  <span v-else class="font-mono text-[9px] text-muted">{{ idx + 1 }}</span>
                </div>

                <span
                  class="font-sans text-xs md:text-sm truncate transition-colors"
                  :style="{ color: activeLesson?.id === lesson.id ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }"
                >
                  {{ lesson.title }}
                </span>
              </div>

              <span class="font-mono text-[11px] text-muted shrink-0">{{ lesson.duration }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
