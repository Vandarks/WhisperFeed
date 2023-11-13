import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {useState} from "react";
import PasswordAlert from "../Alerts/PasswordAlert";
import {useTranslation} from "react-i18next";
import LanguageSwitcher from "../Layout/LanguageSwitcher";

function SignUpForm({ onSignInClick }) {
    const [error, setError] = useState("");
    const { t } = useTranslation();

    //Code for creating a new account in firebase
    const auth = getAuth();
    const signUp = (e) => {
        e.preventDefault();
        if(password.length >= 6 && email !== "" && firstName !== "" && lastName !== ""){
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up
                    //const user = userCredential.user;
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setError(errorMessage);
                    console.log(errorCode + " " + errorMessage)
                });
        }else {
            if(password.length < 6){
                setError("Password should be at least 6 characters long")
                console.log("Password should be at least 6 characters long");
            }else{
                setError("Please fill in all fields")
                console.log("Please fill in all fields");
            }
        }
    };

    //Code for handling form input values
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };
    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };


    return (
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    {t("sign_up_header")}
                </h1>
                <form onSubmit={signUp} className="space-y-4 md:space-y-6" action="#">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t("your_email")}</label>
                        <input type="email" name="email" id="email" value={email} onChange={handleEmailChange}
                               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="name@company.com" required=""/>
                    </div>
                    <div>
                        <label htmlFor="fname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t("first_name")}</label>
                        <input type="text" name="fname" id="fname" value={firstName} onChange={handleFirstNameChange}
                               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="First name" required=""/>
                    </div>
                    <div>
                        <label htmlFor="lname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t("last_name")}</label>
                        <input type="text" name="lname" id="lname" value={lastName} onChange={handleLastNameChange}
                               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Last name" required=""/>
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t("password")}</label>
                        <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange}
                               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="••••••••" required=""/>
                        {error && <PasswordAlert message={error}/>}
                    </div>
                    <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{t("sign_up")}</button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        {t("already_have_account")}
                        <a href="#" onClick={onSignInClick} className="font-medium text-primary-600 hover:underline dark:text-primary-500"> {t("sign_in")}</a>
                    </p>
                    <div className="text-black w-1/3">
                        <LanguageSwitcher />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUpForm