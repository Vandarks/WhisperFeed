import React, { useState } from "react";
import { firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import firebase from "firebase/compat/app";

function FeedbackInput(props) {

    const course = props.course;
    const courseCreator = props.creator;

    // Reference to the feedback collection
    const feedbackRef = firestore.collection("feedback");

    const [feedbackText, setFeedbackText] = useState("");

    const [feedbackRating, setFeedbackRating] = useState(null);

    // Function used to send feedback to the course
    // TODO: Make frontend notification to sender when succesfully sent feedback
    const sendFeedback = async (e) => {
        e.preventDefault();

        await feedbackRef.add({
            courseName: course,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            text: feedbackText,
            uid: courseCreator,
            rating: feedbackRating
        })
        .then((docRef) => {
            console.log("Feedback Document ID: ", docRef.id);
        })
        .catch((e) => {
            console.error("Error adding document: ", e);
        });

        setFeedbackText("");
    }
    // Handles feedback button onclick event to pass value to feedbackRating hook
    const handleRatingClick = (param) => {
        setFeedbackRating(param);
        console.log(feedbackRating);
    }


    return (
        <div className="flex grid grid-cols-2 place-content-stretch border">
            <div className="w-full flex flex-col items-center">
                <button onClick={() => handleRatingClick(2)} className="w-2/4 rounded-2xl bg-green-500 bg-opacity-50 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-green-500">Good</button>
                <button onClick={() => handleRatingClick(1)} className="w-2/4 rounded-2xl bg-yellow-500 mb-2 mt-2 bg-opacity-95 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-300">OK</button>
                <button onClick={() => handleRatingClick(0)} className="w-2/4 rounded-2xl bg-red-600 bg-opacity-50 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-red-500">Bad</button>
            </div>
                <div>
                    <form onSubmit={sendFeedback}>
                        <input value={feedbackText} placeholder="This course was..." onChange={(e) => setFeedbackText(e.target.value)}/>
                        <button type = "submit">Send Feedback</button>
                    </form>
                </div>
        </div>
    )
}


export default FeedbackInput;