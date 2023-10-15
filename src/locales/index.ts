import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import en from './en.json';

i18next.use(initReactI18next).init({
  ns: ['lang'],
  defaultNS: 'lang',
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: {
      lang: en,
    },

  },
});
