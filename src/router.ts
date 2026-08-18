import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('./views/HomeView.vue')
const CoursePlayerView = () => import('./views/CoursePlayerView.vue')
const LibraryView = () => import('./views/LibraryView.vue')
const JournalListView = () => import('./views/JournalListView.vue')
const JournalDetailView = () => import('./views/JournalDetailView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/course/:id', name: 'course-player', component: CoursePlayerView, props: true },
    { path: '/library', name: 'library', component: LibraryView },
    { path: '/journal', name: 'journal-list', component: JournalListView },
    { path: '/journal/:slug', name: 'journal-detail', component: JournalDetailView, props: true },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router

