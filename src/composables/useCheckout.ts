import { ref } from 'vue'
import type { Course } from '../data/content'

const isOpen = ref(false)
const selectedCourse = ref<Course | null>(null)

export function useCheckout() {
  function openCheckout(course: Course) {
    selectedCourse.value = course
    isOpen.value = true
  }

  function closeCheckout() {
    isOpen.value = false
    selectedCourse.value = null
  }

  return {
    isOpen,
    selectedCourse,
    openCheckout,
    closeCheckout,
  }
}
