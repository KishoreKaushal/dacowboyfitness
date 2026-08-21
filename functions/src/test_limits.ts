import * as admin from "firebase-admin";

// Ensure emulator is targeted when running locally
process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || "localhost:8080";

if (!admin.apps.length) {
  admin.initializeApp({ projectId: "demo-dacowboy" });
}

const db = admin.firestore();

async function simulateRedeem(uid: string, couponCode: string, courseId: string) {
  try {
    const res = await db.runTransaction(async (transaction) => {
      const couponRef = db.doc(`coupons/${couponCode}`);
      const redemptionRef = db.doc(`users/${uid}/couponRedemptions/${couponCode}`);
      const entitlementRef = db.doc(`users/${uid}/courseEntitlements/${courseId}`);

      const couponSnap = await transaction.get(couponRef);
      const redemptionSnap = await transaction.get(redemptionRef);

      if (!couponSnap.exists) {
        throw new Error("Invalid coupon code.");
      }

      const couponData = couponSnap.data() || {};

      if (couponData.courseId && couponData.courseId !== courseId) {
        throw new Error("Coupon is not valid for this course.");
      }

      if (redemptionSnap.exists) {
        throw new Error("You have already redeemed this coupon.");
      }

      const maxRedemptions = couponData.maxRedemptions || 0;
      const currentRedemptions = couponData.currentRedemptions || 0;

      if (maxRedemptions > 0 && currentRedemptions >= maxRedemptions) {
        throw new Error("This coupon has reached its redemption limit.");
      }

      if (maxRedemptions > 0) {
        transaction.update(couponRef, {
          currentRedemptions: currentRedemptions + 1,
        });
      }

      transaction.set(redemptionRef, {
        redeemedAt: admin.firestore.FieldValue.serverTimestamp(),
        courseId: courseId,
      });

      transaction.set(entitlementRef, {
        grantedAt: admin.firestore.FieldValue.serverTimestamp(),
        source: "coupon",
        couponCode: couponCode,
      });

      return { success: true, newCount: currentRedemptions + 1 };
    });
    return { ok: true, data: res };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

async function runTest() {
  console.log("=== Testing maxRedemptions: 2 Logic ===");

  const couponCode = "TEST2026";
  const courseId = "1";

  // 1. Seed the coupon with maxRedemptions: 2
  await db.doc(`coupons/${couponCode}`).set({
    courseId,
    maxRedemptions: 2,
    currentRedemptions: 0,
  });
  console.log(`[SETUP] Seeded coupon '${couponCode}' with maxRedemptions: 2`);

  // 2. User A attempts 1st redemption
  const res1 = await simulateRedeem("userA", couponCode, courseId);
  console.log(`[USER A - 1st attempt]:`, res1.ok ? `SUCCESS (Redemptions: ${res1.data?.newCount}/2)` : `FAILED: ${res1.error}`);

  // 3. User A attempts duplicate redemption
  const resDuplicate = await simulateRedeem("userA", couponCode, courseId);
  console.log(`[USER A - Duplicate attempt]:`, resDuplicate.ok ? `SUCCESS` : `BLOCKED AS EXPECTED: ${resDuplicate.error}`);

  // 4. User B attempts 2nd redemption
  const res2 = await simulateRedeem("userB", couponCode, courseId);
  console.log(`[USER B - 2nd attempt]:`, res2.ok ? `SUCCESS (Redemptions: ${res2.data?.newCount}/2)` : `FAILED: ${res2.error}`);

  // 5. User C attempts 3rd redemption (should fail due to maxRedemptions = 2)
  const res3 = await simulateRedeem("userC", couponCode, courseId);
  console.log(`[USER C - 3rd attempt]:`, res3.ok ? `SUCCESS` : `BLOCKED AS EXPECTED: ${res3.error}`);

  console.log("=== Test Complete ===");
}

runTest().catch(console.error);
