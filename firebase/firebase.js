// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoVlDKVUBscSgr663i6xXmRQxh5p1R0XE",
  authDomain: "angular-pawm-app.firebaseapp.com",
  databaseURL: "https://angular-pawm-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "angular-pawm-app",
  storageBucket: "angular-pawm-app.appspot.com",
  messagingSenderId: "218403187826",
  appId: "1:218403187826:web:a5a0cf3f64201c2ae666eb",
  measurementId: "G-5SXSF76WCV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth= getAuth(app)
export const storage= getStorage(app);
export const db = getFirestore(app);
