import { ref } from 'vue'

export type ToastType = 'success' | 'info' | 'error'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  actionText?: string
  actionHandler?: () => void
}

const toasts = ref<ToastItem[]>([])

export function useToast() {
  function showToast(message: string, type: ToastType = 'info', actionText?: string, actionHandler?: () => void) {
    const id = Date.now().toString()
    const toast: ToastItem = { id, message, type, actionText, actionHandler }
    toasts.value.push(toast)

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast,
  }
}
