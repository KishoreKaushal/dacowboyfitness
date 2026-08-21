import { ref, computed, watch } from 'vue'
import { courses as initialCourses, type Course } from '../data/content'
import { useToast } from './useToast'
import { httpsCallable } from 'firebase/functions'
import { collection, getDocs } from 'firebase/firestore'
import { functions, db } from '../lib/firebase'
import { useAuth } from './useAuth'

const coursesList = ref<Course[]>(JSON.parse(JSON.stringify(initialCourses)))
const ownedCourseIds = ref<string[]>([])

export function useCourseAccess() {
  const { showToast } = useToast()
  const { isAuthenticated, currentUser } = useAuth()

  watch(isAuthenticated, (isAuth) => {
    if (isAuth && currentUser.value) {
      const entitlementsRef = collection(db, 'users', currentUser.value.uid, 'courseEntitlements')
      getDocs(entitlementsRef).then(snapshot => {
        ownedCourseIds.value = snapshot.docs.map(doc => doc.id)
      }).catch(err => {
        console.error("Failed to fetch entitlements:", err)
      })
    } else {
      ownedCourseIds.value = []
    }
  }, { immediate: true })

  const allCourses = computed(() => coursesList.value)

  const ownedCourses = computed(() => {
    return coursesList.value.filter(c => ownedCourseIds.value.includes(c.id))
  })

  function getCourseById(id: string | number): Course | undefined {
    const searchId = String(id)
    return coursesList.value.find(c => String(c.id) === searchId || c.slug === searchId)
  }

  function isCourseUnlocked(courseIdOrSlug: string | number): boolean {
    const course = getCourseById(courseIdOrSlug)
    if (!course) return false
    return ownedCourseIds.value.some(id => String(id) === String(course.id))
  }

  async function fetchCourseAccess(courseId: string | number) {
    try {
      const getAccess = httpsCallable(functions, 'getCourseAccess')
      const result = await getAccess({ courseId: String(courseId) })
      return result.data as any
    } catch (error: any) {
      console.error("Failed to fetch course access:", error)
      throw error
    }
  }

  function toggleLessonCompletion(courseId: string, lessonId: string) {
    const course = coursesList.value.find(c => c.id === courseId || c.slug === courseId)
    if (course) {
      const lesson = course.lessons.find(l => l.id === lessonId)
      if (lesson) {
        lesson.isCompleted = !lesson.isCompleted
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
    fetchCourseAccess,
    toggleLessonCompletion,
  }
}
