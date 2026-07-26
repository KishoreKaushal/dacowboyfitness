<script setup lang="ts">
import { useTheme } from './composables/useTheme'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import HeroSection from './components/sections/HeroSection.vue'
import CowboyWaySection from './components/sections/CowboyWaySection.vue'
import CoursesSection from './components/sections/CoursesSection.vue'
import JournalSection from './components/sections/JournalSection.vue'
import AboutSection from './components/sections/AboutSection.vue'
import CtaSection from './components/sections/CtaSection.vue'

// Initialize theme
useTheme()
</script>

<template>
  <div class="noise-overlay"></div>
  <AppHeader />
  <main class="pt-24 overflow-hidden">
    <HeroSection />
    <CowboyWaySection />
    <CoursesSection />
    <JournalSection />
    <AboutSection />
    <CtaSection />
  </main>
  <AppFooter />
</template>
