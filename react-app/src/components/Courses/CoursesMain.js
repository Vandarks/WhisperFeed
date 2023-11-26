import { useCollectionData } from "react-firebase-hooks/firestore";
import React, { useEffect, useState } from "react";
import { coursesRef, auth, usersRef } from "../../firebaseConfig"; // Import firestore from your Firebase configuration file
import Course from "../Chat/Course";
import firebase from "firebase/compat/app";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";

// Main feedback component of the app
// Students should be able to comment or give a rating to the course created by the teacher.
// The creator of the course should see the feedback on the course, maybe as a 0-5 star system?
function CoursesMain() {
    // All known course keys
    const [knownKeys, setKnownKeys] = useState([""]);

    const [userKeys, setUserKeys] = useState(["AlSVQ7"]);

    const currentUserRef = usersRef.doc(auth.currentUser.uid);

    const currentCourses = [];

    const getCurrentCourses = () => {
        currentCourses.length = 0;
        for (let i = 0; i < userKeys.length; i++) {
            coursesRef
                .where("courseKey", "==", userKeys[i])
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        currentCourses.push(data);
                    });
                })
                console.log("Current courses: " + currentCourses);
        }
    }

    const codeQuery = coursesRef.where("courseKey", "in", userKeys);

    const [courseKeyText, setCourseKeyText] = useState("");

    const [courses] = useCollectionData(codeQuery, { idField: "id" });

    const [formCourseName, setFormCourseName] = useState("");

    const [formCourseType, setFormCourseType] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { t } = useTranslation();

    const refreshCourses = () => {
        currentUserRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.hasOwnProperty("courseCodes")) {
                        setUserKeys(userData.courseCodes);
                        console.log("User keys: " + userKeys);
                    } else {
                        console.log("Field does not exist in the doc");
                    }
                } else {
                    console.log(
                        "Document does not exist in collection, creating"
                    );
                    currentUserRef
                        .set({
                            courseCodes: ["AlSVQ7"],
                        })
                        .then(() => {
                            console.log("New document created succesfully.");
                        })
                        .catch((e) => {
                            console.error("Error creating a new document: ", e);
                        });
                }
            })
            .catch((e) => {
                console.error("Error fetching document: ", e);
            });

    };

        // For generating a unique key for course
let generatedKey = "";

    const generateCourseKey = () => {
        
        // Course key properties
        const symbols =
            "1234567890qwertyuiopsdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZCVNM";
        const keyLength = 6;
        
        //Retrieving all known keys from document
        coursesRef.get().then((querySnapshot) => {
            const keys = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.hasOwnProperty("courseKey")) {
                    keys.push(data.courseKey);
                }
            });
// put snapshot data to state
            setKnownKeys(keys);
        });

// Key creator and checker
        let counter = 0;
        let uniqueKeyGenerated = false;
        while (!uniqueKeyGenerated) {

            // Generate a random key
            while (counter < keyLength) {
                generatedKey += symbols.charAt(
                    Math.floor(Math.random() * symbols.length)
                );
                counter++;
            }
// Reset key character counter for reuse
            counter = 0;
            
            // Compare generated key to known keys
            let comparable = generatedKey
            let isUnique = 0;
            knownKeys.forEach((key) => {
                if (comparable === key) {
                    console.log("Key is already known");
isUnique++;
                } else {
                    console.log("its a new key, ", comparable)
                }
            });
            if (isUnique === 0) {
                    uniqueKeyGenerated = true;
                }
            
            // Reset checker parametres for reuse
            isUnique = 0;
            comparable = "";
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Create a course to the database and for others to see, updates asynchronously
    const createCourse = async (e) => {
        e.preventDefault();
        // Only when course name > 5 characters
        if (formCourseName.length > 5 && formCourseType !== "") {
            let { uid, photoURL, displayName } = auth.currentUser;
            // If not logged in via google
            if (displayName == null && photoURL == null) {
                displayName = auth.currentUser.email;
            }
            generateCourseKey();
            await coursesRef
                .add({
                    courseName: formCourseName,
                    courseType: formCourseType,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    uid,
                    photoURL,
                    creatorName: displayName,
                    courseKey: generatedKey,
                })
                .then((docRef) => {
                    console.log("Document ID: ", docRef.id);
                    joinCourse(generatedKey);
                })
                .catch((e) => {
                    console.error("Error adding document: ", e);
                });

            setFormCourseName("");
        } else {
            console.log("Course not created, add valid course name!");
        }
    };

    // This can be called whenever needed to join a new course, is automatically called when creating a new course
    const joinCourse = async (newCourseKey) => {
        try {
            await currentUserRef.update({
                courseCodes:
                    firebase.firestore.FieldValue.arrayUnion(newCourseKey),
            });
            console.log("joined course " + newCourseKey);
            refreshCourses();
        } catch (e) {
            console.error("Error joining the course ", e);
        }
    };

    const deleteAllCourseCodes = async () => {
        try {
            // get all course codes from user and remove them
            currentUserRef.update({
                courseCodes: firebase.firestore.FieldValue.delete()
            });
            console.log("deleted all course codes for user " + auth.currentUser.uid);
            refreshCourses();
        } catch (e) {
            console.error("Error deleting all courses ", e);
        }
    }

    useEffect(() => {
        refreshCourses();
    }, []);

    const handleJoinClick = (param) => {
        if (courseKeyText.length === 6) {
            console.log("testi");
            joinCourse(param);
        }
    };


    const [ updatedKeys, setUpdatedKeys ] = useState([]);

    const checkStaleKeys = async() => {
        // get the ref for documents, add all courses to array
        // get the ref for user keys, add all user keys to array
        // iterate all user keys, if course key is the same as the user key, add it to updatedKeys
        let oldKeys = 0;
        let updatedKeysList = [];
        coursesRef.get()
            .then((querySnapshot) => {
                for (let i = 0; i < userKeys.length; i++) {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.courseKey === userKeys[i]) {
                            console.log("found a match for " + userKeys[i] + " in courses");
                            oldKeys++;
                            setUpdatedKeys([...updatedKeys, userKeys[i]])
                            updatedKeysList.push(userKeys[i]);
                        }
                    })
                    if (oldKeys === 0) {
                        console.log("no match found for " + userKeys[i] + " in courses");
                    }
                }
                console.log("updatedKeys: " + updatedKeys);
                console.log("oldKeys: " + oldKeys);
                updateUserKeys(updatedKeysList);
                setUpdatedKeys([]);
            })
    }

    const updateUserKeys = async(updatedKeys) => {
        currentUserRef.update({
            courseCodes: updatedKeys
        }).then(() => {
            console.log("updated user keys to " + updatedKeys);
        }).catch((e) => {
            console.error("Error updating user keys: ", e);
        })
    }

    return (
        <>
            <div className="">
                <div id="btn_cont" className="flex justify-between">
                    <div className="flex">
                        <div id="create_btn" className="m-2">
                            <button
                                data-testid="create_event_button"
                                onClick={openModal}
                                className="btn-open-modalbg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                {t("button_create_event")}
                            </button>
                        </div>
                    </div>
                    <div id="delete_keys_btn" className="m-2">
                        <button
                            data-testid="delete_all_keys_button"
                            onClick={deleteAllCourseCodes}
                            className="bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                        >
                            {t("button_delete_all_keys")}
                        </button>
                    </div>
                    <div id="update_keys_btn" className="m-2">
                        <button
                            data-testid="update_all_keys_button"
                            onClick={checkStaleKeys}
                            className="bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            {t("button_update_all_keys")}
                        </button>
                    </div>
                    <div id="update_courses_btn" className="m-2">
                        <button
                            data-testid="update_all_courses_button"
                            onClick={getCurrentCourses}
                            className="bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                        >
                            {t("button_update_all_courses")}
                        </button>
                    </div>
                    <div id="join_btn" className="m-2 flex items-start">
                        <input
                            data-testid="join_event_input"
                            type="text"
                            value={courseKeyText}
                            onChange={(e) => setCourseKeyText(e.target.value)}
                            placeholder={t("field_event_key")}
                            className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                        <button
                            data-testid="join_event_button"
                            onClick={() => handleJoinClick(courseKeyText)}
                            className="ml-2 btn-open-modal bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {t("button_join_event")}
                        </button>
                    </div>
                </div>

                <CourseModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    createCourse={createCourse}
                    formCourseName={formCourseName}
                    setFormCourseName={setFormCourseName}
                    formCourseType={formCourseType}
                    setFormCourseType={setFormCourseType}
                />
                <div className="grid grid-rows-1 gap-4">
                    {courses &&
                        courses.map((course) => (
                            <Course
                                message={course}
                            />
                        ))}
                </div>
            </div>
        </>
    );
}

function CourseModal({
    isOpen,
    onRequestClose,
    createCourse,
    formCourseName,
    setFormCourseName,
    formCourseType,
    setFormCourseType,
}) {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="overlay"
        >
            <div
                id="defaultModal"
                className="fixed overflow-y-auto overflow-x-hidden outline-none bg-gray-700 rounded-lg shadow dark:bg-gray-700 min-w-[300px]"
            >
                <div className="relative w-auto p-4 border-b rounded-t dark:border-gray-600">
                    <div className="flex items-center justify-center mb-2">
                        <h2 data-testid="create_event_header" className="text-2xl font-semibold text-white mb-5">
                            {t("button_create_event")}
                        </h2>
                        <button
                            data-testid="close_modal_button"
                            type="button"
                            onClick={onRequestClose}
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="authentication-modal"
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form
                        onSubmit={createCourse}
                        className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
                    >
                        {/* Left Section */}
                        <div className="col-span-1 m-2">
                            <div className="p-4 bg-gray-800 text-white m-2 w-[150px] h-[150px]">
                                <p>{t("modal_photo_placeholder")}</p>
                            </div>

                            <button className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-2">
                                {t("modal_button_upload_photo")}
                            </button>
                        </div>

                        {/* Right Section */}
                        <div className="grid grid-cols-4 col-span-1 mr-5">
                            <label className="block m-2 text-sm font-medium text-gray-900 dark:text-white">
                                {t("modal_event_name")}:{" "}
                            </label>
                            <input
                                data-testid="event_name_input"
                                value={formCourseName}
                                placeholder={t("modal_field_event_name")}
                                onChange={(e) =>
                                    setFormCourseName(e.target.value)
                                }
                                className="w-full col-span-3 mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <label
                                htmlFor="event-types"
                                className="block m-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                {t("modal_event_type")}:
                            </label>
                            <select
                                data-testid="event_type_selection"
                                value={formCourseType}
                                onChange={(e) =>
                                    setFormCourseType(e.target.value)
                                }
                                id="event-types"
                                className="mb-5 col-span-3 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option disabled selected>{t("modal_selection_choose")}</option>
                                <option data-testid="option_course" value="Course" id="option1">
                                    {t("modal_selection_course")}
                                </option>
                                <option data-testid="option_event" value="Event" id="option2">
                                    {t("modal_selection_event")}
                                </option>
                            </select>
                            <div className="col-span-4 flex items-center justify-center">
                                <button
                                    data-testid="create_event_modal_button"
                                    type="submit"
                                    className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-9"
                                >
                                    {t("button_create_event")}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

export default CoursesMain;
