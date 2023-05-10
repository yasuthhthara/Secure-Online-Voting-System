// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyM51IsWb-jwgXtku0kC5AWCJFOWFMuKA",
  authDomain: "voting-system-74049.firebaseapp.com",
  projectId: "voting-system-74049",
  storageBucket: "voting-system-74049.appspot.com",
  messagingSenderId: "770468273560",
  appId: "1:770468273560:web:ca220f1265188a9efcdfed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app)