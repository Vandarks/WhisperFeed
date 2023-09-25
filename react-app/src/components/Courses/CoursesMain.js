import { useCollectionData } from "react-firebase-hooks/firestore";
import React, { useState } from "react";
import { coursesRef, auth } from '../../firebaseConfig'; // Import firestore from your Firebase configuration file
import Course from '../Chat/Course';
import firebase from 'firebase/compat/app';

// Main feedback component of the app
// TODO: Put two different views, one for teachers and one for students
// Students should be able to comment or give a rating to the course created by the teacher.
// The creator of the course should see the feedback on the course, maybe as a 0-5 star system?
function CoursesMain() {

    const query = coursesRef.orderBy("createdAt").limit(25);

    const [docId, setDocId] = useState("");

    const [courses] = useCollectionData(query, {idField: "id"});

    const [formValue, setFormValue] = useState("");



    // Create a course to the database and for others to see, updates asynchronously
    const createCourse = async(e) => {
        e.preventDefault();

        // Only when course name > 5 characters
        if (formValue.length > 5) {

        const { uid, photoURL, displayName } = auth.currentUser;

        await coursesRef.add({
            courseName: formValue,
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

        setFormValue("");
        } else {
            console.log("Course not created, add valid course name!")
        }
    }

    return (
        <>
            <div className="">
                <form onSubmit={createCourse} className="mb-5">
                    <input value={formValue}
                           placeholder="Enter a name, min. 5 characters"
                           onChange={(e) => setFormValue(e.target.value)}
                           className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                    <button type="submit" className="bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create course</button>
                </form>
                <div className="grid grid-rows-4 gap-4">
                    {courses && courses.map(msg =>
                        <Course key={msg.id} message={msg} id={docId} />
                    )}
                </div>
            </div>
        </>
    )
}

export default CoursesMain;