import { auth } from "../../firebaseConfig";
import React from "react";


// Sign out function, uses Firebase auth
function SignOut() {
    return auth.currentUser && (

        <div className="">
            <button onClick={() => auth.signOut()} class="rounded-3xl bg-orange-500 bg-opacity-50 px-4 py-1.5 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600">Sign out</button>
        </div>
    )
}

export default SignOut;