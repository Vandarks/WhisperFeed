import React from "react";
import './App.css';
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./firebaseConfig"; // Import Firebase config
import wfLogo from './images/WhisperFeed_Logo.png';


import SignIn from './components/Auth/SignIn';
import SignOut from './components/Auth/SignOut';
import CoursesMain from "./components/Courses/CoursesMain";


function App() {

  const [user] = useAuthState(auth);

  return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat">
          <div className="border my-10 rounded-xl bg-gray-800 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-md max-sm:px-8">
              <div className="text-white border">
                  <div className="mb-8 flex flex-col items-center">
                      <img src={wfLogo} alt="logo" className="w-1/3"/>
                      <header>
                          <p>{user ? <p>Welcome {user.displayName}!</p> : <p className="text-lg">Please log in!</p>}</p>
                          <SignOut/>
                      </header>
                      <section className="py-8">
                          {/* Only open FeedbackMain if user is signed in and has a valid uid, else sign in */}
                          {user ? <CoursesMain className="grid-cols-4 gap-4"/>  : <SignIn/>}
                      </section>
                  </div>
              </div>
        </div>
    </div>
  );
}

export default App;