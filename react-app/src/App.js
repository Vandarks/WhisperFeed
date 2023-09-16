import React from "react";
import './App.css';
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./firebaseConfig"; // Import Firebase config

import HeaderProfile from "./components/Layout/HeaderProfile";
import LandingPage from "./components/Pages/LandingPage";

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="min-h-screen w-full items-center justify-center bg-gray-900 bg-cover bg-no-repeat">
        {user ? <HeaderProfile /> : null}
        {user ? <LandingPage/> : <LandingPage/>}
    </div>
  );
}

export default App;