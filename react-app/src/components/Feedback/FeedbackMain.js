import {useCollectionData} from "react-firebase-hooks/firestore";
import React from "react";
import { firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import ChatMessage from '../Chat/ChatMessage';

// Main feedback component of the app
// TODO: Put two different views, one for teachers and one for students
// Students should be able to comment or give a rating to the course created by the teacher.
// The creator of the course should see the feedback on the course, maybe as a 0-5 star system?
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

export default FeedbackMain;