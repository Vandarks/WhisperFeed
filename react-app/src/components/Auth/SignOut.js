import {auth} from "../../firebaseConfig";
import React from "react";


// Sign out function, uses Firebase auth
function SignOut() {
    return auth.currentUser && (

        <button onClick={() => auth.signOut()}>Sign out</button>
    )
}

export default SignOut;