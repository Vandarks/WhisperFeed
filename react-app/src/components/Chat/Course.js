import React, { useState, useEffect } from "react";
import { auth, firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import FeedbackInput from "./FeedbackInput";
import Modal from "react-modal";

function Course (props) {

    // Modal settings
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        viewFeedback();
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }


    const { courseName, uid, photoURL, creatorName } = props.message;
    const courseCreator = props.message.uid;

    // Reference to the feedback collection
    const feedbackRef = firestore.collection("feedback");

    // For checking out feedback on certain courses
    const courseFeedbackRef = feedbackRef
        .where("courseName", "==", courseName)
        .where("uid", "==", courseCreator);
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    const [feedback, setFeedback] = useState([]);

    // Average feedback of a course
    const [feedbackAvg, setFeedbackAvg] = useState("Currently none");



    // Remove course and feedback from database
    const handleRemoveCourseButton = () => {

        console.log("Deleted course: ", courseName, " creator: ", courseCreator)

        firestore.collection("courses")
            .where("courseName", "==", courseName)
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

        try {
            const ratingQuerySnap = await courseFeedbackRef.where("rating", "!=", null).get();

            const ratingData = [];
            let sum = 0;
            let count = 0;

            ratingQuerySnap.forEach((doc) => {
                const feedbackData = doc.data();
                const rating = feedbackData.rating;

                sum += rating;
                count ++;

                ratingData.push(feedbackData);
            });

            const avg = count === 0 ? 0 : sum / count;

            setFeedbackAvg(avg.toFixed(2));

            console.log("course: ", courseName, " uid: ", courseCreator);
            
            
            // Fetch feedback for the course and put into feedback hook
            const reviewData = [];
            
            ratingQuerySnap.forEach((doc) => {
                reviewData.push(doc.data());
            });

            setFeedback(reviewData);

            console.log("Feedback text: ", reviewData.text);

        } catch (e) {
            console.error("Error getting feedback documents: ", e);
        }
    }


    return (
        <div className="grid grid-cols-5 place-content-stretch rounded-lg bg-gray-900 items-center">
            <img src={photoURL} alt="Creator" className="rounded-lg m-2 w-full h-full max-h-[200px] max-w-[200px] col-span-1"/>
            <div className="w-full flex flex-col items-center overflow-visible col-span-1 ">
                <h2 className="md:text-xl break-words font-semibold m-2 text-center">{courseName}</h2>
                <p className="mb-2">{creatorName}</p>
            </div>

            {/* Only show this if user is the owner of the course */}
            {messageClass === "sent" && (
                <div className="grid rounded-lg m-2 col-span-3 items-center grid-cols-2">
                    <p className="m-2"><b>Invite code: 12345</b></p>
                    <button onClick={openModal} className="m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Show Feedback
                    </button>
                    <p className="m-2">[Weekday placeholder]</p>
                    <button onClick={handleRemoveCourseButton} className="m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Remove course</button>
                    <CourseModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        feedback = {feedback}
                        courseName = {courseName}
                        feedbackAvg={feedbackAvg}
                        />
                </div>
            )}
            {/* Only show the next part if not the owner */}
            {messageClass === "received" && (
                <div className="col-span-3">
                    <FeedbackInput course={courseName} creator={courseCreator} />
                </div>
            )}
        </div>
    )
}

function CourseModal({ isOpen, onRequestClose, feedback, courseName, feedbackAvg}) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="overlay"
        >
            <div id="defaultModal" className="fixed overflow-y-auto overflow-x-hidden outline-none bg-gray-700 rounded-lg shadow dark:bg-gray-700 min-w-[300px]">
                <div className="relative w-auto p-4 border-b rounded-t dark:border-gray-600">
                    <div className="flex items-center justify-center mb-2">
                        <h2 className="text-2xl font-semibold text-white mb-5">Feedback for {courseName}</h2>
                        <button type="button"
                                onClick={onRequestClose}
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="authentication-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                      stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="m-2">
                        <p className="ml-2 mt-2 mr-2 text-gray-50">Feedback Average {feedbackAvg}</p>
                        <ul className="">
                            {feedback.map((review, index) => (
                                <li key={index} className="mb-2 border border-gray-300 rounded-lg bg-gray-600">
                                    <p className="ml-2 mt-2 mr-2 text-gray-50">{review.text}</p>
                                    <p className="ml-2 mb-2 text-gray-50 text-sm">Feedback rating: {review.rating}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

        </Modal>
    );
}
export default Course;