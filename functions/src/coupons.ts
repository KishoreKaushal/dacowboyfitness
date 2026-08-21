import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// Ensure app is initialized exactly once
if (!admin.apps.length) {
  admin.initializeApp();
}

export const redeemCoupon = onCall(async (request) => {
  const { auth, data } = request;
  const rawCouponCode = String(data?.couponCode || "").trim();
  const courseId = String(data?.courseId || "").trim();

  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated to redeem a coupon."
    );
  }

  if (!rawCouponCode || !courseId) {
    throw new HttpsError(
      "invalid-argument",
      "couponCode and courseId are required."
    );
  }

  const uid = auth.uid;
  const db = getFirestore();

  try {
    await db.runTransaction(async (transaction) => {
      let couponRef = db.doc(`coupons/${rawCouponCode}`);
      let couponSnap = await transaction.get(couponRef);

      // Also try uppercase if direct match doesn't exist
      if (!couponSnap.exists && rawCouponCode !== rawCouponCode.toUpperCase()) {
        const upperRef = db.doc(`coupons/${rawCouponCode.toUpperCase()}`);
        const upperSnap = await transaction.get(upperRef);
        if (upperSnap.exists) {
          couponRef = upperRef;
          couponSnap = upperSnap;
        }
      }

      // 2. Validate Coupon exists
      if (!couponSnap.exists) {
        throw new HttpsError("not-found", "Invalid coupon code.");
      }

      const couponCode = couponRef.id;
      const redemptionRef = db.doc(`users/${uid}/couponRedemptions/${couponCode}`);
      const entitlementRef = db.doc(`users/${uid}/courseEntitlements/${courseId}`);

      const redemptionSnap = await transaction.get(redemptionRef);
      const couponData = couponSnap.data() || {};
      
      // Ensure coupon is for the requested course (or all courses if omitted or 'all')
      if (couponData.courseId !== undefined && couponData.courseId !== null) {
        const allowedCourse = String(couponData.courseId).trim().replace(/^["']|["']$/g, '').toLowerCase();
        const targetCourse = courseId.replace(/^["']|["']$/g, '').toLowerCase();
        if (allowedCourse && allowedCourse !== "all" && allowedCourse !== targetCourse) {
          throw new HttpsError("invalid-argument", "Coupon is not valid for this course.");
        }
      }

      // 3. Check Idempotency / Previous Redemption inside transaction
      if (redemptionSnap.exists) {
        throw new HttpsError("already-exists", "You have already redeemed this coupon.");
      }

      // 4. Enforce Limits (safely parse strings or numbers)
      const maxRedemptions = Number(couponData.maxRedemptions) || 0;
      const currentRedemptions = Number(couponData.currentRedemptions) || 0;

      if (maxRedemptions > 0 && currentRedemptions >= maxRedemptions) {
        throw new HttpsError("resource-exhausted", "This coupon has reached its redemption limit.");
      }

      // 5. Apply Writes
      if (maxRedemptions > 0) {
        transaction.update(couponRef, {
          currentRedemptions: currentRedemptions + 1
        });
      }

      transaction.set(redemptionRef, {
        redeemedAt: FieldValue.serverTimestamp(),
        courseId: courseId
      });

      transaction.set(entitlementRef, {
        grantedAt: FieldValue.serverTimestamp(),
        source: "coupon",
        couponCode: couponCode
      });
    });

    return { success: true, message: "Coupon redeemed successfully." };
  } catch (error: any) {
    // If it's an HttpsError or has an error code, rethrow directly
    if (error instanceof HttpsError || (error && error.code)) {
      throw error;
    }
    console.error("Transaction failure:", error);
    throw new HttpsError("internal", error?.message || "An error occurred during coupon redemption.");
  }
});
