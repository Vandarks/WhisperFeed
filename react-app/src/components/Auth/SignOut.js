import {auth} from "../../firebaseConfig";
import React from "react";


// Sign out function, uses Firebase auth
function SignOut() {
    return auth.currentUser && (

        <div className="mt-8 flex justify-center text-lg text-black">
            <button onClick={() => auth.signOut()} class="rounded-3xl bg-orange-500 bg-opacity-50 px-10 py-2 text-white shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-600">Sign out</button>
        </div>
    )
}

export default SignOut;