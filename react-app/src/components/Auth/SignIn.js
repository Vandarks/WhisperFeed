import {auth} from "../../firebaseConfig";
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
        <button onClick={signInWithGoogle}>Sign in with your account</button>
    )
}

export default SignIn;