<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CowboyLogo from '../icons/CowboyLogo.vue'
import ThemeToggle from '../ui/ThemeToggle.vue'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const route = useRoute()

const {
  currentUser,
  isAuthenticated,
  isLoading,
  openAuthModal,
  toggleProfileDrawer
} = useAuth()

const userDisplayName = computed(() => currentUser.value?.displayName || 'User')
const userPhotoURL = computed(() => currentUser.value?.photoURL || '')
const userInitials = computed(() => {
  const name = userDisplayName.value
  if (!name) return 'U'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
})

const links = [
  { label: 'Courses', href: '#courses', route: '/' },
  { label: 'The Cowboy Way', href: '#cowboy-way', route: '/' },
  { label: 'Journal', href: '/journal', route: '/journal' },
  { label: 'About', href: '#about', route: '/' },
  { label: 'My Library', href: '/library', route: '/library' },
]

function navigate(link: typeof links[0]) {
  if (link.route === '/library') {
    if (!isAuthenticated.value) {
      openAuthModal()
      return
    }
    router.push('/library')
  } else if (link.route === '/journal') {
    router.push('/journal')
  } else {
    if (route.path !== '/') {
      router.push({ path: '/', hash: link.href })
    } else {
      const el = document.querySelector(link.href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <header class="header">
    <nav class="nav-inner">
      <div class="brand cursor-pointer" @click="goHome">
        <div class="logo-wrap">
          <CowboyLogo />
        </div>
        <span class="font-serif font-medium">DaCowboy Fitness</span>
      </div>

      <div class="flex items-center gap-4 md:gap-8">
        <div class="hidden md:flex items-center gap-6">
          <button
            v-for="link in links"
            :key="link.label"
            class="nav-link text-sm font-sans"
            :class="{ 'nav-link--active': route.path === link.route && link.route === '/library' }"
            @click="navigate(link)"
          >
            {{ link.label }}
          </button>
        </div>

        <ThemeToggle />

        <!-- Auth State Cluster -->
        <div class="auth-cluster">
          <!-- Loading skeleton state -->
          <div v-if="isLoading" class="avatar-skeleton"></div>

          <!-- Authenticated State: User Avatar Trigger -->
          <button
            v-else-if="isAuthenticated"
            class="user-avatar-btn btn-active"
            @click="toggleProfileDrawer"
            aria-label="Open profile menu"
            :title="userDisplayName"
          >
            <img
              v-if="userPhotoURL"
              :src="userPhotoURL"
              :alt="userDisplayName"
              class="avatar-img"
            />
            <span v-else class="avatar-initials font-label-sm">
              {{ userInitials }}
            </span>
          </button>

          <!-- Guest State: Sign In Button -->
          <button
            v-else
            class="sign-in-btn btn-active font-label-sm"
            @click="openAuthModal"
          >
            <svg
              class="google-logo"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>SIGN IN</span>
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  background-color: color-mix(in srgb, var(--color-background) 80%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .nav-inner {
    padding: 16px 64px;
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 1.5rem;
  letter-spacing: -0.05em;
  color: var(--color-primary);
}

@media (min-width: 768px) {
  .brand {
    font-size: 1.875rem;
  }
}

.logo-wrap {
  height: 32px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.nav-link {
  color: var(--color-on-surface-variant);
  transition: color 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 0;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link--active {
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-primary);
}

.auth-cluster {
  display: flex;
  align-items: center;
}

.sign-in-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.1s ease;
}

.sign-in-btn:hover {
  opacity: 0.9;
}

.google-logo {
  width: 16px;
  height: 16px;
}

.user-avatar-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 1.5px solid var(--border-subtle);
  background-color: var(--color-surface-container);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, transform 0.1s ease;
}

.user-avatar-btn:hover {
  border-color: var(--color-primary);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.8rem;
}

.avatar-skeleton {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--border-subtle);
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
</style>
