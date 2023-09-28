import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../firebaseConfig";
import wfLogo from "../../images/WhisperFeed_Logo.png";
import CoursesMain from "../Courses/CoursesMain";
import SignIn from "../Auth/SignIn";
import React from "react";

function LandingPage() {
    const [user] = useAuthState(auth);

    return (
        <div>
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-900">
                <div className="my-10 rounded-xl bg-gray-800 px-10 py-3 shadow-lg backdrop-blur-md max-sm:px-8">
                    <div className="mb-8 flex flex-col items-center text-white">
                        {user ? null : <img src={wfLogo} alt="logo" className="w-1/3"/>}
                        <p>{user ? null : <p className="text-lg">Please log in!</p>}</p>
                        <section className="py-8">
                            {/* Only open CoursesMain if user is signed in and has a valid uid, else sign in */}
                            {user ? <CoursesMain className="grid-cols-4 gap-4"/>  : <SignIn/>}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage