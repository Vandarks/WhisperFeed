import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

// "Inline" English and Arabic translations.
// We can localize to any language and any number of languages.

const resources = {
    en: {
        translation: {
            app_name: "Whisperfeed",
        },
    },
    ar: {
        translation: {
            app_name: "جروتباسكت",
        },
    },
    fi: {
        translation: {
            app_name: "Whisperfeed",
            nav_home: "Koti"
        }
    }
};

i18next
    .use(initReactI18next)
    .use(HttpApi)   // register back-end plugin
    .init({
        lng: "en",
        supportedLngs: ["en", "ar", "fi"],
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
        debug: process.env.NODE_ENV === "development",
    });

export default i18next;