import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCwvC1MlB-_7cmV-Hmi8MyXthGrFUGbwkY",
  authDomain: "fscomerce.firebaseapp.com",
  databaseURL: "https://fscomerce-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fscomerce",
  storageBucket: "fscomerce.firebasestorage.app",
  messagingSenderId: "977420297543",
  appId: "1:977420297543:web:b005a014795112c24a9862",
  measurementId: "G-QHW4J71NNN"
};

// Initialize Firebase securely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
