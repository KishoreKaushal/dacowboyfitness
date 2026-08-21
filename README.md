# DaCowboy Fitness

DaCowboy Fitness web platform — built with Vue 3, TypeScript, Vite, TailwindCSS, and Firebase (Auth, Firestore, Cloud Functions).

---

## Architecture Overview

- **DaCowboy Fitness (Identity & Entitlement Authority)**:
  - **Firebase Auth**: User identity.
  - **Firestore**: User records and course entitlement/unlock states (`users/{uid}/courseEntitlements/{courseId}`).
  - **Cloud Functions**: Backend authorization boundary (`getCourseAccess`, `redeemCoupon`).
- **Curriq / Content Layer (Future)**:
  - Course structure, lessons, and media delivery.
  - Mux signed playback.

---

## Cloud Functions Development & Architecture

### How Cloud Functions Compile and Run Locally

Firebase Cloud Functions are written in **TypeScript** (`functions/src/`) and compiled to **JavaScript** (`functions/lib/`) before being executed by the Functions Emulator or production runtime.

```text
TypeScript Source Code (functions/src/*.ts)
                 │
                 ▼ (tsc / npm run build)
Compiled JavaScript (functions/lib/*.js)   <-- Ignored in Git (.gitignore)
                 │
                 ▼ (loaded via functions/package.json "main": "lib/index.js")
     Firebase Functions Emulator (Port 5001)
                 │
                 ▼ (reads & writes data via Admin SDK)
     Firebase Firestore Emulator (Port 8080)
                 │
                 ▼ (inspected in real-time)
     Emulator UI (http://localhost:4000/firestore)
```

### Why `functions/lib/` is in `.gitignore`
- **Source of truth is `functions/src/`**: Just like frontend `dist/` is not committed to Git, compiled `.js` files in `functions/lib/` are generated artifacts.
- **Automated CI/CD Builds**: During GitHub Actions deployment, `npm ci && npm run build` compiles fresh `.js` files in `functions/lib/` before running `firebase deploy`.

### Hot-Reloading Functions During Development
When actively modifying Cloud Functions in `functions/src/`, you can run TypeScript in watch mode so changes recompile automatically:
```bash
# In a separate terminal or tab:
cd functions && npm run build:watch
```
The Functions Emulator automatically detects changes in `functions/lib/` and reloads without needing a restart.

---

## Local Development

### 1. Prerequisites
- Node.js 18+
- Python 3.10+ (for journal pipeline)
- Firebase CLI (`npm install -g firebase-tools` or `npx firebase-tools`)
- Java JRE (required by Firebase Local Emulator Suite)

### 2. Install Dependencies
```bash
npm install
cd functions && npm install && cd ..
```

### 3. Running with Firebase Local Emulators

To run the entire stack locally (Auth, Firestore, and Cloud Functions):

#### Terminal 1 — Start Emulators:
```bash
npm run emulators
```
*Emulators UI is available at: [http://localhost:4000](http://localhost:4000)*
- **Auth Emulator**: `http://localhost:9099`
- **Firestore Emulator**: `localhost:8080`
- **Functions Emulator**: `localhost:5001`

#### Terminal 2 — Start Frontend (Connected to Emulators):
```bash
npm run dev:emulators
```
*App is available at: [http://localhost:5173](http://localhost:5173)*

---

## Testing Course Unlock & Coupons Locally

Coupons are stored in Firestore under the **`coupons`** collection and verified inside transactions in the `redeemCoupon` Cloud Function.

### Schema Definitions:
| Field Name | Type | Value | Description |
| :--- | :--- | :--- | :--- |
| `courseId` | `string` | `"1"` (or omit / `"all"`) | Course string ID. Omit or set to `"all"` to unlock any course. |
| `maxRedemptions` | `number` | `2` (integer) | Maximum global redemptions allowed. |
| `currentRedemptions` | `number` | `0` (integer) | Counter tracking total redemptions. |

### Step 1: Create a Test Coupon
1. Open the Emulator UI at [http://localhost:4000/firestore](http://localhost:4000/firestore).
2. Create a collection named **`coupons`**.
3. Create a document with ID: **`TEST2026`**.
4. Add the fields:
   - `courseId`: `"1"` (string, type: `string`)
   - `maxRedemptions`: `2` (integer, type: `number`)
   - `currentRedemptions`: `0` (integer, type: `number`)

### Step 2: Test Redemption Flows in Web App
1. Open `http://localhost:5173`.
2. Sign in with Google / Email in the local auth emulator.
3. Navigate to Course 1 and click **Unlock Course**.
4. Enter code `TEST2026` and click **Redeem Code**.

#### Expected Behavior:
- **Attempt 1**: ✅ Unlocks course successfully (`currentRedemptions` becomes `1`).
- **Attempt 1 (Duplicate by same user)**: ❌ Fails with *"You have already redeemed this coupon."*
- **Attempt 2 (Different user)**: ✅ Unlocks course successfully (`currentRedemptions` becomes `2`).
- **Attempt 3 (3rd user)**: ❌ Fails with *"This coupon has reached its redemption limit."*

---

### Step 3: Automated CLI Limits Verification
To run the automated verification script against the local emulator:
```bash
cd functions
npm run verify:coupon
```

---

## Build & Deployment Commands

```bash
# Build Journals from Markdown
npm run build:journals

# Build Frontend for Staging / Production
npm run build:staging
npm run build:prod

# Build Cloud Functions
cd functions && npm run build
```
