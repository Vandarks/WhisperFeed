import React, { useState, useEffect } from "react";
import { auth, firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import FeedbackInput from "./FeedbackInput";

function Course (props) {
    const { text, uid, photoURL, displayName } = props.message;
    const courseName = text;
    const courseCreator = props.message.uid;

    // Reference to the feedback collection
    const feedbackRef = firestore.collection("feedback");

    // For checking out reviews on certain courses
    const courseFeedbackRef = feedbackRef
        .where("courseName", "==", courseName)
        .where("uid", "==", courseCreator);
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    const [feedback, setFeedback] = useState([]);

    // Average feedback of a course
    const [feedbackAvg, setFeedbackAvg] = useState("Currently none");

    // Updates feedback average score value
    useEffect(() => {

        // fetch all feedback with a rating
        courseFeedbackRef
            .where("rating", "!=", null)
            .get()
            .then((querySnapshot) => {
                const data = [];
                let sum = 0;
                let count = 0;

                // add to rating and count for each document with a rating
                querySnapshot.forEach((doc) => {
                    const feedbackData = doc.data();
                    const rating = feedbackData.rating;

                    sum += rating;
                    count++;

                    data.push(feedbackData);
                });

                // Calculate average if possible
                const avg = count === 0 ? 0 : sum / count;

                // Set feedback average to avg
                setFeedbackAvg(avg);
            })
            .catch((error) => {
                console.error("Error getting feedback documents: ", error);
            });
    }, [courseFeedbackRef]);

    // Remove course and feedback from database
    const handleRemoveCourseButton = () => {

        console.log("course: ", courseName, " uid: ", courseCreator)

        firestore.collection("courses")
            .where("text", "==", courseName)
            .get()
            .then(querySnapshot => {
                querySnapshot.docs[0].ref.delete();
            });

        courseFeedbackRef
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
        courseFeedbackRef.get().then((querySnapshot) => {
            const reviewData = [];
            querySnapshot.forEach((doc) => {
                reviewData.push(doc.data());
            });
            setFeedback(reviewData);
        });

        console.log(feedback.text);
    }

    return (
        <div className="flex grid grid-cols-2 place-content-stretch rounded-lg bg-gray-900">
            <img src={photoURL} alt="Creator" className="rounded-lg m-2" />
            <div className="w-full flex flex-col items-center overflow-visible ">
                <h2 className="md:text-xl break-words font-semibold m-2">{text}</h2>
                <p className="mb-2">{displayName}</p>
            </div>

            {/* Only show this if user is the owner of the course */}
            {messageClass === "sent" && (
                <div className="w-full border rounded-lg">
                    <p><b>Average feedback: </b>{feedbackAvg}</p>
                    <button onClick={viewFeedback} className="mb-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"> View Feedback </button>
                    {feedback.length > 0 ? (
                    <div>
                        <ul>
                            {feedback.map((review, index) => (
                                <li key={index}>
                                    <p>{review.text}</p>
                                    <p>Feedback rating: {review.rating}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )  : <div className="noFeedback" />}
                    <button onClick={handleRemoveCourseButton} className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Remove course</button>
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