import React, {useState, useEffect} from "react";
import { auth, firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import {useCollectionData} from "react-firebase-hooks/firestore";

function ChatMessage(props) {
    const {text, uid, photoURL, displayName } = props.message;
    const courseName = text;
    const courseCreator = props.message.uid;
    const messagesRef = firestore.collection("messages");
    const messagesQuery = messagesRef.orderBy("createdAt").limit(25);
    const feedbackRef = firestore.collection("feedback")
        .where("courseName", "==", courseName)
        .where("uid", "==", courseCreator);
    const feedbackQuery = feedbackRef.orderBy("createdAt").limit(25);
    const [feedbacks] = useCollectionData(feedbackQuery, {idField: "id"});
    const [feedbackId, setFeedbackId] = useState("");
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState([]);


    // Remove course from database
    const handleButtonClick = () => {

        console.log("course: ", courseName, " uid: ", courseCreator)

        firestore.collection("messages")
        .where("text", "==", courseName)
        .get()
        .then(querySnapshot => {
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

        /* old method for singular feedback
        * 
        * feedbackRef.get().then((querySnapshot) => {
        *     if(!querySnapshot.empty){
        *         const feedbackData = querySnapshot.docs[0].data();
        *         setFeedback(feedbackData);
        *         setShowFeedback(true);
        *     } else {
        *         setFeedback("");
        *     }
        * })
        */
        console.log(feedback.text);
    }

    const sendFeedback = async (e) => {
        e.preventDefault();
        //Todo: tee insert feedback functio ks feedbackMain createCourse Funktio.
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
                        <input/><button type = "submit">Send Feedback</button>

                    </form>
                </div>
            )}
        </div>
    )
}

export default ChatMessage;