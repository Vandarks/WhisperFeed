import React, { useState } from "react";
import { auth, firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import firebase from "firebase/compat/app";

function ChatMessage(props) {
    const {text, uid, photoURL, displayName } = props.message;
    const courseName = text;
    const courseCreator = props.message.uid;

    // Reference to the feedback collection
    const reviewRef = firestore.collection("feedback");

    const [formValue, setFormValue] = useState("");

    // For checking out reviews on certain courses
    const feedbackRef = reviewRef
        .where("courseName", "==", courseName)
        .where("uid", "==", courseCreator);
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    const [feedback, setFeedback] = useState([]);

    // Remove course and feedback from database
    const handleButtonClick = () => {

        console.log("course: ", courseName, " uid: ", courseCreator)

        firestore.collection("messages")
        .where("text", "==", courseName)
        .get()
        .then(querySnapshot => {
            querySnapshot.docs[0].ref.delete();
        });

        feedbackRef
        .get()
        .then(querySnapshot => {
            console.log(querySnapshot.docs)
            for(let i = 0; i < querySnapshot.docs.length; i++) {
                querySnapshot.docs[i].ref.delete();
            }
        });
    }

    // View course feedback from database
    const viewFeedback = async () => {
        const courseName = props.message.text;
        const courseCreator = props.message.uid;
        console.log("course: ", courseName, " uid: ", courseCreator)

        // fetches the feedback for the course and puts into feedback hook
        feedbackRef.get().then((querySnapshot) => {
            const reviewData = [];
            querySnapshot.forEach((doc) => {
                reviewData.push(doc.data());
            });
            setFeedback(reviewData);
        });

        console.log(feedback.text);
    }

    // Function used to send feedback to the course
    // TODO: Make frontend notification to sender when succesfully sent feedback
    const sendFeedback = async (e) => {
        e.preventDefault();

        await reviewRef.add({
            courseName: courseName,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            text: formValue,
            uid: courseCreator
        })
        .then((docRef) => {
            console.log("Feedback Document ID: ", docRef.id);
        })
        .catch((e) => {
            console.error("Error adding document: ", e);
        });

        setFormValue("");        
    }

    return (
        <div className="flex grid grid-cols-2 place-content-stretch border">
            <img src={photoURL} alt="Creator" className="rounded-lg"/>
            <div className="w-full flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2">{text}</h2>
                <p className="mb-2">{displayName}</p>
                <button className="w-2/4 rounded-2xl bg-green-500 bg-opacity-50 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-green-500">Good</button>
                <button className="w-2/4 rounded-2xl bg-yellow-500 mb-2 mt-2 bg-opacity-95 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-300">OK</button>
                <button className="w-2/4 rounded-2xl bg-red-600 bg-opacity-50 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-red-500">Bad</button>
            </div>

            {/* Only show this if user is the owner of the course */}
            { messageClass ==="sent" && (
                <div className="w-full">
                    <button onClick={viewFeedback}> view Feedback </button>
                    {feedback.length > 0 ? (
                        <ul>
                        {feedback.map((review, index) => (
                            <li key={index}>
                            <p>{review.text}</p>
                            </li>
                        ))}
                        </ul>
                    ) : <div className="noFeedback"/>}
                    <button onClick={handleButtonClick}>Remove course</button>
                </div>
            )}
            {/* Only show the next part if not the owner */}
            {messageClass ==="received" && (
                <div>
                    <form onSubmit={sendFeedback}>
                        <input value={formValue} placeholder="This course was..." onChange={(e) => setFormValue(e.target.value)}/>
                        <button type = "submit">Send Feedback</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default ChatMessage;