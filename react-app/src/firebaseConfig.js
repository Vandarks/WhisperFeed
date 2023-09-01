import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// API keysand other important config to be used in Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDBLZ412ew3JT2n9c6wxJDMfrvovW37jl8",
    authDomain: "whisperfeed-fall-2023.firebaseapp.com",
    projectId: "whisperfeed-fall-2023",
    storageBucket: "whisperfeed-fall-2023.appspot.com",
    messagingSenderId: "522578546401",
    appId: "1:522578546401:web:ec7240f27db9cd4462f1a0",
    measurementId: "G-W1ZLWHEG06"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore };