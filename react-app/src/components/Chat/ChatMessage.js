import React from "react";
import { auth, firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file

function ChatMessage(props) {
    const {text, uid, photoURL, displayName } = props.message;


    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";


    // Remove course from database
    const handleButtonClick = () => {

        const courseName = props.message.text;
        const courseCreator = props.message.uid;

        console.log("course: ", courseName, " uid: ", courseCreator)

        firestore.collection("messages")
        .where("text", "==", courseName)
        .get()
        .then(querySnapshot => {
            querySnapshot.docs[0].ref.delete();
        });
    }

    // template for feedback that shows only for the creator, currently hardcoded
    const feedback = "olipa tyhäm kursi >:D";

    return (
        <div>
            <img src={photoURL} alt="Creator"/>
            <p>{text}, Created by: {displayName}</p>
            { messageClass ==="sent" && (
                <div>
                <p>Feedback: {feedback} </p>
                <button onClick={handleButtonClick}>Remove course</button>
                </div>
            )}
        </div>
    )
}

export default ChatMessage;