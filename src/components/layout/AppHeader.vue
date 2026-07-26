<script setup lang="ts">
import CowboyLogo from '../icons/CowboyLogo.vue'
import ThemeToggle from '../ui/ThemeToggle.vue'
import { navLinks } from '../../data/content'

function scrollTo(href: string) {
  if (href === '#') return
  const el = document.querySelector(href)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <header class="header">
    <nav class="nav-inner">
      <div class="brand">
        <div class="logo-wrap">
          <CowboyLogo />
        </div>
        <span class="font-display-lg">DaCowboy Fitness</span>
      </div>
      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          :class="['nav-link', { 'nav-link--active': link.active }]"
          @click.prevent="scrollTo(link.href)"
        >
          {{ link.label }}
        </a>
        <ThemeToggle />
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
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
  text-decoration: none;
}
.nav-link:hover {
  color: var(--color-primary);
}
.nav-link--active {
  color: var(--color-primary);
  border-bottom: 1px solid var(--color-primary);
  padding-bottom: 4px;
}
</style>
