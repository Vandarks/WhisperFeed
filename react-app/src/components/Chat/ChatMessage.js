import React from "react";
import { auth, firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import { doc, deleteDoc } from "firebase/firestore";

function ChatMessage(props) {
    const {text, uid, photoURL, displayName, generatedDocId} = props.message;

    const docId = props.id;

    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

    const removeCourse = async(e) => {
        console.log(generatedDocId);
        console.log(docId);
        const docRef = doc(firestore, "messages", docId);
        deleteDoc(docRef);
        
    }
 

    return (
        <div>
            <img src={photoURL} alt="Creator"/>
            <p>{text}, Created by: {displayName}</p>
            { messageClass ==="sent" && (
                <button onClick={removeCourse}>Remove course</button>
            )}
        </div>
    )
}

export default ChatMessage;