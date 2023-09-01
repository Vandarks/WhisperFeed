import {auth} from "../../firebaseConfig";
import React from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

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