<script setup lang="ts">
import { useTheme } from '../../composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <button
    class="theme-toggle"
    aria-label="Toggle Theme"
    @click="toggleTheme"
  >
    <span class="material-symbols-outlined icon">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  color: var(--color-on-surface-variant);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.theme-toggle:hover {
  color: var(--color-primary);
}
.icon {
  font-size: 20px;
  font-variation-settings: 'wght' 200;
}
</style>
