import { auth } from "../../firebaseConfig";
import React from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import googleLogo from '../../images/google_logo.png';
import {useTranslation} from "react-i18next";


// Sign in function, uses Firebase Auth, is only visible when not signed in
function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(r => {
        }).catch((error) => {
            console.error(error)
        });
    }

    const { t } = useTranslation();

    return (
        <div className="mt-8 flex justify-center text-lg text-black">
            <button onClick={signInWithGoogle}
                className="flex items-center rounded-3xl bg-orange-500 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600">
                <span>{t("sign_in_with")}</span>
                <img src={googleLogo} alt="google_logo" className="max-w-[25px] ml-2"/>
            </button>
        </div>
    )
}

export default SignIn;