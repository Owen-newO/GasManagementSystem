import {onCall, HttpsError} from "firebase-functions/v2/https";
import {logger} from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {FieldValue} from "firebase-admin/firestore";
import {
  registerResidentSchema,
  type RegisterResidentInput,
} from "../utils/validators";

export const registerResident = onCall(
  {region: "asia-southeast1"},
  async (request) => {
    if (request.data == null || typeof request.data !== "object") {
      throw new HttpsError("invalid-argument", "Missing request data.");
    }

    const parsed = registerResidentSchema.safeParse(request.data);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const msg = issue?.message ?? "Invalid request data.";
      throw new HttpsError("invalid-argument", msg);
    }
    const data: RegisterResidentInput = parsed.data;

    // ── Create Firebase Auth user ───────────────────────────────────────────
    let uid: string;
    try {
      const userRecord = await admin.auth().createUser({
        email: data.email.toLowerCase(),
        password: data.password,
        displayName: `${data.firstName} ${data.lastName}`,
      });
      uid = userRecord.uid;
    } catch (err: unknown) {
      const firebaseError = err as {code?: string; message?: string};
      if (firebaseError.code === "auth/email-already-exists") {
        throw new HttpsError("already-exists", "An account with this email already exists.");
      }
      if (firebaseError.code === "auth/invalid-email") {
        throw new HttpsError("invalid-argument", "Invalid email address.");
      }
      if (firebaseError.code === "auth/weak-password") {
        throw new HttpsError("invalid-argument", "Password is too weak.");
      }
      logger.error("registerResident: createUser failed", {
        code: firebaseError.code,
        message: firebaseError.message ?? (err instanceof Error ? err.message : String(err)),
      });
      throw new HttpsError("internal", "Failed to create account. Please try again.");
    }

    // ── Write resident profile to Firestore ────────────────────────────────
    try {
      await admin.firestore().collection("residents").doc(uid).set({
        vehicleType: data.vehicleType,
        plateNo: data.plateNo.toUpperCase(),
        fuelType: data.fuelType,
        firstName: data.firstName,
        lastName: data.lastName,
        barangay: data.barangay,
        email: data.email.toLowerCase(),
        role: "resident",
        registeredAt: FieldValue.serverTimestamp(),
      });
    } catch (err: unknown) {
      const fsErr = err as {code?: string | number; message?: string};
      const host = process.env.FIRESTORE_EMULATOR_HOST;
      logger.error(
        "registerResident: Firestore set failed — " +
          (fsErr.message ?? (err instanceof Error ? err.message : String(err))),
        {
          errorCode: fsErr.code,
          firestoreEmulatorHost: host ?? "(unset — using production Firestore)",
        }
      );
      // Auth user was created but Firestore write failed — clean up to avoid orphaned auth accounts
      await admin.auth().deleteUser(uid).catch(() => undefined);
      throw new HttpsError("internal", "Failed to save registration. Please try again.");
    }

    return {uid};
  }
);
