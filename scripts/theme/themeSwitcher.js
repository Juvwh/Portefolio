(function initThemeSwitcher(global) {
  const translationService = global.translationService;
  if (!translationService) {
    console.error('Translation service is not available for theme switching.');
    return;
  }

  const { translate, getActiveLanguage, onLanguageChange } = translationService;

  const THEME_STORAGE_KEY = 'selected_theme';
  const LIGHT_THEME_CLASS = 'light-theme';
  const DARK_THEME_CLASS = 'dark-theme';
  const VALID_THEMES = new Set(['light', 'dark']);

  const FALLBACK_LABELS = {
    switchToDarkMode: 'Switch to Dark Mode',
    switchToLightMode: 'Switch to Light Mode'
  };

  class ThemeSwitcher {
  #buttonId;
  #storageKey;
  #themeToggleButton = null;
  #languageChangeUnsubscribe = null;
  #storageListener = null;
  #boundToggleHandler = null;
  #currentLanguage = getActiveLanguage();

  constructor({ buttonId = 'theme-toggle-btn', storageKey = THEME_STORAGE_KEY } = {}) {
    this.#buttonId = buttonId;
    this.#storageKey = storageKey;
  }

  initialize() {
    this.#themeToggleButton = document.getElementById(this.#buttonId);
    if (!this.#themeToggleButton) {
      console.warn('Theme toggle button not found.');
      return;
    }

    this.#boundToggleHandler = () => this.#handleToggleClick();
    this.#themeToggleButton.addEventListener('click', this.#boundToggleHandler);

    this.#languageChangeUnsubscribe = onLanguageChange((language) => this.#handleLanguageChange(language));
    this.#currentLanguage = getActiveLanguage();

    const savedTheme = this.#readStoredTheme();
    if (VALID_THEMES.has(savedTheme)) {
      this.applyTheme(savedTheme);
    } else {
      this.#updateThemeButtonAppearance();
    }

    this.#handleLanguageChange(this.#currentLanguage);

    this.#storageListener = (event) => {
      if (event.key === this.#storageKey) {
        this.#handleStorageChange(event);
      }
    };

    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('storage', this.#storageListener);
    }
  }

  destroy() {
    if (this.#themeToggleButton && this.#boundToggleHandler) {
      this.#themeToggleButton.removeEventListener('click', this.#boundToggleHandler);
    }

    this.#boundToggleHandler = null;

    if (this.#languageChangeUnsubscribe) {
      this.#languageChangeUnsubscribe();
      this.#languageChangeUnsubscribe = null;
    }

    if (this.#storageListener) {
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('storage', this.#storageListener);
      }
      this.#storageListener = null;
    }

    this.#themeToggleButton = null;
  }

  applyTheme(theme, { persist = true } = {}) {
    if (!VALID_THEMES.has(theme)) {
      console.warn(`Ignored invalid theme value: ${theme}`);
      this.#updateThemeButtonAppearance();
      return;
    }

    const body = document.body;
    if (theme === 'light') {
      body.classList.add(LIGHT_THEME_CLASS);
      body.classList.remove(DARK_THEME_CLASS);
    } else {
      body.classList.add(DARK_THEME_CLASS);
      body.classList.remove(LIGHT_THEME_CLASS);
    }

    if (persist) {
      this.#persistTheme(theme);
    }

    this.#updateThemeButtonAppearance();
  }

  #handleToggleClick() {
    const body = document.body;
    if (body.classList.contains(LIGHT_THEME_CLASS)) {
      this.applyTheme('dark');
    } else {
      this.applyTheme('light');
    }
  }

  #handleLanguageChange(language) {
    this.#currentLanguage = language;
    this.#updateThemeButtonAppearance();
  }

  #updateThemeButtonAppearance() {
    if (!this.#themeToggleButton) {
      return;
    }

    const isLightTheme = document.body.classList.contains(LIGHT_THEME_CLASS);
    const translationKey = isLightTheme ? 'switchToDarkMode' : 'switchToLightMode';
    const translation = translate(translationKey, this.#currentLanguage);
    const label = translation && !String(translation).startsWith('MissingKey')
      ? translation
      : FALLBACK_LABELS[translationKey];

    this.#themeToggleButton.setAttribute('data-translate-key', translationKey);
    this.#themeToggleButton.textContent = label;
  }

  #handleStorageChange(event) {
    const newTheme = event.newValue;
    if (VALID_THEMES.has(newTheme)) {
      this.applyTheme(newTheme, { persist: false });
    } else if (!newTheme) {
      this.#updateThemeButtonAppearance();
    }
  }

  #persistTheme(theme) {
    try {
      localStorage.setItem(this.#storageKey, theme);
    } catch (error) {
      console.warn('Unable to persist theme preference.', error);
    }
  }

  #readStoredTheme() {
    try {
      return localStorage.getItem(this.#storageKey);
    } catch (error) {
      console.warn('Unable to read stored theme preference.', error);
      return null;
    }
  }
  }

  const defaultThemeSwitcher = new ThemeSwitcher();

  function bootstrapThemeSwitcher() {
    defaultThemeSwitcher.initialize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapThemeSwitcher, { once: true });
  } else {
    bootstrapThemeSwitcher();
  }

  global.ThemeSwitcher = ThemeSwitcher;
  global.defaultThemeSwitcher = defaultThemeSwitcher;
})(typeof window !== 'undefined' ? window : this);
