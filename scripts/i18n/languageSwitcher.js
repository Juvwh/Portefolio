(function initLanguageSwitcher(global) {
  const translationService = global.translationService;
  if (!translationService) {
    console.error('Translation service is not available.');
    return;
  }

  const {
    getActiveLanguage,
    setActiveLanguage,
    translate,
    onLanguageChange,
    getSupportedLanguages
  } = translationService;

  const LANGUAGE_BUTTON_ACTIVE_CLASS = 'active-lang';

  function isValidTranslation(value) {
  return value !== undefined && !String(value).startsWith('MissingKey');
}

function updateMetaTag(selector, attribute, key, language) {
  const tag = document.querySelector(selector);
  if (!tag) {
    console.warn(`Meta tag not found with selector: ${selector}`);
    return;
  }

  const translation = translate(key, language);
  if (isValidTranslation(translation)) {
    tag.setAttribute(attribute, translation);
  } else {
    console.warn(`Meta translation not found for key: ${key} in language: ${language}`);
  }
}

function updateDocumentTitle(language) {
  const title = translate('docTitle', language);
  if (isValidTranslation(title)) {
    document.title = title;
  }
}

function applyTranslationsToDom(language) {
  document.querySelectorAll('[data-translate-key]').forEach((element) => {
    const key = element.getAttribute('data-translate-key');
    const translation = translate(key, language);
    if (isValidTranslation(translation)) {
      element.innerHTML = translation;
    } else {
      console.warn(`Translation not found for key: ${key} in language: ${language}`);
    }
  });

  document.querySelectorAll('[data-translate-aria-label-key]').forEach((element) => {
    const key = element.getAttribute('data-translate-aria-label-key');
    const translation = translate(key, language);
    if (isValidTranslation(translation)) {
      element.setAttribute('aria-label', translation);
    } else {
      console.warn(`ARIA label translation not found for key: ${key} in language: ${language}`);
    }
  });
}

function updateMetaTags(language) {
  updateMetaTag('meta[name="description"]', 'content', 'metaDescription', language);
  updateMetaTag('meta[name="keywords"]', 'content', 'metaKeywords', language);
  updateMetaTag('meta[property="og:title"]', 'content', 'ogTitle', language);
  updateMetaTag('meta[property="og:description"]', 'content', 'ogDescription', language);
  updateMetaTag('meta[property="og:locale"]', 'content', 'ogLocale', language);
  updateMetaTag('meta[name="twitter:title"]', 'content', 'twitterTitle', language);
  updateMetaTag('meta[name="twitter:description"]', 'content', 'twitterDescription', language);
  updateMetaTag('link[rel="canonical"]', 'href', 'canonicalUrl', language);
}

function updateLanguageButtonStates(language, buttons) {
  buttons.forEach((button) => {
    if (!button) {
      return;
    }

    const buttonLang = button.getAttribute('data-lang');
    if (buttonLang === language) {
      button.classList.add(LANGUAGE_BUTTON_ACTIVE_CLASS);
    } else {
      button.classList.remove(LANGUAGE_BUTTON_ACTIVE_CLASS);
    }
  });
}

function handleLanguageChange(language, buttons) {
  document.documentElement.lang = language;
  updateDocumentTitle(language);
  updateMetaTags(language);
  applyTranslationsToDom(language);
  updateLanguageButtonStates(language, buttons);
}

function getLanguageButtons() {
  return Array.from(document.querySelectorAll('.language-switcher [data-lang]'));
}

function bindLanguageButtons(buttons) {
  const supported = new Set(getSupportedLanguages());

  buttons.forEach((button) => {
    const language = button.getAttribute('data-lang');
    if (!supported.has(language)) {
      button.disabled = true;
      console.warn(`Language ${language} is not supported by the translation service.`);
      return;
    }

    button.addEventListener('click', () => {
      setActiveLanguage(language);
    });
  });
}

  function initializeLanguageSwitcher() {
    const buttons = getLanguageButtons();
    if (!buttons.length) {
      console.error('Language switcher buttons not found.');
      return;
    }

  onLanguageChange((language) => handleLanguageChange(language, buttons));

  bindLanguageButtons(buttons);

  const currentLanguage = getActiveLanguage();
  handleLanguageChange(currentLanguage, buttons);
  setActiveLanguage(currentLanguage, { notify: true, force: true });
}

  function bootstrapLanguageSwitcher() {
    initializeLanguageSwitcher();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapLanguageSwitcher, { once: true });
  } else {
    bootstrapLanguageSwitcher();
  }
  global.initializeLanguageSwitcher = initializeLanguageSwitcher;
})(typeof window !== 'undefined' ? window : this);
