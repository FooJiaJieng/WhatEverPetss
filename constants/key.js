// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAnTb9a4nlYmzSEZzmqqOJ3rlTCvY_raV4",
    authDomain: "whateverpetss-f24d2.firebaseapp.com",
    projectId: "whateverpetss-f24d2",
    storageBucket: "whateverpetss-f24d2.appspot.com",
    messagingSenderId: "40032737479",
    appId: "1:40032737479:web:3a730ac6a71b663e04c6e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const db = getFirestore(app);