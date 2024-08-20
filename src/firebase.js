// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider } from "firebase/auth"; //for authorisation
import {getFirestore, doc, setDoc} from "firebase/firestore"; //for database


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTdOUv4P81BmiNGw5DxlEqZLExUi3Zua0",
  authDomain: "financium-d35d2.firebaseapp.com",
  projectId: "financium-d35d2",
  storageBucket: "financium-d35d2.appspot.com",
  messagingSenderId: "918093211789",
  appId: "1:918093211789:web:8a9ad2a1a055833d7f1ac4",
  measurementId: "G-N6EPBHYEXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db,auth, provider, doc, setDoc};