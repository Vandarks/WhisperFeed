import { auth } from "../../firebaseConfig";
import React from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


// Sign in function, uses Firebase Auth, is only visible when not signed in
function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <div class="mt-8 flex justify-center text-lg text-black">
            <button onClick={signInWithGoogle} class="rounded-3xl bg-orange-500 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600">Sign in with your account</button>
        </div>

    )
}

export default SignIn;