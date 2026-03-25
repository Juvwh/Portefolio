(function initCvModal() {
  const CV_TYPES = {
    IT: 'IT_',
    GameDev: ''
  };

  const CV_LANGS = {
    FR: 'FR',
    EN: 'EN'
  };

  const CV_THEMES = {
    Light: 'Light',
    Dark: 'Dark'
  };

  // State
  let currentCvType = CV_TYPES.GameDev;
  let currentCvLang = CV_LANGS.EN;
  let currentCvTheme = CV_THEMES.Dark;

  // DOM Elements
  let cvModal;
  let cvModalCloseBtn;
  let cvModalThemeBtn;
  let cvModalLangBtn;
  let cvModalDownloadBtn;
  let cvModalIframe;
  let cvModalTriggers;

  // --- Handlers ---
  function getCvFileName() {
    return `JustinVanwichelen_${currentCvType}Resume${currentCvLang}_${currentCvTheme}.pdf`;
  }

  function getCvPath() {
    return `./index_files/${getCvFileName()}`;
  }

  function updateIframe() {
    if (!cvModalIframe) return;
    const path = getCvPath();
    cvModalIframe.src = path;
    cvModalDownloadBtn.href = path;
  }

  function updateButtonsUI() {
    // Theme Button
    if (currentCvTheme === CV_THEMES.Light) {
      cvModalThemeBtn.textContent = 'Dark 🌙';
    } else {
      cvModalThemeBtn.textContent = 'Light ☀️';
    }

    // Lang Button
    if (currentCvLang === CV_LANGS.FR) {
      cvModalLangBtn.textContent = 'EN 🇬🇧';
    } else {
      cvModalLangBtn.textContent = 'FR 🇫🇷';
    }
  }

  function toggleTheme() {
    currentCvTheme = currentCvTheme === CV_THEMES.Light ? CV_THEMES.Dark : CV_THEMES.Light;
    updateIframe();
    updateButtonsUI();
  }

  function toggleLang() {
    currentCvLang = currentCvLang === CV_LANGS.FR ? CV_LANGS.EN : CV_LANGS.FR;
    updateIframe();
    updateButtonsUI();
  }

  function openModal() {
    // Sync with global site state if translationService is available
    if (window.translationService) {
        const siteLang = window.translationService.getActiveLanguage();
        if (siteLang === 'fr') currentCvLang = CV_LANGS.FR;
        else currentCvLang = CV_LANGS.EN;
    }

    // Sync theme
    if (document.body.classList.contains('light-theme')) {
        currentCvTheme = CV_THEMES.Light;
    } else {
        currentCvTheme = CV_THEMES.Dark;
    }

    currentCvType = CV_TYPES.GameDev; // Default

    updateIframe();
    updateButtonsUI();

    cvModal.style.display = 'flex';
    // Use setTimeout to allow the browser to process the display change before animating opacity
    setTimeout(() => {
        cvModal.classList.add('active');
    }, 10);
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    cvModal.classList.remove('active');
    document.body.classList.remove('modal-open');
    cvModalIframe.src = ''; // Stop loading if it's still loading

    // Wait for the transition to finish before hiding
    setTimeout(() => {
      if (!cvModal.classList.contains('active')) {
        cvModal.style.display = 'none';
      }
    }, 300);
  }

  // --- Direct Download via URL Hash ---
  function checkDirectDownload() {
    const hash = window.location.hash.substring(1);
    if (!hash) return;

    // Expected format: IT_Light_FR, GameDev_Dark_EN, etc.
    const parts = hash.split('_');
    if (parts.length === 3) {
      const typeStr = parts[0];
      const themeStr = parts[1];
      const langStr = parts[2];

      let validHash = false;
      let targetType = '';

      if (typeStr === 'IT') { targetType = CV_TYPES.IT; validHash = true; }
      else if (typeStr === 'GameDev') { targetType = CV_TYPES.GameDev; validHash = true; }

      let targetTheme = '';
      if (themeStr === 'Light') targetTheme = CV_THEMES.Light;
      else if (themeStr === 'Dark') targetTheme = CV_THEMES.Dark;
      else validHash = false;

      let targetLang = '';
      if (langStr === 'FR') targetLang = CV_LANGS.FR;
      else if (langStr === 'EN') targetLang = CV_LANGS.EN;
      else validHash = false;

      if (validHash) {
        const fileName = `JustinVanwichelen_${targetType}Resume${targetLang}_${targetTheme}.pdf`;
        const downloadUrl = `./index_files/${fileName}`;

        // Trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Remove hash from URL without scrolling
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    }
  }

  function initElementsAndListeners() {
    cvModal = document.getElementById('cv-modal');
    cvModalCloseBtn = document.getElementById('cv-modal-close-btn');
    cvModalThemeBtn = document.getElementById('cv-modal-theme-btn');
    cvModalLangBtn = document.getElementById('cv-modal-lang-btn');
    cvModalDownloadBtn = document.getElementById('cv-modal-download-btn');
    cvModalIframe = document.getElementById('cv-modal-iframe');
    cvModalTriggers = document.querySelectorAll('.cv-modal-trigger');

    if (!cvModal) {
      console.error('CV Modal element not found');
      return;
    }

    // --- Event Listeners ---
    cvModalThemeBtn.addEventListener('click', toggleTheme);
    cvModalLangBtn.addEventListener('click', toggleLang);
    cvModalCloseBtn.addEventListener('click', closeModal);

    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cvModal.classList.contains('active')) {
        closeModal();
      }
    });

    // Also use event delegation just in case triggers are dynamic
    document.body.addEventListener('click', (e) => {
      const trigger = e.target.closest('.cv-modal-trigger');
      if (trigger) {
        e.preventDefault();
        openModal();
      }
    });

    checkDirectDownload();
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initElementsAndListeners);
  } else {
    initElementsAndListeners();
  }

})();
