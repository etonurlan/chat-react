import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const API_KEY = import.meta.env.VITE_API_KEY

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "react-chat-dd2a5.firebaseapp.com",
  projectId: "react-chat-dd2a5",
  storageBucket: "react-chat-dd2a5.appspot.com",
  messagingSenderId: "289271816197",
  appId: "1:289271816197:web:0b02041fff5f8208ce7c6c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)