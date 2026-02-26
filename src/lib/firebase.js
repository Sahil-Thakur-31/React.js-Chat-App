import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat31.firebaseapp.com",
  projectId: "reactchat31",
  storageBucket: "reactchat31.firebasestorage.app",
  messagingSenderId: "707958541886",
  appId: "1:707958541886:web:2d275a42bd8af1dc614b6f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore();
export const storage = getStorage();