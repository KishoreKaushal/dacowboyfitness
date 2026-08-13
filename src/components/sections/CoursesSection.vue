<script setup lang="ts">
import CourseCard from '../ui/CourseCard.vue'
import { useCourseAccess } from '../../composables/useCourseAccess'

const { allCourses } = useCourseAccess()
</script>

<template>
  <section id="courses" class="section-padding">
    <div class="flex justify-between items-end mb-16">
      <div>
        <h2 class="font-headline-md text-4xl md:text-5xl section-heading">Foundational Knowledge</h2>
        <p class="font-label-sm mt-4 uppercase tracking-widest section-subtitle">Study the machine before you drive it</p>
      </div>
      <div class="hidden md:block">
        <span class="font-label-sm text-xs scroll-label">SCROLL TO DISCOVER</span>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <CourseCard v-for="course in allCourses" :key="course.id" :course="course" />
    </div>
  </section>
</template>

<style scoped>
.section-padding {
  padding: 128px 20px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .section-padding {
    padding: 128px 64px;
  }
}
.section-heading {
  color: var(--color-primary);
}
.section-subtitle {
  color: var(--color-on-surface-variant);
}
.scroll-label {
  opacity: 0.3;
  color: var(--color-on-surface);
}
</style>
