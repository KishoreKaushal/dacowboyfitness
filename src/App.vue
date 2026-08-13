<script setup lang="ts">
import { useTheme } from './composables/useTheme'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import GoogleSignInModal from './components/ui/GoogleSignInModal.vue'
import ProfileDrawer from './components/ui/ProfileDrawer.vue'
import UnlockSheet from './components/ui/UnlockSheet.vue'
import Toast from './components/ui/Toast.vue'

// Initialize theme
useTheme()
</script>

<template>
  <div class="noise-overlay"></div>
  <AppHeader />
  <main class="overflow-hidden min-h-screen">
    <router-view />
  </main>
  <AppFooter />

  <!-- Global Modals, Drawers & Overlays -->
  <GoogleSignInModal />
  <ProfileDrawer />
  <UnlockSheet />
  <Toast />
</template>
