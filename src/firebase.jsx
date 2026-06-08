import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2zSSQwR7CthY85Mw02vRmcIPkC1fr7a4",
  authDomain: "authentication-773e7.firebaseapp.com",
  projectId: "authentication-773e7",
  storageBucket: "authentication-773e7.firebasestorage.app",
  messagingSenderId: "204125574788",
  appId: "1:204125574788:web:7bcbfd2e992f17a0bcd4d1",
  measurementId: "G-KZL0ZK1LXR"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);