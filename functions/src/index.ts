import * as admin from "firebase-admin";

admin.initializeApp();

export { getCourseAccess } from "./courseAccess";
export { redeemCoupon } from "./coupons";
