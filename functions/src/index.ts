import {setGlobalOptions} from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

if (process.env.FUNCTIONS_EMULATOR === "true") {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    console.warn(
      "[functions] FIRESTORE_EMULATOR_HOST is unset — Admin SDK will call production Firestore " +
        "(writes usually fail without GCP credentials). Start Firestore with Functions: " +
        "firebase emulators:start --only functions,auth,firestore"
    );
  }
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    console.warn(
      "[functions] FIREBASE_AUTH_EMULATOR_HOST is unset — Admin Auth may target production."
    );
  }
}

// Cost control: limit concurrent containers per function
// Override per-function by passing maxInstances in the function options
setGlobalOptions({maxInstances: 10});

export {registerResident} from "./auth/registerResident";
