import { ref } from 'vue'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../lib/firebase'
import { useToast } from './useToast'

export function useCoupons() {
  const isRedeeming = ref(false)
  const { showToast } = useToast()

  async function redeemCoupon(couponCode: string, courseId: string | number): Promise<boolean> {
    if (!couponCode.trim()) {
      showToast('Please enter a valid coupon code.', 'error')
      return false
    }

    isRedeeming.value = true
    try {
      const redeemCall = httpsCallable(functions, 'redeemCoupon')
      const result = await redeemCall({ couponCode: couponCode.trim(), courseId: String(courseId) })
      
      const data = result.data as any
      if (data?.success) {
        showToast('Course unlocked successfully!', 'success')
        return true
      }
      return false
    } catch (error: any) {
      console.error("Coupon redemption error:", error)
      showToast(error.message || 'Failed to redeem coupon. Please try again.', 'error')
      return false
    } finally {
      isRedeeming.value = false
    }
  }

  return {
    isRedeeming,
    redeemCoupon
  }
}
