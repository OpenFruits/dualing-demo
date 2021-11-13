import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, Timestamp } from "firebase/firestore";
import { firebaseConfig } from "src/firebase/config";

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const FirebaseTimestamp = Timestamp.now();
export default firebaseApp;
