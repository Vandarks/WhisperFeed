import wfLogo from '../../images/favicon.png';
import settingsLogo from '../../images/settings.png';
import { Link } from "react-router-dom";
import SignOut from "../Auth/SignOut";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, coursesRef, usersRef, firestore, feedbackRef} from "../../firebaseConfig";
import Modal from "react-modal";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { deleteDoc, doc } from 'firebase/firestore';

function HeaderProfile() {
    const { t } = useTranslation();

    const [user] = useAuthState(auth);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return(
        <header>
            <nav className="fixed top-0 w-full z-10 border-gray-200 px-4 lg:px-6 py-2.5 bg-gray-700">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" className="flex items-center">
                        <img src={wfLogo} className="mr-3 h-6 sm:h-9"
                             alt="Whisperfeed Logo"/>
                        <span
                            className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Whisperfeed</span>
                    </Link>
                    <div className="flex items-center lg:order-2">
                        <LanguageSwitcher />
                        {user ? <p className="text-gray-800 dark:text-white font-medium text-sm px-4 lg:px-5 py-2 lg:py-2.5">{user.displayName}</p> : null}
                            {user.providerData[0].providerId === "password" && (
                                
                            <button data-testid="settings_button" className="mr-5" onClick={openModal}>
                                <img src={settingsLogo} alt="settings logo" className="max-w-[30px] hover:opacity-25"/>
                            </button>
                            )}
                        <SettingsModal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                        />

                        <SignOut />
                        <button data-collapse-toggle="mobile-menu-2" type="button"
                                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                aria-controls="mobile-menu-2" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clipRule="evenodd"></path>
                            </svg>
                            <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                         id="mobile-menu-2">
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <Link to="/"
                                      className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:text-orange-400 lg:border-0 lg:p-0 text-gray-100 dark:border-gray-800">{t("nav_home")}</Link>
                            </li>
                            <li>
                                <Link to="/contact"
                                      className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:text-orange-400 lg:border-0 lg:p-0 text-gray-100 dark:border-gray-800">{t("nav_contact")}</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
function SettingsModal({ isOpen, onRequestClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { t } = useTranslation();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleSaveChanges = () => {
        console.log('Email:', email);
        console.log('Password::', password);
    };

    const deleteUser = async() => {
        
        
        // delete feedback from users courses
        const myFeedbacks = feedbackRef.where("uid", "==", auth.currentUser.uid);

        myFeedbacks.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("Deleting feedback: ", doc.id);
                    doc.ref.delete();
                });
            })
            .catch((error) => {
                console.error("Error deleting feedback: ", error);
            });
        
        // delete courses owned by user
        const myCourses = coursesRef.where("uid", "==", auth.currentUser.uid);
        
        
        myCourses.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("Deleting course: ", doc.id);
                    doc.ref.delete();
                });
            })
            .catch((error) => {
                console.error("Error deleting courses: ", error);
            });
        // delete user document

        usersRef.doc(auth.currentUser.uid).delete()

        auth.currentUser.delete();

    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="modal"
            overlayClassName="overlay"
        >
            <div id="defaultModal" className="overflow-y-auto overflow-x-hidden outline-none bg-gray-700 rounded-lg shadow dark:bg-gray-700 w-[500px] min-w-[200px]">
                <div className="relative w-auto p-4 border-b rounded-t dark:border-gray-600">
                    <div className="flex items-center justify-center mb-5">
                        <h2 className="text-2xl font-semibold text-white mb-5">{t("user_settings")}</h2>
                        <button type="button"
                                onClick={onRequestClose}
                                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-hide="authentication-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 m-2">
                        <label htmlFor="email" className="text-white font-medium m-2">
                            {t("change_email")}:
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Email"
                            value={null} // {email}
                            onChange={null} // {handleEmailChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 m-2">
                        <label htmlFor="password" className="text-white block font-medium m-2">
                            {t("change_password")}:
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-300"
                            placeholder="Password"
                            value={null} // {password}
                            onChange={null} // {handlePasswordChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 justify-center mt-5">
                        <button
                            className="text-white m-auto max-w-[200px] col-span-2 m-2 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={null} // {handleSaveChanges}
                        >
                            {t("save_changes")}

                        </button>
                    </div>
                    <div className="grid grid-cols-2 justify-center mt-5">
                        <button
                            data-testid="delete_user_button"
                            className="text-white m-auto max-w-[200px] col-span-2 m-2 bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                            onClick={deleteUser} // {handleSaveChanges}
                        >
                            {t("delete_user")}

                        </button>
                    </div>

                </div>
            </div>
        </Modal>
    );
}


export default HeaderProfile