import React, { useState } from "react";
import { firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import firebase from "firebase/compat/app";

function FeedbackInput(props) {

    const course = props.course;
    const courseCreator = props.creator;

    // Reference to the feedback collection
    const reviewRef = firestore.collection("feedback");

    const [formValue, setFormValue] = useState("");

    // Function used to send feedback to the course
    // TODO: Make frontend notification to sender when succesfully sent feedback
    const sendFeedback = async (e) => {
        e.preventDefault();

        await reviewRef.add({
            courseName: course,
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
            <div className="w-full flex flex-col items-center">
                <button className="w-2/4 rounded-2xl bg-green-500 bg-opacity-50 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-green-500">Good</button>
                <button className="w-2/4 rounded-2xl bg-yellow-500 mb-2 mt-2 bg-opacity-95 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-300">OK</button>
                <button className="w-2/4 rounded-2xl bg-red-600 bg-opacity-50 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-red-500">Bad</button>
            </div>
                <div>
                    <form onSubmit={sendFeedback}>
                        <input value={formValue} placeholder="This course was..." onChange={(e) => setFormValue(e.target.value)}/>
                        <button type = "submit">Send Feedback</button>
                    </form>
                </div>
        </div>
    )
}

export default FeedbackInput;