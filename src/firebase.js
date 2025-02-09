// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDN6sNz8uBItJ0VGG9aCG_lJOTaNikMizo",
  authDomain: "budget-wise-01.firebaseapp.com",
  projectId: "budget-wise-01",
  storageBucket: "budget-wise-01.firebasestorage.app",
  messagingSenderId: "303019261022",
  appId: "1:303019261022:web:05fb9aa6b410a557a548cf",
  measurementId: "G-0S5NS4E9KP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
