import { useCollectionData } from "react-firebase-hooks/firestore";
import React, { useState } from "react";
import { firestore, auth } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import Course from '../Chat/Course';
import firebase from 'firebase/compat/app';

// Main feedback component of the app
// TODO: Put two different views, one for teachers and one for students
// Students should be able to comment or give a rating to the course created by the teacher.
// The creator of the course should see the feedback on the course, maybe as a 0-5 star system?
function CoursesMain() {

    const messagesRef = firestore.collection("messages");

    const query = messagesRef.orderBy("createdAt").limit(25);

    const [docId, setDocId] = useState("");

    const [messages] = useCollectionData(query, {idField: "id"});

    const [formValue, setFormValue] = useState("");


    // Create a course to the database and for others to see, updates asynchronously
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
            <form onSubmit={createCourse} className="mb-5">
                <input value={formValue} placeholder="Enter a name" onChange={(e) => setFormValue(e.target.value)}/>
                <button type="submit">Create course</button>
            </form>
                <div className="grid grid-rows-4 gap-4">
                    {messages && messages.map(msg => 
                    <Course key={msg.id} message={msg} id={docId} />
                    )}
                </div>
        </>
    )
}

export default CoursesMain;