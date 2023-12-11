import React from "react";
import {useTranslation} from "react-i18next";
import {auth, usersRef} from "../../firebaseConfig";

function LanguageSwitcher() {

    const {i18n} = useTranslation();
    const { t } = useTranslation();
    let currentUserRef = null;

    if(auth.currentUser != null){
        currentUserRef = usersRef.doc(auth.currentUser.uid);
        currentUserRef.get().then((doc) => {
            if (doc.exists) {
                const languagePref = doc.data().languagePreference;
                console.log("Fetched language (" + languagePref + ") from DB")
                if(languagePref != i18n.language){
                    i18n.changeLanguage(languagePref)
                }
            }
        })
    }

    return (

        <div data-testid='language_selector' className="select">
            <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={i18n.language}
                onChange={(e) =>
                    updateLanguage(e)
                }
            >
                <option disabled selected>{t("select_tag_language")}</option>
                <option value="en">English</option>
                <option value="fi">Finnish</option>
                <option value="ar">عربي</option>
            </select>
        </div>
    );

    function updateLanguage(e) {
        console.log("Updating language to " + e.target.value)
        i18n.changeLanguage(e.target.value)
        if (currentUserRef != null) {
            currentUserRef.update({
                languagePreference: e.target.value
            });
        }
    }
}

export default LanguageSwitcher;