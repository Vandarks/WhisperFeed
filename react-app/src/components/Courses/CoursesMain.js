import { useCollectionData } from "react-firebase-hooks/firestore";
import React, { useEffect, useState } from "react";
import { coursesRef, auth, usersRef } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import Course from '../Chat/Course';
import firebase from 'firebase/compat/app';
import Modal from 'react-modal';

// Main feedback component of the app
// Students should be able to comment or give a rating to the course created by the teacher.
// The creator of the course should see the feedback on the course, maybe as a 0-5 star system?
function CoursesMain() {

    // All known course keys
    const [knownKeys, setKnownKeys] = useState([""]);

    const [userKeys, setUserKeys] = useState(["vZVV66"]);

    const currentUserRef = usersRef.doc(auth.currentUser.uid);

    const codeQuery = coursesRef.where("courseKey", "in", userKeys);

    
    
    
    const [courses] = useCollectionData(codeQuery, { idField: "id" });
    
    const [formCourseName, setFormCourseName] = useState("");
    
    const [formCourseType, setFormCourseType] = useState("");
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    
    const refreshCourses = () => {
        currentUserRef.get()
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
                    console.log("Document does not exist in collection, creating");
                    currentUserRef.set({
                        courseCodes: ["vZVV66"],
                    })
                    .then(() => {
                        console.log("New document created succesfully.")
                    })
                    .catch((e) => {
                        console.error("Error creating a new document: ", e);
                    });
                }
            })
            .catch((e) => {
                console.error("Error fetching document: ", e);
            });
            
            codeQuery
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("Doc id: " + doc.id + " course name: " + doc.data().courseName);
                });
            }).catch((error) => {
                console.error("Error getting user documents: ", error);
            });
        }
    
    let generatedKey = "";
    // For generating a unique key for course
    const generateCourseKey = () => {
        const characters = "1234567890qwertyuiopsdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZCVNM";
        const keyLength = 6;
        let counter = 0;
        let uniqueKeyGenerated = false;
        
        //Retrieving all known keys from document
        coursesRef.get()
        .then((querySnapshot) => {
                const keys = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.hasOwnProperty("courseKey")) {
                        keys.push(data.courseKey);
                    }
                })
                setKnownKeys(keys);
            });
            
            while (!uniqueKeyGenerated) {
                while (counter < keyLength) {
                    generatedKey += characters.charAt(Math.floor(Math.random() * characters.length));
                    counter += 1;
                }
                counter = 0;
                knownKeys.forEach((key, index) => {
                    if (generatedKey === key) {
                        console.log("NOPE");
                    } else {
                        console.log("its a new key! ", generatedKey)
                        uniqueKeyGenerated = true;
                    }
                })
                
            }
        }
        
        const openModal = () => {
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
                generateCourseKey();
                await coursesRef.add({
                    courseName: formCourseName,
                courseType: formCourseType,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL,
                creatorName: displayName,
                courseKey: generatedKey
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
                console.log("Course not created, add valid course name!")
            }
        }
        
        // This can be called whenever needed to join a new course, is automatically called when creating a new course
        const joinCourse = async(newCourseKey) => {
            try {
                await currentUserRef.update({
                    courseCodes: firebase.firestore.FieldValue.arrayUnion(newCourseKey),
                });
                console.log("joined course " + newCourseKey);
                refreshCourses();
            } catch (e) {
                console.error("Error joining the course ", e);
            }
        }
        
        useEffect(() => {
            refreshCourses();
                
            }, []);
        
        
        return (
            <>
            <div className="">
                <button onClick={openModal} className="btn-open-modal m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Create Event
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