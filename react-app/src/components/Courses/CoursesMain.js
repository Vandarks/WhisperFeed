import { useCollectionData } from "react-firebase-hooks/firestore";
import React, { useState } from "react";
import { coursesRef, auth } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import Course from '../Chat/Course';
import firebase from 'firebase/compat/app';
import Modal from 'react-modal';

// Main feedback component of the app
// Students should be able to comment or give a rating to the course created by the teacher.
// The creator of the course should see the feedback on the course, maybe as a 0-5 star system?
function CoursesMain() {

    const query = coursesRef.orderBy("createdAt").limit(25);

    const [docId, setDocId] = useState("");

    const [courses] = useCollectionData(query, {idField: "id"});

    const [formCourseName, setFormCourseName] = useState("");

    const [formCourseType, setFormCourseType] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    };


    // Create a course to the database and for others to see, updates asynchronously
    const createCourse = async(e) => {
        e.preventDefault();

        // Only when course name > 5 characters
        if (formCourseName.length > 5 && formCourseType != "") {

        const { uid, photoURL, displayName } = auth.currentUser;

        await coursesRef.add({
            courseName: formCourseName,
            courseType: formCourseType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
            creatorName: displayName
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
                <button onClick={openModal} className="btn-open-modal">
                    Open Modal
                </button>
                <CourseModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    createCourse={createCourse}
                    formCourseName={formCourseName}
                    setFormCourseName={setFormCourseName}
                    formCourseType={formCourseType}
                    setFormCourseType={setFormCourseType}
                />
                <form onSubmit={createCourse} className="mb-5">
                    <p>New Event</p>
                    <input value={formCourseName}
                           placeholder="Enter a name, min. 5 characters"
                           onChange={(e) => setFormCourseName(e.target.value)}
                           className="w-3/12 min-w-min mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    <button type="submit" className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create course</button>
                </form>
                <div className="grid grid-rows-1 gap-4">
                    {courses && courses.map(msg =>
                        <Course key={msg.id} message={msg} id={docId} />
                    )}
                </div>
            </div>
        </>
    )
}

function CourseModal({ isOpen, onRequestClose, createCourse, formCourseName, setFormCourseName, formCourseType, setFormCourseType}) {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="overlay"
        >
            <div id="defaultModal" className="relative bg-gray-700 rounded-lg shadow dark:bg-gray-700">
                <div className="p-4 border-b rounded-t dark:border-gray-600">
                    <h2 className="text-2xl font-semibold text-white mb-5">Create event</h2>
                    <form onSubmit={createCourse} className="mb-5 grid grid-cols-2 gap-4">
                        {/* Left Section */}
                        <div className="col-span-1 ml-5">
                            <div className="p-4 bg-gray-800 text-white mb-2 w-2/5 h-4/5">
                                <p>Photo goes here</p>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Upload photo
                            </button>

                        </div>

                        {/* Right Section */}
                        <div className="col-span-1 mr-5">
                            <input
                                value={formCourseName}
                                placeholder="Enter a name, min. 5 characters"
                                onChange={(e) => setFormCourseName(e.target.value)}
                                className="w-full mb-5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <label htmlFor="event-types" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Select an option
                            </label>
                            <select
                                value={formCourseType}
                                onChange={(e) => setFormCourseType(e.target.value)}
                                id="event-types"
                                className="mb-5 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option selected>Choose event type</option>
                                <option value="Course">Course</option>
                                <option value="Event">Event</option>
                            </select>
                            <button
                                type="submit"
                                className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Create course
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </Modal>
    );
}

export default CoursesMain;