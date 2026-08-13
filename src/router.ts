import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CoursePlayerView from './views/CoursePlayerView.vue'
import LibraryView from './views/LibraryView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/course/:id', name: 'course-player', component: CoursePlayerView, props: true },
    { path: '/library', name: 'library', component: LibraryView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
