import { auth } from "../../firebaseConfig";
import React from "react";
import {useTranslation} from "react-i18next";


// Sign out function, uses Firebase auth
function SignOut() {

    const { t } = useTranslation();

    return auth.currentUser && (

        <div className="">
            <button
                data-testid="sign_out_button"
                onClick={() => auth.signOut()}
                className="rounded-3xl bg-orange-500 bg-opacity-50 px-4 py-1.5 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600">{t("button_signout")}</button>
        </div>
    )
}

export default SignOut;