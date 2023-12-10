import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import PasswordAlert from "../Alerts/PasswordAlert";
import LanguageSwitcher from "../Layout/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function SignInForm({ onSignUpClick }) {

    const { t } = useTranslation();

    const SignIn = (e) => {
        e.preventDefault();
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError("Invalid username or password");
            });
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    //login username or password error state
    const [error, setError] = useState("");

    return (
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 data-testid="sign_in_header" className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    {t("sign_in_header")}
                </h1>
                <form onSubmit={SignIn} className="space-y-4 md:space-y-6" action="#">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t("your_email")}</label>
                        <input data-testid="email_input" type="email" name="email" id="email" value={email} onChange={handleEmailChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="name@company.com" required="" />
                    </div>
                    <div>
                        <label htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t("password")}</label>
                        <input data-testid="password_input" type="password" name="password" id="password" placeholder="••••••••" value={password} onChange={handlePasswordChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required="" />
                        {error && <PasswordAlert message={error} />}
                    </div>
                    <div className="flex items-center justify-between">
                        <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">{t("forgot_password")}</a>
                    </div>
                    <button
                        data-testid="sign_in_button"
                        type="submit"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        {t("sign_in")}
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        {t("no_account_yet")}
                        <a href="#" data-testid="sign_up_link" onClick={onSignUpClick} className="font-medium text-primary-600 hover:underline dark:text-primary-500"> {t("sign_up")}</a>
                    </p>
                    <div className="text-black w-1/3">
                        <LanguageSwitcher />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignInForm