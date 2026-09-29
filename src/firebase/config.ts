import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

/**
 * Firebase configuration provided for the application
 */
export const firebaseConfig = {
  apiKey: "AIzaSyDEymZ27LipKyvY5iJV34Qzym35hMU8AZg",
  authDomain: "air-quality-monitor-24a3b.firebaseapp.com",
  projectId: "air-quality-monitor-24a3b",
  storageBucket: "air-quality-monitor-24a3b.firebasestorage.app",
  messagingSenderId: "352492056028",
  appId: "1:352492056028:web:27891f6d3626a2c649f319",
  measurementId: "G-L7NNYY9XQK"
};

// Initialize Firebase (singleton pattern)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Analytics safely (only supported in browser environments)
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics could not be initialized:", err);
    });
}
