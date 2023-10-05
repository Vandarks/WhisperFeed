import { useCollectionData } from "react-firebase-hooks/firestore";
import React, { useEffect, useState } from "react";
import { coursesRef, auth } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import Course from '../Chat/Course';
import firebase from 'firebase/compat/app';
import Modal from 'react-modal';

// Main feedback component of the app
// Students should be able to comment or give a rating to the course created by the teacher.
// The creator of the course should see the feedback on the course, maybe as a 0-5 star system?
function CoursesMain() {

    // All known course keys
    const [knownKeys, setKnownKeys] = useState(["js8uIv", "nNb6bj", "JVuC6u", 12345, "8DeL5R"]);

    const query = coursesRef.orderBy("createdAt").limit(25);

    const codeQuery = coursesRef.where("courseKey", "in", knownKeys);


    useEffect(() => {
        codeQuery
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data().courseName);
            });
        }).catch((error) => {
            console.error("Error getting user documents: ", error);
        })

    })


    // specialized query that goes through all user codes and searches all related courses


    console.log(codeQuery);

    const [docId, setDocId] = useState("");

    const [courses] = useCollectionData(codeQuery, { idField: "id" });

    const [formCourseName, setFormCourseName] = useState("");

    const [formCourseType, setFormCourseType] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Course key for new course
    const [courseKey, setCourseKey] = useState(12345);

    // For generating a unique key for course
    const generateCourseKey = async () => {
        let generatedKey = "";
        const characters = "1234567890qwertyuiopsdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZCVNM";
        const keyLength = 6;
        let counter = 0;

        while (counter < keyLength) {
            generatedKey += characters.charAt(Math.floor(Math.random() * characters.length));
            counter += 1;
        }
        checkCourseKey(generatedKey);
    }

    // Check through the database for course keys, add them to the knownKey array
    const checkCourseKey = (generatedKey) => {
        knownKeys.forEach((key, index) => {
            if (generatedKey === key) {
                console.log("Key already exists, the chances of this happening is approx one in 56.8 trillion");
                generateCourseKey();
            } else {
                console.log("its a new key! ", generatedKey)
                setCourseKey(generatedKey);
                return generatedKey;
            }
        });
    }


    const openModal = () => {
        generateCourseKey();
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    };


    // Create a course to the database and for others to see, updates asynchronously
    const createCourse = async (e) => {
        e.preventDefault();

        // Only when course name > 5 characters
        if (formCourseName.length > 5 && formCourseType !== "") {

            const { uid, photoURL, displayName } = auth.currentUser;

            await coursesRef.add({
                courseName: formCourseName,
                courseType: formCourseType,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL,
                creatorName: displayName,
                courseKey: courseKey
            })
                .then((docRef) => {
                    console.log("Document ID: ", docRef.id);
                    setDocId(docRef.id);
                })
                .catch((e) => {
                    console.error("Error adding document: ", e);
                });

            setFormCourseName("");
        } else {
            console.log("Course not created, add valid course name!")
        }
    }

    return (
        <>
            <div className="">
                <button onClick={openModal} className="btn-open-modal m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Create Event
                </button>
                <button onClick={generateCourseKey} className="btn-open-modal m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Generate Course Key
                </button>
                <p>{courseKey}</p>
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
                    {courses && courses.map(msg =>
                        <Course key={msg.id} message={msg} id={msg.docId} courseKey={msg.courseKey} />
                    )}
                </div>
            </div>
        </>
    )
}

function CourseModal({ isOpen, onRequestClose, createCourse, formCourseName, setFormCourseName, formCourseType, setFormCourseType }) {

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
                        <h2 className="text-2xl font-semibold text-white mb-5">Create event</h2>
                        <button type="button"
                            onClick={onRequestClose}
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="authentication-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form onSubmit={createCourse} className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        {/* Left Section */}
                        <div className="col-span-1 m-2">
                            <div className="p-4 bg-gray-800 text-white m-2 w-[150px] h-[150px]">
                                <p>Photo goes here</p>
                            </div>

                            <button
                                className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-2"
                            >
                                Upload photo
                            </button>

                        </div>

                        {/* Right Section */}
                        <div className="grid grid-cols-4 col-span-1 mr-5">
                            <label className="block m-2 text-sm font-medium text-gray-900 dark:text-white">Name: </label>
                            <input
                                value={formCourseName}
                                placeholder="Enter a name, min. 5 characters"
                                onChange={(e) => setFormCourseName(e.target.value)}
                                className="w-full col-span-3 mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <label htmlFor="event-types" className="block m-2 text-sm font-medium text-gray-900 dark:text-white">
                                Type:
                            </label>
                            <select
                                value={formCourseType}
                                onChange={(e) => setFormCourseType(e.target.value)}
                                id="event-types"
                                className="mb-5 col-span-3 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option selected>Choose event type</option>
                                <option value="Course">Course</option>
                                <option value="Event">Event</option>
                            </select>
                            <div className="col-span-4 flex items-center justify-center">
                                <button
                                    type="submit"
                                    className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Create course
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