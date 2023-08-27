/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
