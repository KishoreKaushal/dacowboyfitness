import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

if (!admin.apps.length) {
  admin.initializeApp();
}

export const getCourseAccess = onCall(async (request) => {
  const { auth, data } = request;
  const courseId = String(data?.courseId || "").trim();

  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated to check course access."
    );
  }

  if (!courseId) {
    throw new HttpsError("invalid-argument", "courseId is required.");
  }

  const uid = auth.uid;
  const db = getFirestore();

  // 1. Verify Entitlement
  const entitlementRef = db.doc(`users/${uid}/courseEntitlements/${courseId}`);
  const entitlementSnap = await entitlementRef.get();

  if (!entitlementSnap.exists) {
    throw new HttpsError(
      "permission-denied",
      "User is not entitled to access this course."
    );
  }

  // 2. Resolve Content (Today: Firestore Admin SDK bypasses client rules if present, or returns entitlement payload)
  const courseContentRef = db.doc(`courseContent/${courseId}`);
  const courseContentSnap = await courseContentRef.get();

  if (courseContentSnap.exists) {
    return {
      courseId,
      accessGranted: true,
      ...courseContentSnap.data(),
    };
  }

  // Fallback for interim state before Curriq/Firestore video assets are seeded
  return {
    courseId,
    accessGranted: true,
    unlocked: true
  };
});
