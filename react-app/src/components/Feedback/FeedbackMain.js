import {useCollectionData} from "react-firebase-hooks/firestore";
import React from "react";
import { firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import ChatMessage from '../Chat/ChatMessage';

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