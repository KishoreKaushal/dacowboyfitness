import * as admin from "firebase-admin";
import { setGlobalOptions } from "firebase-functions/v2";

admin.initializeApp();

// Set default region to match Firestore database location (asia-south2)
setGlobalOptions({
  region: "asia-south2",
  maxInstances: 10,
});

export { getCourseAccess } from "./courseAccess";
export { redeemCoupon } from "./coupons";

