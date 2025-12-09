import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslations from './locales/en.json';
import ruTranslations from './locales/ru.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';

const resources = {
    en: { translation: enTranslations },
    ru: { translation: ruTranslations },
    es: { translation: esTranslations },
    fr: { translation: frTranslations },
    de: { translation: deTranslations },
};

// Detect user's language or use stored preference
const savedLanguage = localStorage.getItem('language');
const browserLanguage = navigator.language.split('-')[0];
const defaultLanguage = savedLanguage || (resources[browserLanguage as keyof typeof resources] ? browserLanguage : 'en');

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: defaultLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('language', lng);
});

export default i18n;
