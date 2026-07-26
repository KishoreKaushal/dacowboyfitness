import { ref, computed, watchEffect } from 'vue'

type Theme = 'dark' | 'light'

const theme = ref<Theme>(getInitialTheme())

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('dacowboy-theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setTheme(t: Theme) {
    theme.value = t
  }

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
    localStorage.setItem('dacowboy-theme', theme.value)
  })

  return { theme, isDark, toggleTheme, setTheme }
}
