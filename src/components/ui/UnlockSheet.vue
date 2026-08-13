<script setup lang="ts">
import { ref } from 'vue'
import { useCheckout } from '../../composables/useCheckout'
import { useCourseAccess } from '../../composables/useCourseAccess'

const { isOpen, selectedCourse, closeCheckout } = useCheckout()
const { unlockCourse } = useCourseAccess()

const isProcessing = ref(false)

function handlePay() {
  if (!selectedCourse.value) return
  isProcessing.value = true

  setTimeout(() => {
    unlockCourse(selectedCourse.value!.id)
    isProcessing.value = false
    closeCheckout()
  }, 1000)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && selectedCourse"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300"
      @click.self="closeCheckout"
    >
      <div
        class="w-full max-w-[420px] glass-card rounded-2xl overflow-hidden p-6 flex flex-col gap-6 relative shadow-2xl border"
        style="border-color: var(--border-subtle); background: var(--color-surface)"
      >
        <!-- Header & Close -->
        <div class="flex items-center justify-between">
          <span class="font-mono text-xs uppercase tracking-widest text-muted">Checkout Confirmation</span>
          <button
            @click="closeCheckout"
            class="p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Close modal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Course Info -->
        <div class="flex flex-col gap-3">
          <div class="w-full aspect-video rounded-xl overflow-hidden relative grayscale opacity-90 border border-white/5">
            <img :src="selectedCourse.image" :alt="selectedCourse.alt" class="w-full h-full object-cover" />
          </div>
          <div>
            <h3 class="font-serif text-xl font-medium" style="color: var(--color-on-surface)">
              {{ selectedCourse.title }}
            </h3>
            <p class="font-mono text-xs text-muted uppercase mt-0.5">DACOWBOY ACADEMY</p>
          </div>
        </div>

        <!-- Order Summary -->
        <div
          class="w-full rounded-xl p-4 font-mono text-xs flex flex-col gap-3 border"
          style="background: var(--glass-bg-start); border-color: var(--border-subtle)"
        >
          <div class="flex justify-between items-center" style="color: var(--color-on-surface-variant)">
            <span>COURSE ACCESS</span>
            <span class="font-bold" style="color: var(--color-on-surface)">{{ selectedCourse.price }}</span>
          </div>
          <div class="flex justify-between items-center text-[10px]" style="color: var(--color-on-surface-variant)">
            <span>ACCESS TYPE</span>
            <span>LIFETIME · ONE-TIME</span>
          </div>
          <div class="h-[1px] w-full" style="background: var(--border-subtle)"></div>
          <div class="flex justify-between items-center font-bold text-sm" style="color: var(--color-on-surface)">
            <span>TOTAL</span>
            <span>{{ selectedCourse.price }}</span>
          </div>
        </div>

        <!-- Reassurance Bullets -->
        <ul class="flex flex-col gap-2 text-xs" style="color: var(--color-on-surface-variant)">
          <li class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Lifetime access to all video lessons</span>
          </li>
          <li class="flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>All current & future course updates</span>
          </li>
          <li class="flex items-center gap-2">
            <svg class="w-4 h-4 text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure payment via Razorpay</span>
          </li>
        </ul>

        <!-- Actions -->
        <div class="flex flex-col gap-2 mt-1">
          <button
            v-if="!isProcessing"
            @click="handlePay"
            class="w-full py-3.5 px-4 rounded-xl font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg"
            style="background: var(--color-primary); color: var(--color-on-primary)"
          >
            Pay {{ selectedCourse.price }}
          </button>
          <button
            v-else
            disabled
            class="w-full py-3.5 px-4 rounded-xl font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-3 opacity-70 cursor-not-allowed"
            style="background: var(--color-primary); color: var(--color-on-primary)"
          >
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Opening secure checkout...
          </button>

          <button
            @click="closeCheckout"
            :disabled="isProcessing"
            class="w-full py-2 font-mono text-xs uppercase tracking-wider text-muted hover:underline transition-colors"
          >
            Cancel
          </button>
        </div>

        <!-- Footer footnote -->
        <div class="text-center">
          <p class="font-mono text-[10px] text-muted">Test mode · Instant mockup unlock demonstration</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
