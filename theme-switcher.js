document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;

  const THEME_KEY = 'selected_theme';
  const LIGHT_THEME_CLASS = 'light-theme';
  const DARK_THEME_CLASS = 'dark-theme';
  const VALID_THEMES = new Set(['light', 'dark']);

  if (!themeToggleBtn) {
    console.warn('Theme toggle button not found.');
    return;
  }

  const getCurrentLanguage = () => document.documentElement.lang || 'en';

  const getTranslation = (key) => {
    const lang = getCurrentLanguage();
    const fallback = key === 'switchToDarkMode' ? 'Switch to Dark Mode' : 'Switch to Light Mode';

    if (typeof window.getTranslationForKey === 'function') {
      const translation = window.getTranslationForKey(key, lang);
      if (translation && !String(translation).startsWith('MissingKey')) {
        return translation;
      }
    }

    if (typeof translations !== 'undefined') {
      return translations?.[lang]?.[key] || fallback;
    }

    return fallback;
  };

  function updateThemeButtonAppearance() {
    const isLightTheme = body.classList.contains(LIGHT_THEME_CLASS);
    const translationKey = isLightTheme ? 'switchToDarkMode' : 'switchToLightMode';

    themeToggleBtn.setAttribute('data-translate-key', translationKey);
    themeToggleBtn.textContent = getTranslation(translationKey);
  }

  function applyTheme(theme, { persist = true } = {}) {
    if (!VALID_THEMES.has(theme)) {
      console.warn(`Ignored invalid theme value: ${theme}`);
      updateThemeButtonAppearance();
      return;
    }

    if (theme === 'light') {
      body.classList.add(LIGHT_THEME_CLASS);
      body.classList.remove(DARK_THEME_CLASS);
    } else {
      body.classList.add(DARK_THEME_CLASS);
      body.classList.remove(LIGHT_THEME_CLASS);
    }
    if (persist) {
      localStorage.setItem(THEME_KEY, theme);
    }
    updateThemeButtonAppearance();
  }

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains(LIGHT_THEME_CLASS)) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  });

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (VALID_THEMES.has(savedTheme)) {
    applyTheme(savedTheme);
  } else {
    updateThemeButtonAppearance();
  }

  document.addEventListener('languagechange', updateThemeButtonAppearance);

  window.addEventListener('storage', (event) => {
    if (event.key === THEME_KEY) {
      const newTheme = event.newValue;
      if (VALID_THEMES.has(newTheme)) {
        applyTheme(newTheme, { persist: false });
      } else if (!newTheme) {
        updateThemeButtonAppearance();
      }
    }
  });

  window.updateThemeButtonAppearance = updateThemeButtonAppearance;

  console.log('Theme switcher script initialized.');
});
