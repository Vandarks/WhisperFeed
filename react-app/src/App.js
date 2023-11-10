import React, {useEffect} from "react";
import './App.css';
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./firebaseConfig"; // Import Firebase config
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HeaderProfile from "./components/Layout/HeaderProfile";
import LandingPage from "./components/Pages/LandingPage";
import Course from "./components/Chat/Course";
import Contact from "./components/Pages/Contact";
import {useTranslation} from "react-i18next";

function App() {

  const [user] = useAuthState(auth);
  const { i18n } = useTranslation();

  useEffect(() => {
      document.dir = i18n.dir();
  }, [i18n, i18n.language]);

  return (
      <Router>
        <div>
          {user ? <HeaderProfile /> : null}
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route exact path="/home" element={<Course />} />
            <Route exact path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;