import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../firebaseConfig";
import wfLogo from "../../images/WhisperFeed_Logo.png";
import CoursesMain from "../Courses/CoursesMain";
import SignIn from "../Auth/SignIn";
import React, {useState} from "react";
import SignInForm from "../Auth/SignInForm";
import SignUpForm from "../Auth/SignUpForm";

function LandingPage() {
    const [user] = useAuthState(auth);
    const [showSignUp, setShowSignUp] = useState(false);
    const marginTopClass = user ? 'mt-12' : '';

    const toggleSignUp = () => {
        setShowSignUp(!showSignUp);
    };

    return (
        <div className={marginTopClass}>
            <div className="flex min-h-screen w-full items-center justify-center bg-gray-900">
                <div className="my-10 rounded-xl bg-gray-800 px-10 py-3 shadow-lg backdrop-blur-md max-sm:px-8">
                    <div className="flex flex-col items-center text-white">
                        {user ? null : <img src={wfLogo} alt="logo" className="w-1/3"/>}
                        {user ? null : showSignUp ? (
                            <SignUpForm onSignInClick={toggleSignUp} /> // Render SignUpForm if showSignUp is true
                        ) : (
                            <SignInForm onSignUpClick={toggleSignUp}/> // Render SignInForm if showSignUp is false
                        )}
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