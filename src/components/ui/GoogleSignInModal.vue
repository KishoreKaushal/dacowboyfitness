<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAuth } from '../../composables/useAuth'

const {
  isAuthModalOpen,
  isAuthSigningIn,
  authError,
  closeAuthModal,
  signInWithGoogle
} = useAuth()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isAuthModalOpen.value) {
    closeAuthModal()
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
    <Transition name="fade">
      <div
        v-if="isAuthModalOpen"
        class="modal-backdrop"
        @click="closeAuthModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div class="modal-card glass-panel" @click.stop>
          <!-- Close Button -->
          <button
            class="close-btn"
            :disabled="isAuthSigningIn"
            @click="closeAuthModal"
            aria-label="Close dialog"
          >
            <span class="material-symbols-outlined icon-20">close</span>
          </button>

          <!-- Branding & Headings -->
          <span class="brand-eyebrow font-label-sm">DaCowboy Fitness</span>
          <h2 id="auth-modal-title" class="font-display-lg modal-title">
            Continue your study
          </h2>
          <p class="font-body-md modal-subtitle">
            Sign in to unlock and track your courses
          </p>

          <!-- Error Alert if any -->
          <div v-if="authError" class="auth-error-box">
            <span>{{ authError }}</span>
          </div>

          <!-- Sign in Button -->
          <button
            class="google-btn btn-active font-body-md"
            :disabled="isAuthSigningIn"
            @click="signInWithGoogle"
          >
            <svg
              v-if="!isAuthSigningIn"
              class="google-icon"
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
            <svg
              v-else
              class="spinner-icon animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                fill="currentColor"
              ></path>
            </svg>
            <span>{{ isAuthSigningIn ? 'Signing in...' : 'Continue with Google' }}</span>
          </button>

          <p class="terms-caption font-label-sm">
            By continuing you agree to our Terms &amp; Privacy
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-margin-mobile);
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
}

.modal-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  padding: 40px 32px;
  display: flex;
  flex-col: column;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-radius: var(--radius-full);
  background: var(--color-surface-container);
  border: 1px solid var(--border-subtle);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

[data-theme='light'] .modal-card {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
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

.close-btn:hover:not(:disabled) {
  color: var(--color-primary);
  background-color: var(--btn-ghost-hover);
}

.close-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-20 {
  font-size: 20px;
}

.brand-eyebrow {
  color: var(--color-on-surface-variant);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 0.75rem;
  margin-bottom: 8px;
}

.modal-title {
  font-size: 2rem;
  line-height: 2.25rem;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.modal-subtitle {
  color: var(--color-on-surface-variant);
  font-size: 0.95rem;
  margin-bottom: 28px;
  max-width: 260px;
}

.auth-error-box {
  width: 100%;
  padding: 10px 14px;
  margin-bottom: 20px;
  border-radius: var(--radius-DEFAULT);
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  font-size: 0.85rem;
  line-height: 1.25rem;
}

.google-btn {
  width: 100%;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: var(--radius-DEFAULT);
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.1s ease;
  margin-bottom: 24px;
}

.google-btn:hover:not(:disabled) {
  opacity: 0.92;
}

.google-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

.google-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.spinner-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.terms-caption {
  font-size: 0.7rem;
  color: var(--color-on-surface-variant);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
