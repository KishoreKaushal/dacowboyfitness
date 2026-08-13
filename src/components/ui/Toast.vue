<script setup lang="ts">
import { useToast } from '../../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed bottom-6 right-6 flex flex-col gap-3 items-end z-[100] max-w-md w-full px-4 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 glass-card rounded-lg p-4 shadow-xl relative overflow-hidden w-full transition-all duration-300"
      >
        <!-- Left accent bar based on toast type -->
        <div
          class="absolute left-0 top-0 bottom-0 w-[3px]"
          :class="{
            'bg-emerald-400': toast.type === 'success',
            'bg-sky-400': toast.type === 'info',
            'bg-rose-400': toast.type === 'error',
          }"
        ></div>

        <!-- Status Icon -->
        <svg
          v-if="toast.type === 'success'"
          class="w-5 h-5 text-emerald-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <svg
          v-else-if="toast.type === 'info'"
          class="w-5 h-5 text-sky-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <svg
          v-else
          class="w-5 h-5 text-rose-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <!-- Message -->
        <span class="text-sm font-sans flex-grow" style="color: var(--color-on-surface)">
          {{ toast.message }}
        </span>

        <!-- Optional Action Button -->
        <button
          v-if="toast.actionText && toast.actionHandler"
          @click="toast.actionHandler(); removeToast(toast.id)"
          class="font-mono text-xs uppercase tracking-wider underline opacity-80 hover:opacity-100 transition-opacity"
          style="color: var(--color-on-surface)"
        >
          {{ toast.actionText }}
        </button>

        <!-- Close Button -->
        <button
          @click="removeToast(toast.id)"
          class="p-1 rounded opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Dismiss toast"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
