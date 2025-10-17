import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyBSdHUZkB74lQMHzwvVAxQ_Q-tWXVcvhqE",
  authDomain: "tgv2-44100.firebaseapp.com",
  projectId: "tgv2-44100",
  storageBucket: "tgv2-44100.firebasestorage.app",
  messagingSenderId: "181322725847",
  appId: "1:181322725847:web:d340a9d5f684fec467b392",
  measurementId: "G-T7F5R5XD37"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app, "gs://tgv2-44100.firebasestorage.app");
export const analytics = getAnalytics(app);