# DaCowboy Fitness — Course Access & Curriq Integration Implementation Plan

## 1. Goal

Refactor DaCowboy Fitness so that **DaCowboy owns identity, payment, and course access**, while **Curriq owns course/content delivery and video playback authorization**.

Target architecture:

```text
User
 │
 ▼
DaCowboy Fitness
 ├── Firebase Auth
 ├── Razorpay / payment
 └── Firestore entitlement
          │
          │ authorized request
          ▼
      Curriq API
 ├── Course structure
 ├── Lessons / video assets
 └── Signs short-lived Mux playback tokens
          │
          ▼
        Mux
          │
          ▼
      Vidstack Player
```

This follows the Curriq integration document's **Model B (Backend Read Key)**: the browser never receives Curriq credentials; the DaCowboy backend verifies entitlement first, then queries Curriq. fileciteturn2file0L17-L50

---

# 2. Existing Journal System — Preserve, Don't Refactor

The journal pipeline already works on `main`:

```text
journals/*.md
    ↓
build_journals.py
    ↓
public/content/journals/*.json
    ↓
Firebase Hosting
```

No journal architecture changes are part of this implementation.

Acceptance criteria:

- [ ] Existing journal generation remains unchanged.
- [ ] Existing CI validation continues to pass.
- [ ] Existing public journal behavior remains unchanged.

---

# 3. DaCowboy Course Access Boundary

DaCowboy remains responsible for answering:

> **"Is this authenticated user entitled to access this course?"**

Create/retain:

```text
users/{uid}/courseEntitlements/{courseId}
```

Entitlements are written only by trusted backend code.

The browser must never grant itself access through:

```text
course.isOwned
localStorage
sessionStorage
unlockCourse()
client-side timers
```

Remove the current client-side unlock behavior from:

```text
src/components/ui/UnlockSheet.vue
src/composables/useCourseAccess.ts
```

---

# 4. Coupon / Payment Access

Implement coupon redemption through a trusted backend function.

Conceptually:

```text
User
 ↓
UnlockSheet
 ↓
redeemCoupon()
 ↓
Cloud Function
 ↓
validate coupon + user + course
 ↓
Firestore transaction
 ├── create entitlement
 ├── create redemption record
 └── increment redemption count
```

Use:

```text
users/{uid}/couponRedemptions/{couponCode}
```

to make redemption idempotent per user.

Coupon rules:

```text
maxRedemptions > 0 → limited
maxRedemptions = 0 → unlimited
```

The same user must not consume multiple redemptions of the same coupon.

---

# 5. Curriq Is the Future Content Source

**Do not make Firestore `courseContent` the permanent video/content architecture.**

Curriq will eventually own:

- course structure;
- modules;
- lessons;
- video assets;
- Mux integration;
- signed playback tokens.

DaCowboy should only retain the information it needs for its own application and access-control responsibilities.

The future authorized flow is:

```text
Vue Client
   │ Firebase ID Token
   ▼
DaCowboy Backend / Cloud Function
   │
   ├── verify Firebase token
   ├── verify Firestore entitlement
   │
   ▼
Curriq API
   │ Curriq Read Key
   ├── getCourseOutline(courseId)
   └── getVideoPlayback(assetId)
          │
          ▼
      signed Mux URL
          │
          ▼
       Browser
          │
          ▼
    Vidstack Player
```

Curriq's documented Model B specifically uses this backend-mediated flow and returns short-lived signed Mux playback URLs to the frontend. fileciteturn2file0L29-L50

---

# 6. Interim Course Data

Until Curriq is integrated, the DaCowboy frontend may continue to use its existing public course metadata.

However, structure the code so that protected video/content retrieval is behind an abstraction such as:

```ts
getCourseAccess(courseId)
```

The implementation should make it easy to replace:

```text
DaCowboy Firestore protected content
```

with:

```text
Curriq → Mux signed playback
```

without rewriting the course UI.

---

# 7. Frontend Refactor

## `CoursePlayerView.vue`

Separate:

```text
Public course metadata
```

from:

```text
Authorized playback data
```

The locked page may display:

- title;
- description;
- outcomes;
- lesson titles;
- lesson durations.

It must not expose protected playback URLs.

After authorization, the player receives the authorized playback information.

## `UnlockSheet.vue`

Remove:

```ts
setTimeout(...)
unlockCourse(...)
```

The component should instead trigger the supported backend access flow.

Do not claim Razorpay payment has occurred until the real payment integration exists.

## `useCourseAccess.ts`

Convert from a client-side ownership mechanism into an access/request abstraction.

## `useCoupons.ts`

Add a dedicated composable for coupon redemption.

---

# 8. Future Video Player Boundary

Introduce a player abstraction so the current player can eventually be replaced by:

```text
VidstackPlayer
```

with Mux signed HLS URLs supplied by Curriq.

Curriq's integration plan specifies Vidstack for Vue 3 and Mux signed HLS playback. fileciteturn2file0L370-L418

The DaCowboy application should not need to know:

- Curriq API credentials;
- Mux signing keys;
- Mux API credentials.

Only the backend/Curriq infrastructure handles those secrets.

---

# 9. Cloud Functions

Create an independent Functions project:

```text
functions/
├── package.json
├── package-lock.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── courseAccess.ts
    └── coupons.ts
```

Keep the Functions TypeScript project separate from the Vue TypeScript project.

Implement initially:

```text
redeemCoupon()
getCourseAccess()
```

`getCourseAccess()` should be designed as the future integration boundary:

```text
Current:
    entitlement → current course data

Future:
    entitlement → Curriq → signed Mux playback
```

---

# 10. Firestore Security

Client access must not allow writes to:

```text
courseEntitlements
coupon definitions
coupon redemptions
```

Protected course/content collections, if used during the interim phase, must also be backend-only.

The client must never be able to manufacture an entitlement.

---

# 11. Deployment

Preserve the existing deployment architecture:

```text
PR
 ↓
Preview

merge to main
 ↓
Staging LIVE
 ↓
successful staging deployment

manual production promotion
 ↓
exact SHA validation
 ↓
exact SHA checkout
 ↓
production deployment
```

Extend staging and production builds to include Cloud Functions.

Each environment must deploy to its corresponding Firebase project.

Do not allow production to deploy a different SHA from the one validated in staging.

---

# 12. Future Curriq Infrastructure

Curriq is an independent system and should remain independently deployable.

The Curriq plan supports:

```text
Curriq VPS
 ├── Caddy
 ├── Curriq API
 ├── Next.js dashboard/docs
 └── PostgreSQL
```

with Mux webhooks reaching Curriq over a public HTTPS endpoint. fileciteturn2file0L66-L80

For local development, Curriq can also be exposed through Cloudflare Tunnel/ngrok for Mux webhook testing. fileciteturn2file0L142-L170

These infrastructure changes are **not required for the current DaCowboy access refactor** unless Curriq integration is being implemented in the same phase.

---

# 13. Files to Modify

```text
src/composables/useCourseAccess.ts
src/composables/useCheckout.ts
src/composables/useCoupons.ts
src/views/CoursePlayerView.vue
src/components/ui/UnlockSheet.vue
src/lib/firebase.ts
firestore.rules
firebase.json
.github/workflows/firebase-hosting-merge.yml
.github/workflows/deploy-production.yml
```

# 14. Files to Add

```text
functions/package.json
functions/package-lock.json
functions/tsconfig.json
functions/src/index.ts
functions/src/courseAccess.ts
functions/src/coupons.ts
```

---

# 15. Implementation Order

1. Remove client-side course ownership/unlock behavior.
2. Establish Firestore entitlement as the DaCowboy access source of truth.
3. Implement transactional/idempotent coupon redemption.
4. Add Cloud Functions.
5. Refactor `CoursePlayerView` around an access abstraction.
6. Refactor `UnlockSheet.vue`.
7. Keep public course metadata separate from protected playback data.
8. Update staging and exact-SHA production workflows.
9. Verify unauthorized users cannot obtain protected data.
10. Keep the content-delivery interface ready for the future Curriq integration.

---

# 16. Definition of Done

### DaCowboy Access

- [ ] Browser cannot grant course ownership.
- [ ] Entitlements are backend-controlled.
- [ ] Coupon redemption is transactional.
- [ ] Duplicate coupon redemption cannot consume additional quota.
- [ ] Public course metadata contains no protected playback URLs.

### Curriq Boundary

- [ ] DaCowboy owns identity/payment/entitlement.
- [ ] Curriq owns future course/content/video delivery.
- [ ] Curriq credentials never reach the browser.
- [ ] `getCourseAccess()` can transition from local/interim content to Curriq-backed playback without redesigning the UI.
- [ ] Mux signing remains outside the browser.

### Deployment

- [ ] Functions build in staging.
- [ ] Functions build from the exact production SHA.
- [ ] Staging and production remain environment-separated.
- [ ] Existing journal pipeline remains unchanged.
