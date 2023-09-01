import React from "react";
import './App.css';
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollectionData } from "react-firebase-hooks/firestore";
import { auth } from "./firebaseConfig"; // Import Firebase config

import SignIn from './components/Auth/SignIn';
import SignOut from './components/Auth/SignOut';
import FeedbackMain from './components/Feedback/FeedbackMain';


function App() {

  const [user] = useAuthState(auth);

  return (
      <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
        <header className="bg-blue-500 text-white p-4">
          <h1 className="text-3xl font-bold underline">WhisperFeed</h1>
          <p className="text-lg">{user ? <p>Welcome {user.displayName}!</p> : <p className="text-lg">Please log in!</p>}</p>
          <SignOut/>
      </header>
      <section className="py-8">
        {/* Only open FeedbackMain if user is signed in and has a valid uid, else sign in */}
        {user ? <FeedbackMain/>  : <SignIn/>}
      </section>
    </div>
  );
}

export default App;