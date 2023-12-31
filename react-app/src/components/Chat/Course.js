import React, { useState } from "react";
import { auth, coursesRef, feedbackRef } from '../../firebaseConfig';
import FeedbackInput from "./FeedbackInput";
import Modal from "react-modal";
import { Donut } from "./DonutChart";
import { useTranslation } from "react-i18next";

/**
 * Desc: This component is used to display a course, It is used in CourseList.js
 * Props: message is the course data
 * State: isModalOpen is a boolean that is used to toggle the modal, goodRating is the number of good ratings, okRating is the number of ok ratings, badRating is the number of bad ratings, feedback is the feedback for the course, feedbackAvg is the average rating for the course
 * Functions: openModal is used to open the modal, closeModal is used to close the modal, handleRemoveCourseButton is used to remove the course and its feedback from the database, viewFeedback is used to fetch the feedback for the course from the database
 */
function Course(props) {

    // Translation hook
    const { t } = useTranslation();

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

    // Course data from parent
    const { courseName, creatorId, photoURL, creatorName, courseKey, courseId } = props.message;

    // Feedback with the same key as the course
    const courseFeedbackRef = feedbackRef
        .where("courseKey", "==", courseKey)

    const messageClass = creatorId === auth.currentUser.uid ? "sent" : "received";

    const [feedback, setFeedback] = useState([]);

    // Average feedback of a course
    const [feedbackAvg, setFeedbackAvg] = useState("Currently none");


    // Remove course and feedback from database
    const handleRemoveCourseButton = async () => {

        await coursesRef
            .where("courseKey", "==", courseKey)
            .get()
            .then(querySnapshot => {
                querySnapshot.docs[0].ref.delete();
            });

        await courseFeedbackRef
            .get()
            .then(querySnapshot => {
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    querySnapshot.docs[i].ref.delete();
                }
            });
    }

    // View course feedback from database
    const viewFeedback = async () => {

        try {
            const ratingQuerySnap = await courseFeedbackRef.get();

            const ratingData = [];
            let sum = 0;
            let count = 0;
            let good = 0;
            let ok = 0;
            let bad = 0;

            ratingQuerySnap.forEach((doc) => {
                const feedbackData = doc.data();
                const rating = feedbackData.rating;

                switch (rating) {
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
                count++;

                ratingData.push(feedbackData);
            });

            const avg = count === 0 ? 0 : sum / count;

            // set ratings
            setGoodRating(good);
            setOkRating(ok);
            setBadRating(bad);

            setFeedbackAvg(avg.toFixed(2));

            // Fetch feedback for the course and put into feedback hook
            const reviewData = [];

            ratingQuerySnap.forEach((doc) => {
                reviewData.push(doc.data());
            });

            setFeedback(reviewData);

        } catch (e) {
            console.error("Error getting feedback documents: ", e);
        }
    }

    return (
        <div className="grid grid-cols-5 place-content-stretch rounded-lg bg-gray-900 items-center">
            <img src={photoURL} alt="Creator" className="rounded-lg m-2 w-full h-full max-h-[175px] max-w-[175px] col-span-1" />
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
                            <p data-testid="invite_code" className="m-2"><b className="invcode">{courseKey}</b></p>
                        </div>
                        <p className="m-2">[Weekday placeholder]</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="ml-auto">
                            <button data-testid="show_feedback_button" onClick={openModal} className="m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                {t("button_show_feedback")}
                            </button>
                        </div>
                        <div className="ml-auto">
                            <button data-testid="remove_event_button" onClick={handleRemoveCourseButton} className="m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                {t("button_remove_event")}
                            </button>
                        </div>
                    </div>
                    <CourseModal
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        feedback={feedback}
                        courseName={courseName}
                        courseKey={courseKey}
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
                    <FeedbackInput course={courseName} creator={creatorId} courseId={courseId} courseKey={courseKey} />
                </div>
            )}
        </div>
    )
}

function CourseModal({ isOpen, onRequestClose, feedback, courseName, feedbackAvg, good, ok, bad }) {

    // Data for donut chart
    const data = [
        ["Rating", "Amount"],
        ["Bad", bad],
        ["OK", ok],
        ["Good", good]
    ];

    // Options for donut chart
    const options = {
        title: { courseName },
        pieHole: 0.4,
        is3D: false,
        backgroundColor: "transparent",
        legend: "none",
        width: 250,
        height: 400,
        slices: {
            0: { color: "ef4444" },
            1: { color: "eab308" },
            2: { color: "22c55e" }
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
                        <button data-testid="close_modal_button" type="button"
                            onClick={onRequestClose}
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="authentication-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="m-2 grid grid-cols-2">
                        <div className="">
                            <p className="ml-2 mt-2 mr-2 text-gray-50 ">{t("modal_label_feedback_average")} {convertRatingAverage(feedbackAvg)} ({feedbackAvg})</p>
                            <p data-testid="modal_good_text" className="ml-2 mt-2 mr-2 text-gray-50 bg-green-500">{t("grade_good")}: {good}</p>
                            <p className="ml-2 mt-2 mr-2 text-gray-50 bg-yellow-500">{t("grade_ok")}: {ok}</p>
                            <p className="ml-2 mt-2 mr-2 text-gray-50 bg-red-500">{t("grade_bad")}: {bad}</p>
                            <div className="">
                                <Donut className=""
                                    bad={bad}
                                    ok={ok}
                                    good={good}
                                    courseName={courseName}
                                    data={data}
                                    options={options}
                                />
                            </div>
                        </div>
                        <div className="">
                            <ul className="max-h-[420px] overflow-y-auto">
                                {feedback.map((review) => (
                                    <li className="mb-2 border border-gray-300 rounded-lg bg-gray-600">
                                        <p data-testid="modal_review_text" className="ml-2 mt-2 mr-2 text-gray-50">{review.feedbackText}</p>
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

function convertNumberToRating(number) {
    switch (number) {
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

function convertRatingAverage(average) {
    if (average >= 1.33) { return "Good" }
    else if (average < 1.33 && average > 0.66) { return "Ok"; }
    else if (average <= 0.66) { return "Bad"; }
    else { return "Unknown"; }
}

export default Course;
