(function initThemeSwitcher(global) {
  const translationService = global.translationService;
  if (!translationService) {
    return;
  }

  const { translate, getActiveLanguage, onLanguageChange } = translationService;

  const THEME_STORAGE_KEY = 'selected_theme';
  const THEME_CLASS_LIGHT = 'theme--light';
  const THEME_CLASS_DARK = 'theme--dark';
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
        this.#updateThemeButtonAppearance();
        return;
      }

      const body = document.body;
      if (theme === 'light') {
        body.classList.add(THEME_CLASS_LIGHT);
        body.classList.remove(THEME_CLASS_DARK);
      } else {
        body.classList.add(THEME_CLASS_DARK);
        body.classList.remove(THEME_CLASS_LIGHT);
      }

      if (persist) {
        this.#persistTheme(theme);
      }

      this.#updateThemeButtonAppearance();
    }

    #handleToggleClick() {
      const body = document.body;
      if (body.classList.contains(THEME_CLASS_LIGHT)) {
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

      const isLightTheme = document.body.classList.contains(THEME_CLASS_LIGHT);
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
        // Ignored
      }
    }

    #readStoredTheme() {
      try {
        return localStorage.getItem(this.#storageKey);
      } catch (error) {
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
