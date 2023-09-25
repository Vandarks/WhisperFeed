import React, { useState } from "react";
import { feedbackRef } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import firebase from "firebase/compat/app";

function FeedbackInput(props) {

    const course = props.course;
    const courseCreator = props.creator;

    // Reference to the feedback collection

    const [feedbackText, setFeedbackText] = useState("");

    const [feedbackRating, setFeedbackRating] = useState(null);

    // Function used to send feedback to the course
    // TODO: Make frontend notification to sender when succesfully sent feedback
    const sendFeedback = async (e) => {

        // Send feedback only when has a valid rating
        e.preventDefault();
        if (feedbackRating != null) {

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
            setFeedbackRating(null);
        } else {
            console.log("Feedback not sent: add feedback rating")
        }
    }
    // Handles feedback button onclick event to pass value to feedbackRating hook
    const handleRatingClick = (param) => {
        setFeedbackRating(param);
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 place-content-stretch rounded-lg py-3 bg-gray-800 m-2">
            <div className="flex flex-col col-span-full mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-center">Please select a rating and provide some feedback!</h3>
            </div>
            <div className="w-2/5 flex flex-col min-w-fit m-2">
                <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                        <div className="flex items-center pl-3">
                            <input onClick={() => handleRatingClick(2)} id="list-radio-good" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                            <label htmlFor="list-radio-good" className="w-1/2 py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                        </div>
                    </li>
                    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                        <div className="flex items-center pl-3">
                            <input onClick={() => handleRatingClick(1)} id="list-radio-ok" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                            <label htmlFor="list-radio-ok" className="w-1/2 py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">OK</label>
                        </div>
                    </li>
                    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                        <div className="flex items-center pl-3">
                            <input onClick={() => handleRatingClick(0)} id="list-radio-bad" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" />
                            <label htmlFor="list-radio-bad" className="w-1/2 py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="flex flex-col col-span-1 items-center">
                <form onSubmit={sendFeedback}>
                    <div className="m-2">
                        <textarea value={feedbackText}
                            placeholder="Write your thoughts here..."
                            onChange={(e) => setFeedbackText(e.target.value)}
                            className="md:mt-0 mr-2 w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className="flex flex-col items-center mt-2">
                        <button type="submit" className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send Feedback</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default FeedbackInput;