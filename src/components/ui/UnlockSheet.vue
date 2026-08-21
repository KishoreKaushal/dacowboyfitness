<script setup lang="ts">
import { ref } from 'vue'
import { useCheckout } from '../../composables/useCheckout'
import { useCoupons } from '../../composables/useCoupons'

const { isOpen, selectedCourse, closeCheckout } = useCheckout()
const { isRedeeming, redeemCoupon } = useCoupons()

const couponCode = ref('')

async function handleRedeem() {
  if (!selectedCourse.value || !couponCode.value.trim()) return

  const success = await redeemCoupon(couponCode.value.trim(), selectedCourse.value.id)
  if (success) {
    couponCode.value = ''
    closeCheckout()
    // Force a reload so CoursePlayerView refetches the entitlement
    window.location.reload()
  }
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
          <span class="font-mono text-xs uppercase tracking-widest text-muted">Unlock Course</span>
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

        <!-- Coupon Input -->
        <div class="flex flex-col gap-2 mt-2">
          <label class="font-mono text-[10px] text-muted uppercase tracking-widest">Enter Access Code</label>
          <input
            v-model="couponCode"
            type="text"
            placeholder="e.g. FOUNDERS2026"
            class="w-full bg-transparent border rounded-lg px-4 py-3 font-mono text-sm uppercase tracking-wider outline-none transition-colors"
            style="color: var(--color-on-surface); border-color: var(--border-medium)"
            :disabled="isRedeeming"
            @keyup.enter="handleRedeem"
          />
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-2 mt-1">
          <button
            v-if="!isRedeeming"
            @click="handleRedeem"
            :disabled="!couponCode.trim()"
            class="w-full py-3.5 px-4 rounded-xl font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style="background: var(--color-primary); color: var(--color-on-primary)"
          >
            Redeem Code
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
            Verifying...
          </button>

          <button
            @click="closeCheckout"
            :disabled="isRedeeming"
            class="w-full py-2 font-mono text-xs uppercase tracking-wider text-muted hover:underline transition-colors"
          >
            Cancel
          </button>
        </div>

        <!-- Footer footnote -->
        <div class="text-center">
          <p class="font-mono text-[10px] text-muted">Razorpay integration pending. Use access code to unlock.</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
