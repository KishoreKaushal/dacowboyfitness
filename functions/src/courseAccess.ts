import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

// admin.initializeApp() and setGlobalOptions({ region }) are handled in index.ts

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

export const getLessonPlayback = onCall(async (request) => {
  const { auth, data } = request;
  const courseId = String(data?.courseId || "").trim();
  const assetId = String(data?.assetId || "").trim();

  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated to request playback."
    );
  }

  if (!courseId || !assetId) {
    throw new HttpsError("invalid-argument", "courseId and assetId are required.");
  }

  const uid = auth.uid;
  const db = getFirestore();

  // 1. Verify Entitlement in Firestore
  const entitlementRef = db.doc(`users/${uid}/courseEntitlements/${courseId}`);
  const entitlementSnap = await entitlementRef.get();

  if (!entitlementSnap.exists) {
    throw new HttpsError(
      "permission-denied",
      "User is not entitled to access this course."
    );
  }

  // 2. Query Curriq API using backend secrets
  const curriqApiUrl = process.env.CURRIQ_API_URL;
  const curriqReadKey = process.env.CURRIQ_READ_KEY;

  if (!curriqApiUrl || !curriqReadKey) {
    console.error("CURRIQ_API_URL or CURRIQ_READ_KEY is not configured on server");
    throw new HttpsError("internal", "Video playback service is not properly configured.");
  }

  try {
    const res = await fetch(`${curriqApiUrl}/v1/videos/${encodeURIComponent(assetId)}/playback`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${curriqReadKey}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Curriq API error ${res.status}:`, errorBody);
      throw new HttpsError("internal", `Curriq playback service returned ${res.status}`);
    }

    const json = (await res.json()) as { url: string; playbackId: string; expiresInSeconds: number };
    return {
      playbackUrl: json.url,
      playbackId: json.playbackId,
      expiresInSeconds: json.expiresInSeconds,
    };
  } catch (err: any) {
    if (err instanceof HttpsError) throw err;
    console.error("Failed to fetch Curriq playback:", err);
    throw new HttpsError("internal", "Failed to retrieve signed video playback.");
  }
});

