import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { firebaseConfig } from "src/firebase/config";

const apps = getApps();
if (!apps.length) {
  const app = initializeApp(firebaseConfig);
} else {
  const app = apps[0];
}

export const auth = getAuth();
export const db = getFirestore();
export const FirebaseTimestamp = Timestamp.now();
