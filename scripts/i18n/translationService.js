import { translations as translationData } from '../../translations.js';

const LANGUAGE_STORAGE_KEY = 'preferredLanguage';
const LANGUAGE_CHANGE_EVENT = 'i18n:language-changed';

const supportedLanguages = Object.freeze(Object.keys(translationData));
let activeLanguage = null;
const languageChangeListeners = new Set();

function readStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.warn('Unable to access localStorage for language preferences.', error);
    return null;
  }
}

function persistLanguage(lang) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    console.warn('Unable to persist language preference.', error);
  }
}

function getBrowserLanguage() {
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language.split('-')[0];
  }
  return null;
}

function resolveInitialLanguage() {
  const storedLanguage = readStoredLanguage();
  if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
    return storedLanguage;
  }

  const browserLanguage = getBrowserLanguage();
  if (browserLanguage && supportedLanguages.includes(browserLanguage)) {
    return browserLanguage;
  }

  return supportedLanguages[0] ?? 'en';
}

function ensureActiveLanguage() {
  if (!activeLanguage) {
    activeLanguage = resolveInitialLanguage();
  }
  return activeLanguage;
}

function emitLanguageChange() {
  const currentLanguage = ensureActiveLanguage();
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    const event = new CustomEvent(LANGUAGE_CHANGE_EVENT, {
      detail: {
        language: currentLanguage,
        translations: translationData[currentLanguage] ?? {}
      }
    });

    window.dispatchEvent(event);
  }

  languageChangeListeners.forEach((listener) => {
    try {
      listener(currentLanguage);
    } catch (error) {
      console.error('Error in language change listener', error);
    }
  });
}

export function getSupportedLanguages() {
  return supportedLanguages;
}

export function getActiveLanguage() {
  return ensureActiveLanguage();
}

export function setActiveLanguage(lang, { notify = true, persist = true, force = false } = {}) {
  if (!supportedLanguages.includes(lang)) {
    console.error(`Language ${lang} is not supported.`);
    return;
  }

  const previousLanguage = ensureActiveLanguage();
  const hasChanged = previousLanguage !== lang;

  if (hasChanged) {
    activeLanguage = lang;
    if (persist) {
      persistLanguage(lang);
    }
  }

  if (notify && (hasChanged || force)) {
    emitLanguageChange();
  }
}

export function translate(key, lang = ensureActiveLanguage()) {
  const languageTranslations = translationData[lang];
  if (!languageTranslations) {
    console.warn(`Translations for language '${lang}' not found.`);
    return `MissingKey: ${key}`;
  }

  const translation = languageTranslations[key];
  if (translation === undefined) {
    console.warn(`Translation not found for key: ${key} in language: ${lang}`);
    return `MissingKey: ${key}`;
  }

  return translation;
}

export function onLanguageChange(listener) {
  languageChangeListeners.add(listener);
  return () => languageChangeListeners.delete(listener);
}

export { LANGUAGE_CHANGE_EVENT };

// Initialize active language immediately to keep state consistent.
ensureActiveLanguage();
