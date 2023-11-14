import React, { useState} from "react";
import { auth, firestore } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import FeedbackInput from "./FeedbackInput";
import Modal from "react-modal";
import { Donut } from "./DonutChart";
import {useTranslation} from "react-i18next";

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

    // feedback rating hooks
    const [goodRating, setGoodRating] = useState(0);
    const [okRating, setOkRating] = useState(0);
    const [badRating, setBadRating] = useState(0);


    const { courseName, uid, photoURL, creatorName, courseKey  } = props.message;
        

    // Reference to the feedback collection
    const feedbackRef = firestore.collection("feedback");

    // For checking out feedback on certain courses
    const courseFeedbackRef = feedbackRef
        .where("courseName", "==", courseName)
        .where("uid", "==", uid);
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
    const [feedback, setFeedback] = useState([]);

    // Average feedback of a course
    const [feedbackAvg, setFeedbackAvg] = useState("Currently none");

    const { t } = useTranslation();

    // Remove course and feedback from database
    const handleRemoveCourseButton = () => {

        console.log("Deleted course: ", courseName, " creator: ", uid)

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

            let good = 0;
            let ok = 0;
            let bad = 0;

            ratingQuerySnap.forEach((doc) => {
                const feedbackData = doc.data();
                const rating = feedbackData.rating;

                switch(rating) {
                    case 2:
                        good++;
                        break;
                        
                    case 1:
                        ok++;
                        break;
                    case 0:
                        bad++;
                        break;
                    default:
                        break;
                }

                sum += rating;
                count ++;

                ratingData.push(feedbackData);
            });

            const avg = count === 0 ? 0 : sum / count;


            // set things
            setGoodRating(good);
            setOkRating(ok);
            setBadRating(bad);

            setFeedbackAvg(avg.toFixed(2));

            console.log(goodRating);

            console.log("course: ", courseName, " uid: ", uid);
            
            
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
            <img src={photoURL} alt="Creator" className="rounded-lg m-2 w-full h-full max-h-[175px] max-w-[175px] col-span-1"/>
            <div className="w-full flex flex-col items-center overflow-visible col-span-1 ">
                <h2 className="md:text-xl break-words font-semibold m-2 text-center"
                >
                    {courseName}
                </h2>
                <p className="mb-2">{creatorName}</p>
            </div>

            {/* Only show this if user is the owner of the course */}
            {messageClass === "sent" && (
                <div className="grid rounded-lg m-2 col-span-3 items-center grid-cols-2">
                    <div>
                        <div className="grid grid-cols-2">
                        <p className="m-2"><b>{t("invite_code")}: </b></p>
                        <p className="m-2"><b>{courseKey}</b></p>
                        </div>
                        <p className="m-2">[Weekday placeholder]</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="ml-auto">
                            <button onClick={openModal} className="m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                {t("button_show_feedback")}
                            </button>
                        </div>
                        <div className="ml-auto">
                            <button onClick={handleRemoveCourseButton} className="m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                {t("button_remove_event")}
                            </button>
                        </div>
                    </div>
                    <CourseModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        feedback = {feedback}
                        courseName = {courseName}
                        feedbackAvg={feedbackAvg}
                        good={goodRating}
                        ok={okRating}
                        bad={badRating}
                        />
                </div>
            )}
            {/* Only show the next part if not the owner */}
            {messageClass === "received" && (
                <div className="col-span-3">
                    <FeedbackInput course={courseName} creator={uid} />
                </div>
            )}
        </div>
    )
}

function CourseModal({ isOpen, onRequestClose, feedback, courseName, feedbackAvg, good, ok, bad}) {


    // Data for donut chart
    const data = [
        ["Rating", "Amount"],
        ["Bad", bad],
        ["OK", ok],
        ["Good", good]
      ];

    // Options for donut chart
    const options = {
        title: {courseName},
        pieHole: 0.4,
        is3D: false,
        backgroundColor: "transparent",
        legend: "none",
        width: 250,
        height: 400,
        slices: {
            0: {color: "ef4444"},
            1: {color: "eab308"},
            2: {color: "22c55e"}
        }
    };

    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="overlay"
        >
            <div id="defaultModal" className="max-h-[550px] fixed bg-gray-700 rounded-lg shadow dark:bg-gray-700">
                <div className="relative p-4 rounded-t dark:border-gray-600">
                    <div className="flex items-center justify-center mb-2">
                        <h2 className="text-2xl font-semibold text-white mb-5">{t("modal_label_feedback_for")} {courseName}</h2>
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
                    <div className="m-2 grid grid-cols-2">
                        <div className="">
                            <p className="ml-2 mt-2 mr-2 text-gray-50 ">{t("modal_label_feedback_average")} {convertRatingAverage(feedbackAvg)} ({feedbackAvg})</p>
                            <p className="ml-2 mt-2 mr-2 text-gray-50 bg-green-500">{t("grade_good")}: {good}</p>
                            <p className="ml-2 mt-2 mr-2 text-gray-50 bg-yellow-500">{t("grade_ok")}: {ok}</p>
                            <p className="ml-2 mt-2 mr-2 text-gray-50 bg-red-500">{t("grade_bad")}: {bad}</p>
                            <div className="">
                                <Donut className=""
                                       bad={bad}
                                       ok={ok}
                                       good={good}
                                       courseName = {courseName}
                                       data = {data}
                                       options = {options}
                                />
                            </div>
                        </div>
                        <div className="">
                            <ul className="max-h-[420px] overflow-y-auto">
                                {feedback.map((review, index) => (
                                    <li className="mb-2 border border-gray-300 rounded-lg bg-gray-600">
                                        <p className="ml-2 mt-2 mr-2 text-gray-50">{review.text}</p>
                                        <p className="ml-2 mb-2 text-gray-50 text-sm">Feedback rating: {convertNumberToRating(review.rating)}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </Modal>
    );
}

function convertNumberToRating(number){
    switch (number){
        case 2:
            return "Good";
        case 1:
            return "Ok";
        case 0:
            return "Bad";
        default:
            return "Unkown";
    }
}

function convertRatingAverage(average){
    if(average >= 1.33){return "Good"}
    else if(average < 1.33 && average > 0.66){return "Ok";}
    else if(average <= 0.66){return "Bad";}
    else{return "Unknown";}
}

export default Course;
