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
    
    


    // Remove course from database
    // NOTE: course feedback does not disappear from the feedback collection when deleting a course
    // TODO: when course is removed, 
    // look for all feedbacks with the corresponding courseName and courseId
    // and delete them from the feedback collection
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
            querySnapshot.docs[0].ref.delete();
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
        <div>
            <img src={photoURL} alt="Creator"/>
            <p>{text}, Created by: {displayName}</p>
            { messageClass ==="sent" && (
                <div>
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
            {messageClass ==="received" && (
                <div>
                    <form onSubmit={sendFeedback}>
                        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
                        <button type = "submit">Send Feedback</button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default ChatMessage;