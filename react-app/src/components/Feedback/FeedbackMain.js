import {useCollectionData} from "react-firebase-hooks/firestore";
import React, { useState } from "react";
import { firestore, auth } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import ChatMessage from '../Chat/ChatMessage';
import firebase from 'firebase/compat/app';
import { setDoc } from "firebase/firestore";


// Main feedback component of the app
// TODO: Put two different views, one for teachers and one for students
// Students should be able to comment or give a rating to the course created by the teacher.
// The creator of the course should see the feedback on the course, maybe as a 0-5 star system?
function FeedbackMain() {
    const messagesRef = firestore.collection("messages");
    const query = messagesRef.orderBy("createdAt").limit(25);

    const [docId, setDocId] = useState("");

    const [messages] = useCollectionData(query, {idField: "id"});

    const [formValue, setFormValue] = useState("");

    const createCourse = async(e) => {
        e.preventDefault();

        const { uid, photoURL, displayName } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            displayName
        })
        .then((docRef) => {
            console.log("Document ID: ", docRef.id);
            setDocId(docRef.id);
        })
        .catch((e) => {
            console.error("Error adding document: ", e);
        });

        setFormValue("");
    }


    

    return (
        <>
                <div>
                    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} id={docId}/>)}
                </div>
                <form onSubmit={createCourse}>
                    <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
                    <button type="submit">Create course</button>
                </form>
        </>
    )
}

export default FeedbackMain;