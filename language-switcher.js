import { translations } from './translations.js';

const supportedLanguages = ['en', 'fr'];
let currentLanguage = 'en';
let langEnBtn = null;
let langFrBtn = null;

const languageChangeListeners = new Set();

function getDefaultLanguage() {
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang && supportedLanguages.includes(savedLang)) {
    return savedLang;
  }

  const browserLang = navigator.language.split('-')[0];
  if (supportedLanguages.includes(browserLang)) {
    return browserLang;
  }

  return 'en';
}

function updateMetaTag(selector, attribute, key) {
  const tag = document.querySelector(selector);
  if (!tag) {
    console.warn(`Meta tag not found with selector: ${selector}`);
    return;
  }

  const translation = translations[currentLanguage]?.[key];
  if (translation) {
    tag.setAttribute(attribute, translation);
  } else {
    console.warn(`Meta translation not found for key: ${key} in language: ${currentLanguage}`);
  }
}

function updateLanguageButtonStates() {
  if (!langEnBtn || !langFrBtn) {
    return;
  }

  if (currentLanguage === 'en') {
    langEnBtn.classList.add('active-lang');
    langFrBtn.classList.remove('active-lang');
  } else if (currentLanguage === 'fr') {
    langFrBtn.classList.add('active-lang');
    langEnBtn.classList.remove('active-lang');
  }
}

function notifyLanguageChange() {
  const event = new CustomEvent('languagechange', {
    detail: { language: currentLanguage }
  });
  document.dispatchEvent(event);

  languageChangeListeners.forEach((listener) => {
    try {
      listener(currentLanguage);
    } catch (error) {
      console.error('Error in language change listener', error);
    }
  });
}

function applyTranslationsToDom() {
  document.querySelectorAll('[data-translate-key]').forEach((element) => {
    const key = element.getAttribute('data-translate-key');
    const translation = translations[currentLanguage]?.[key];
    if (translation !== undefined) {
      element.innerHTML = translation;
    } else {
      console.warn(`Translation not found for key: ${key} in language: ${currentLanguage}`);
    }
  });

  document.querySelectorAll('[data-translate-aria-label-key]').forEach((element) => {
    const key = element.getAttribute('data-translate-aria-label-key');
    const translation = translations[currentLanguage]?.[key];
    if (translation) {
      element.setAttribute('aria-label', translation);
    } else {
      console.warn(`ARIA label translation not found for key: ${key} in language: ${currentLanguage}`);
    }
  });
}

function updateMetaTags() {
  updateMetaTag('meta[name="description"]', 'content', 'metaDescription');
  updateMetaTag('meta[name="keywords"]', 'content', 'metaKeywords');
  updateMetaTag('meta[property="og:title"]', 'content', 'ogTitle');
  updateMetaTag('meta[property="og:description"]', 'content', 'ogDescription');
  updateMetaTag('meta[property="og:locale"]', 'content', 'ogLocale');
  updateMetaTag('meta[name="twitter:title"]', 'content', 'twitterTitle');
  updateMetaTag('meta[name="twitter:description"]', 'content', 'twitterDescription');
  updateMetaTag('link[rel="canonical"]', 'href', 'canonicalUrl');
}

function setDocumentTitle() {
  const title = translations[currentLanguage]?.docTitle;
  if (title) {
    document.title = title;
  }
}

function setLanguage(lang, { notify = true } = {}) {
  if (!supportedLanguages.includes(lang)) {
    console.error(`Language ${lang} is not supported.`);
    return;
  }

  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);
  document.documentElement.lang = lang;

  setDocumentTitle();
  updateMetaTags();
  applyTranslationsToDom();
  updateLanguageButtonStates();

  if (notify) {
    notifyLanguageChange();
  }
}

export function getTranslationForKey(key, lang = currentLanguage) {
  const translation = translations[lang]?.[key];
  if (translation !== undefined) {
    return translation;
  }
  return `MissingKey: ${key}`;
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function onLanguageChange(listener) {
  languageChangeListeners.add(listener);
  return () => languageChangeListeners.delete(listener);
}

export function initializeLanguageSwitcher() {
  langEnBtn = document.getElementById('lang-en');
  langFrBtn = document.getElementById('lang-fr');

  const defaultLanguage = getDefaultLanguage();
  setLanguage(defaultLanguage, { notify: false });

  if (langEnBtn && langFrBtn) {
    langEnBtn.addEventListener('click', () => setLanguage('en'));
    langFrBtn.addEventListener('click', () => setLanguage('fr'));
  } else {
    console.error('Language switcher buttons not found.');
  }

  notifyLanguageChange();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLanguageSwitcher, { once: true });
} else {
  initializeLanguageSwitcher();
}

export { supportedLanguages, setLanguage };
