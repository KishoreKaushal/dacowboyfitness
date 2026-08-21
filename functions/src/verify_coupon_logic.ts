/**
 * Pure Unit Test to verify the exact schema from your screenshot:
 * - courseId: "1" (string, with or without literal quotes)
 * - maxRedemptions: 2 (number)
 * - currentRedemptions: 0 (number)
 */

interface CouponData {
  courseId?: string | number;
  maxRedemptions?: number | string;
  currentRedemptions?: number | string;
}

interface ValidationResult {
  valid: boolean;
  error?: string;
  newCount?: number;
}

function validateAndRedeem(
  couponData: CouponData,
  requestCourseId: string | number,
  alreadyRedeemedByThisUser: boolean
): ValidationResult {
  // 1. Check Course Match
  if (couponData.courseId !== undefined && couponData.courseId !== null) {
    const allowedCourse = String(couponData.courseId).trim().replace(/^["']|["']$/g, '').toLowerCase();
    const targetCourse = String(requestCourseId).trim().replace(/^["']|["']$/g, '').toLowerCase();
    if (allowedCourse && allowedCourse !== "all" && allowedCourse !== targetCourse) {
      return { valid: false, error: "Coupon is not valid for this course." };
    }
  }

  // 2. Check Idempotency (User already redeemed)
  if (alreadyRedeemedByThisUser) {
    return { valid: false, error: "You have already redeemed this coupon." };
  }

  // 3. Enforce Numeric Limits
  const maxRedemptions = Number(couponData.maxRedemptions) || 0;
  const currentRedemptions = Number(couponData.currentRedemptions) || 0;

  if (maxRedemptions > 0 && currentRedemptions >= maxRedemptions) {
    return { valid: false, error: "This coupon has reached its redemption limit." };
  }

  return { valid: true, newCount: currentRedemptions + 1 };
}

function runVerification() {
  console.log("\n==========================================");
  console.log(" VERIFYING EXACT SCREENSHOT COUPON SCHEMA");
  console.log("==========================================\n");

  // Exact screenshot schema
  const couponFromScreenshot: CouponData = {
    courseId: '1',        // string "1" (or '"1"')
    maxRedemptions: 2,    // number 2
    currentRedemptions: 0 // number 0
  };

  console.log("Testing Coupon Document:", JSON.stringify(couponFromScreenshot, null, 2));

  // Case 1: User A redeems for Course 1
  const test1 = validateAndRedeem(couponFromScreenshot, "1", false);
  console.log("✓ Case 1 [User A, Course '1']:", test1.valid ? `PASSED (Redemptions: ${test1.newCount}/2)` : `FAILED: ${test1.error}`);
  if (!test1.valid) throw new Error("Test 1 Failed");

  // Update counter
  couponFromScreenshot.currentRedemptions = test1.newCount;

  // Case 2: User A attempts duplicate redemption
  const testDuplicate = validateAndRedeem(couponFromScreenshot, "1", true);
  console.log("✓ Case 2 [User A duplicate]:", !testDuplicate.valid && testDuplicate.error === "You have already redeemed this coupon." ? `PASSED (Blocked: "${testDuplicate.error}")` : `FAILED`);
  if (testDuplicate.valid) throw new Error("Test 2 Failed");

  // Case 3: User B redeems for Course 1 (2nd redemption)
  const test2 = validateAndRedeem(couponFromScreenshot, "1", false);
  console.log("✓ Case 3 [User B, Course '1']:", test2.valid ? `PASSED (Redemptions: ${test2.newCount}/2)` : `FAILED: ${test2.error}`);
  if (!test2.valid) throw new Error("Test 3 Failed");

  // Update counter
  couponFromScreenshot.currentRedemptions = test2.newCount;

  // Case 4: User C attempts 3rd redemption (Limit 2 reached)
  const test3 = validateAndRedeem(couponFromScreenshot, "1", false);
  console.log("✓ Case 4 [User C, Course '1']:", !test3.valid && test3.error === "This coupon has reached its redemption limit." ? `PASSED (Blocked: "${test3.error}")` : `FAILED`);
  if (test3.valid) throw new Error("Test 4 Failed");

  // Case 5: Literal quotes test (e.g. if user typed '"1"' in text box)
  const couponWithLiteralQuotes: CouponData = { courseId: '"1"', maxRedemptions: 2, currentRedemptions: 0 };
  const testQuotes = validateAndRedeem(couponWithLiteralQuotes, "1", false);
  console.log("✓ Case 5 [Literal Quotes '\"1\"' in Firestore]:", testQuotes.valid ? `PASSED (Normalized to '1')` : `FAILED: ${testQuotes.error}`);
  if (!testQuotes.valid) throw new Error("Test 5 Failed");

  console.log("\n ALL 5 TEST CASES PASSED SUCCESSFULLY!\n");
}

runVerification();
