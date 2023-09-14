import React, { useState } from "react";
import { auth, firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import FeedbackInput from "./FeedbackInput";

function Course (props) {
    const { text, uid, photoURL, displayName } = props.message;
    const courseName = text;
    const courseCreator = props.message.uid;

    // Reference to the feedback collection
    const reviewRef = firestore.collection("feedback");

    // For checking out reviews on certain courses
    const feedbackRef = reviewRef
        .where("courseName", "==", courseName)
        .where("uid", "==", courseCreator);
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    const [feedback, setFeedback] = useState([]);

    // Remove course and feedback from database
    const handleRemoveCourseButton = () => {

        console.log("course: ", courseName, " uid: ", courseCreator)

        firestore.collection("courses")
            .where("text", "==", courseName)
            .get()
            .then(querySnapshot => {
                querySnapshot.docs[0].ref.delete();
            });

        feedbackRef
            .get()
            .then(querySnapshot => {
                console.log(querySnapshot.docs)
                for (let i = 0; i < querySnapshot.docs.length; i++) {
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

    return (
        <div className="flex grid grid-cols-2 place-content-stretch border">
            <img src={photoURL} alt="Creator" className="rounded-lg" />
            <div className="w-full flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2">{text}</h2>
                <p className="mb-2">{displayName}</p>
            </div>

            {/* Only show this if user is the owner of the course */}
            {messageClass === "sent" && (
                <div className="w-full">
                    <button onClick={viewFeedback}> view Feedback </button>
                    {feedback.length > 0 ? (
                        <ul>
                            {feedback.map((review, index) => (
                                <li key={index}>
                                    <p>{review.text}</p>
                                    <p>Feedback rating: {review.rating}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <div className="noFeedback" />}
                    <button onClick={handleRemoveCourseButton}>Remove course</button>
                </div>
            )}
            {/* Only show the next part if not the owner */}
            {messageClass === "received" && (
                <div>
                    <FeedbackInput course={courseName} creator={courseCreator} />
                </div>
            )}
        </div>
    )
}

export default Course;