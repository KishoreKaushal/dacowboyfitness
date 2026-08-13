import { ref, computed } from 'vue'
import { courses as initialCourses, type Course } from '../data/content'
import { useToast } from './useToast'

const coursesList = ref<Course[]>(JSON.parse(JSON.stringify(initialCourses)))

export function useCourseAccess() {
  const { showToast } = useToast()

  const allCourses = computed(() => coursesList.value)

  const ownedCourses = computed(() => coursesList.value.filter(c => c.isOwned))

  function getCourseById(id: string): Course | undefined {
    return coursesList.value.find(c => c.id === id || c.slug === id)
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
    unlockCourse,
    toggleLessonCompletion,
  }
}
