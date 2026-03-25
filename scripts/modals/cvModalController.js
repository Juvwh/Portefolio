(function initCvModalController(global) {
  const document = global.document;

  class CvModalController {
    constructor() {
      this.modal = document.getElementById('cv-modal');
      this.closeBtn = document.getElementById('cv-modal-close-btn');
      this.iframe = document.getElementById('cv-iframe');
      this.downloadBtn = document.getElementById('cv-download-btn');
      this.downloadText = document.getElementById('cv-download-text');

      this.langButtons = document.querySelectorAll('.cv-modal-btn--lang');
      this.themeButtons = document.querySelectorAll('.cv-modal-btn--theme');

      this.currentLang = 'en';
      this.currentTheme = 'dark';

      this.translations = {
        en: { download: 'Download' },
        fr: { download: 'Télécharger' }
      };

      this.handleCloseClick = this.handleCloseClick.bind(this);
      this.handleOverlayClick = this.handleOverlayClick.bind(this);
      this.handleEscape = this.handleEscape.bind(this);
      this.handleLangChange = this.handleLangChange.bind(this);
      this.handleThemeChange = this.handleThemeChange.bind(this);
    }

    initialize() {
      if (!this.modal) return;
      this.registerEventListeners();
      this.checkHashForDownload();
    }

    registerEventListeners() {
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', this.handleCloseClick);
      }
      if (this.modal) {
        this.modal.addEventListener('click', this.handleOverlayClick);
      }
      document.addEventListener('keydown', this.handleEscape);

      this.langButtons.forEach(btn => btn.addEventListener('click', this.handleLangChange));
      this.themeButtons.forEach(btn => btn.addEventListener('click', this.handleThemeChange));

      const navCvLink = document.getElementById('nav-cv-link');
      if (navCvLink) {
        navCvLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.openModal();
        });
      }

      const footerCvLink = document.querySelector('.footer-cv-download .btn-cv');
      if (footerCvLink) {
        footerCvLink.addEventListener('click', (e) => {
          e.preventDefault();
          this.openModal();
        });
      }
    }

    openModal() {
      this.syncWithSiteState();
      this.updatePdfView();
      this.modal.classList.add('active');
      document.body.classList.add('modal-open');
    }

    closeModal() {
      this.modal.classList.remove('active');
      document.body.classList.remove('modal-open');
    }

    handleCloseClick() {
      this.closeModal();
    }

    handleOverlayClick(e) {
      if (e.target === this.modal) {
        this.closeModal();
      }
    }

    handleEscape(e) {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    }

    syncWithSiteState() {
      const siteLang = document.documentElement.lang || 'en';
      const siteTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';

      this.currentLang = siteLang;
      this.currentTheme = siteTheme;
    }

    updatePdfView() {
      const langUpper = this.currentLang.toUpperCase();
      const themeCapitalized = this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1);

      const fileName = `JustinVanwichelen_Resume${langUpper}_${themeCapitalized}.pdf`;
      const filePath = `./index_files/${fileName}`;

      this.iframe.src = filePath;
      this.downloadBtn.href = filePath;
      this.downloadBtn.download = fileName;

      if (this.downloadText) {
        this.downloadText.textContent = this.translations[this.currentLang]?.download || 'Download';
      }

      this.updateActiveButtons();
    }

    updateActiveButtons() {
      this.langButtons.forEach(btn => {
        if (btn.dataset.lang === this.currentLang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      this.themeButtons.forEach(btn => {
        if (btn.dataset.theme === this.currentTheme) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    handleLangChange(e) {
      const lang = e.target.dataset.lang;
      if (lang && lang !== this.currentLang) {
        this.currentLang = lang;
        this.updatePdfView();
      }
    }

    handleThemeChange(e) {
      const theme = e.target.dataset.theme;
      if (theme && theme !== this.currentTheme) {
        this.currentTheme = theme;
        this.updatePdfView();
      }
    }

    checkHashForDownload() {
      const hash = window.location.hash;
      const match = hash.match(/^#download-cv-(fr|en)-(light|dark)$/);

      if (match) {
        const lang = match[1].toUpperCase();
        const theme = match[2].charAt(0).toUpperCase() + match[2].slice(1);
        const fileName = `JustinVanwichelen_Resume${lang}_${theme}.pdf`;
        const filePath = `./index_files/${fileName}`;

        const a = document.createElement('a');
        a.href = filePath;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  }

  global.cvModalController = new CvModalController();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => global.cvModalController.initialize(), { once: true });
  } else {
    global.cvModalController.initialize();
  }
})(typeof window !== 'undefined' ? window : this);
