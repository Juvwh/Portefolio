document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;

  const THEME_KEY = 'selected_theme';
  const LIGHT_THEME_CLASS = 'light-theme';
  const DARK_THEME_CLASS = 'dark-theme';

  const DEFAULT_LABELS = {
    switchToDarkMode: 'Switch to Dark Mode',
    switchToLightMode: 'Switch to Light Mode',
  };

  function getTranslatedLabel(key) {
    const translationGetter = typeof window.getTranslationForKey === 'function'
      ? window.getTranslationForKey
      : null;

    if (translationGetter) {
      const translation = translationGetter(key);
      if (translation && !translation.startsWith('MissingKey')) {
        return translation;
      }
    }

    return DEFAULT_LABELS[key];
  }

  function setButtonLabel(key) {
    if (!themeToggleBtn) {
      return;
    }

    themeToggleBtn.setAttribute('data-translate-key', key);
    themeToggleBtn.textContent = getTranslatedLabel(key) || DEFAULT_LABELS[key];
  }

  // Function to update button text/icon based on current theme
  function updateButtonAppearance() {
    if (!themeToggleBtn) {
      return;
    }

    if (body.classList.contains(LIGHT_THEME_CLASS)) {
      setButtonLabel('switchToDarkMode');
    } else {
      setButtonLabel('switchToLightMode');
    }
  }

  // Function to apply a specific theme
  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.add(LIGHT_THEME_CLASS);
      body.classList.remove(DARK_THEME_CLASS);
    } else {
      body.classList.add(DARK_THEME_CLASS);
      body.classList.remove(LIGHT_THEME_CLASS);
    }
    localStorage.setItem(THEME_KEY, theme);
    updateButtonAppearance();
  }

  // Event listener for the toggle button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (body.classList.contains(LIGHT_THEME_CLASS)) {
        applyTheme('dark');
      } else {
        applyTheme('light');
      }
    });
  }

  // Load and apply saved theme preference on script load
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // If no saved theme, ensure current body class matches button state
    // The body already has 'dark-theme' by default from HTML
    updateButtonAppearance();
  }

  window.updateThemeButtonAppearance = updateButtonAppearance;

  console.log("Theme switcher script initialized.");
});
