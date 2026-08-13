import { ref, computed } from 'vue'
import { courses as initialCourses, type Course } from '../data/content'
import { useToast } from './useToast'
import { useAuth } from './useAuth'

const coursesList = ref<Course[]>(JSON.parse(JSON.stringify(initialCourses)))

export function useCourseAccess() {
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()

  const allCourses = computed(() => coursesList.value)

  const ownedCourses = computed(() => {
    if (!isAuthenticated.value) return []
    return coursesList.value.filter(c => c.isOwned)
  })

  function getCourseById(id: string): Course | undefined {
    return coursesList.value.find(c => c.id === id || c.slug === id)
  }

  function isCourseUnlocked(courseIdOrSlug: string): boolean {
    if (!isAuthenticated.value) return false
    const course = getCourseById(courseIdOrSlug)
    return !!course?.isOwned
  }

  function unlockCourse(courseId: string) {
    const course = coursesList.value.find(c => c.id === courseId || c.slug === courseId)
    if (course) {
      course.isOwned = true
      showToast(`Course "${course.title}" unlocked — enjoy!`, 'success')
    }
  }

  function toggleLessonCompletion(courseId: string, lessonId: string) {
    const course = coursesList.value.find(c => c.id === courseId || c.slug === courseId)
    if (course) {
      const lesson = course.lessons.find(l => l.id === lessonId)
      if (lesson) {
        lesson.isCompleted = !lesson.isCompleted
        // Recalculate completed count
        course.completedLessonsCount = course.lessons.filter(l => l.isCompleted).length
        const statusMsg = lesson.isCompleted ? 'Lesson marked complete.' : 'Lesson marked incomplete.'
        showToast(statusMsg, 'info')
      }
    }
  }

  return {
    allCourses,
    ownedCourses,
    getCourseById,
    isCourseUnlocked,
    unlockCourse,
    toggleLessonCompletion,
  }
}
