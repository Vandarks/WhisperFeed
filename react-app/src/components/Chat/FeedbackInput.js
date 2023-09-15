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
            <div className="w-2/5 flex flex-col">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white text-center">Please select a rating</h3>
                <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                        <div className="flex items-center pl-3">
                            <input id="list-radio-good" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="list-radio-good" className="w-1/2 py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Good</label>
                        </div>
                    </li>
                    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                        <div className="flex items-center pl-3">
                            <input id="list-radio-ok" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="list-radio-ok" className="w-1/2 py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">OK</label>
                        </div>
                    </li>
                    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                        <div className="flex items-center pl-3">
                            <input id="list-radio-bad" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                            <label htmlFor="list-radio-bad" className="w-1/2 py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bad</label>
                        </div>
                    </li>
                </ul>

                {/*<button onClick={() => handleRatingClick(2)} className="w-2/4 rounded-2xl bg-green-500 bg-opacity-50 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-green-500">Good</button>
                <button onClick={() => handleRatingClick(1)} className="w-2/4 rounded-2xl bg-yellow-500 mb-2 mt-2 bg-opacity-95 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-yellow-300">OK</button>
                <button onClick={() => handleRatingClick(0)} className="w-2/4 rounded-2xl bg-red-600 bg-opacity-50 shadow-xl backdrop-blur-md transition-colors duration-300 hover:bg-red-500">Bad</button>*/}
            </div>
            <div className="flex items-center">
                <form onSubmit={sendFeedback}>
                    <div>
                        <input value={feedbackText} placeholder="Write something here..." onChange={(e) => setFeedbackText(e.target.value)} className="w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    </div>
                    <div className="flex items-center ml-11 mt-2">
                        <button type="submit" className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send Feedback</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


export default FeedbackInput;