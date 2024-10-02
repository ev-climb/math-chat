import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtXFCEZOOtstwfsI3IHD7xYRXTxOImOIQ",
  authDomain: "math-chat-72acd.firebaseapp.com",
  projectId: "math-chat-72acd",
  storageBucket: "math-chat-72acd.appspot.com",
  messagingSenderId: "106503209786",
  appId: "1:106503209786:web:1e832151a25304fee88603",
  measurementId: "G-28HSNNDQQ9"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, firebaseApp, db };