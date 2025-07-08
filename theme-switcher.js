document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;

  const THEME_KEY = 'selected_theme';
  const LIGHT_THEME_CLASS = 'light-theme';
  const DARK_THEME_CLASS = 'dark-theme';

  window.updateThemeButtonAppearance = function() {
    if (!themeToggleBtn) return; 

    if (body.classList.contains(LIGHT_THEME_CLASS)) {
      themeToggleBtn.textContent = window.getTranslationForKey ? window.getTranslationForKey('switchToDarkMode') : 'Switch to Dark Mode'; // 🌙
    } else {
      themeToggleBtn.textContent = window.getTranslationForKey ? window.getTranslationForKey('switchToLightMode') : 'Switch to Light Mode'; //☀️
    }
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      body.classList.add(LIGHT_THEME_CLASS);
      body.classList.remove(DARK_THEME_CLASS);
    } else {
      body.classList.add(DARK_THEME_CLASS);
      body.classList.remove(LIGHT_THEME_CLASS);
    }
    localStorage.setItem(THEME_KEY, theme);
    window.updateThemeButtonAppearance();
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      if (body.classList.contains(LIGHT_THEME_CLASS)) {
        applyTheme('dark');
      } else {
        applyTheme('light');
      }
    });
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    window.updateThemeButtonAppearance();
  }

  console.log("Theme switcher script initialized.");
});
