import LoginSignup from './login.js';
import React from "react";
import './App.css';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth"
import { useCollectionData } from "react-firebase-hooks/firestore";


// API keysand other important config to be used in Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDBLZ412ew3JT2n9c6wxJDMfrvovW37jl8",
  authDomain: "whisperfeed-fall-2023.firebaseapp.com",
  projectId: "whisperfeed-fall-2023",
  storageBucket: "whisperfeed-fall-2023.appspot.com",
  messagingSenderId: "522578546401",
  appId: "1:522578546401:web:ec7240f27db9cd4462f1a0",
  measurementId: "G-W1ZLWHEG06"
});


const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
    <header>
      <h1>WhisperFeed</h1>
      <SignOut/>
    </header>
      <section>
        {user ? <FeedbackMain/>  : <SignIn/>}
      </section>
      {/* <LoginSignup /> */}
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with your account</button>
  )
}

function SignOut() {
  return auth.currentUser && (

    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}

function FeedbackMain() {
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, {idField: "id"});

  return (
    <>
      <div>
        <div>
          {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        </div>
      </div>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid} = props.message;

  return <p>{text}</p>
}

export default App;