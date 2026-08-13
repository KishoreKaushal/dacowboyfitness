<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useCourseAccess } from '../../composables/useCourseAccess'

const router = useRouter()
const { ownedCourses } = useCourseAccess()

const {
  currentUser,
  isProfileDrawerOpen,
  closeProfileDrawer,
  signOutUser
} = useAuth()

const userDisplayName = computed(() => currentUser.value?.displayName || 'Cowboy Member')
const userEmail = computed(() => currentUser.value?.email || '')
const userPhotoURL = computed(() => currentUser.value?.photoURL || '')
const userInitials = computed(() => {
  const name = userDisplayName.value
  if (!name) return 'C'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})

function goToLibrary() {
  closeProfileDrawer()
  router.push('/library')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isProfileDrawerOpen.value) {
    closeProfileDrawer()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isProfileDrawerOpen"
        class="drawer-backdrop"
        @click="closeProfileDrawer"
        aria-hidden="true"
      ></div>
    </Transition>

    <!-- Slide-in Drawer -->
    <Transition name="slide-right">
      <aside
        v-if="isProfileDrawerOpen"
        class="profile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Profile navigation"
      >
        <!-- Header / Identity -->
        <div class="drawer-header">
          <button
            class="drawer-close-btn"
            @click="closeProfileDrawer"
            aria-label="Close profile drawer"
          >
            <span class="material-symbols-outlined icon-20">close</span>
          </button>

          <div class="user-profile-row">
            <div class="avatar-container">
              <img
                v-if="userPhotoURL"
                :src="userPhotoURL"
                :alt="userDisplayName"
                class="avatar-img"
              />
              <div v-else class="avatar-fallback font-label-sm">
                {{ userInitials }}
              </div>
            </div>

            <div class="user-info">
              <h2 class="font-display-lg user-name">{{ userDisplayName }}</h2>
              <span class="font-label-sm user-email">{{ userEmail }}</span>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Navigation List -->
        <nav class="drawer-nav">
          <button class="nav-item group" @click="goToLibrary">
            <div class="nav-item-left">
              <span class="material-symbols-outlined icon-20">book</span>
              <span class="font-body-md nav-label">My Library</span>
            </div>
            <span class="nav-badge font-label-sm">{{ ownedCourses.length }}</span>
          </button>

          <button class="nav-item group" @click="closeProfileDrawer">
            <div class="nav-item-left">
              <span class="material-symbols-outlined icon-20">play_circle</span>
              <span class="font-body-md nav-label">Continue watching</span>
            </div>
          </button>

          <button class="nav-item group" @click="closeProfileDrawer">
            <div class="nav-item-left">
              <span class="material-symbols-outlined icon-20">person</span>
              <span class="font-body-md nav-label">Account</span>
            </div>
          </button>

          <button class="nav-item book-call-item group" @click="closeProfileDrawer">
            <div class="nav-item-left">
              <span class="material-symbols-outlined icon-20">calendar_month</span>
              <span class="font-body-md nav-label">Book a 1:1 call</span>
            </div>
            <span class="material-symbols-outlined icon-16 arrow-icon">arrow_forward</span>
          </button>
        </nav>

        <!-- Bottom Pinned Section -->
        <div class="drawer-footer">
          <button class="sign-out-btn font-body-md group" @click="signOutUser">
            <span class="material-symbols-outlined icon-20 logout-icon">logout</span>
            <span>Sign out</span>
          </button>

          <div class="footer-meta font-label-sm">
            <span>DACOWBOY FITNESS ACADEMY</span>
            <span class="meta-sub">FIRST PRINCIPLES ONLY</span>
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

.profile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 100%;
  max-width: 360px;
  z-index: 95;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface-container);
  border-left: 1px solid var(--border-subtle);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

[data-theme='light'] .profile-drawer {
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
}

.drawer-header {
  position: relative;
  padding: 32px 24px 24px;
}

.drawer-close-btn {
  position: absolute;
  top: 24px;
  right: 20px;
  background: transparent;
  border: none;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.drawer-close-btn:hover {
  color: var(--color-primary);
  background-color: var(--btn-ghost-hover);
}

.user-profile-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 8px;
}

.avatar-container {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  flex-shrink: 0;
  background-color: var(--color-surface);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1.1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-size: 1.5rem;
  line-height: 1.75rem;
  color: var(--color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: var(--color-on-surface-variant);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
}

.divider {
  width: 100%;
  height: 1px;
  background-color: var(--border-subtle);
  opacity: 0.6;
}

.drawer-nav {
  flex: 1;
  overflow-y: auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: var(--radius-full);
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-item:hover {
  color: var(--color-primary);
  background-color: var(--btn-ghost-hover);
  border-color: var(--border-subtle);
}

.nav-item-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-label {
  font-size: 0.95rem;
}

.nav-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid var(--border-subtle);
  color: var(--color-primary);
  font-size: 0.75rem;
}

.book-call-item {
  margin-top: 12px;
}

.arrow-icon {
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.2s ease;
  color: var(--color-on-surface-variant);
}

.nav-item:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
  color: var(--color-primary);
}

.drawer-footer {
  padding: 24px;
  border-top: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sign-out-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-DEFAULT);
  background: transparent;
  border: 1px solid var(--border-subtle);
  color: var(--color-on-surface-variant);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sign-out-btn:hover {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
}

.logout-icon {
  transition: transform 0.2s ease;
}

.sign-out-btn:hover .logout-icon {
  transform: translateX(-3px);
}

.footer-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--color-on-surface-variant);
  opacity: 0.5;
}

.meta-sub {
  font-size: 0.6rem;
}

.icon-20 {
  font-size: 20px;
}

.icon-16 {
  font-size: 16px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
