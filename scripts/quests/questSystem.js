(function initQuestSystem(global) {
  const translationService = global.translationService;
  const QUEST_STORAGE_KEY = 'quest_progress_state_v1';

  const QUEST_DEFINITIONS = [
    {
      id: 'recruiter-loot',
      titleKey: 'questRecruiterLootTitle',
      descriptionKey: 'questRecruiterLootDescription',
      icon: 'fa-solid fa-briefcase',
      fallbackTitle: "Recruiter's Loot",
      fallbackDescription: 'Download the CV to claim the recruiter loot.'
    },
    {
      id: 'diver',
      titleKey: 'questDiverTitle',
      descriptionKey: 'questDiverDescription',
      icon: 'fa-solid fa-water',
      fallbackTitle: 'Diver',
      fallbackDescription: 'Open a project modal to dive deeper.'
    },
    {
      id: 'detective',
      titleKey: 'questDetectiveTitle',
      descriptionKey: 'questDetectiveDescription',
      icon: 'fa-solid fa-user-secret',
      fallbackTitle: 'Private Investigator',
      fallbackDescription: 'Visit the social links to investigate further.'
    },
    {
      id: 'theme-mage',
      titleKey: 'questThemeMageTitle',
      descriptionKey: 'questThemeMageDescription',
      icon: 'fa-solid fa-wand-sparkles',
      fallbackTitle: 'Theme Sorcerer',
      fallbackDescription: 'Swap the site theme between light and dark.'
    },
    {
      id: 'polyglot',
      titleKey: 'questPolyglotTitle',
      descriptionKey: 'questPolyglotDescription',
      icon: 'fa-solid fa-language',
      fallbackTitle: 'Polyglot',
      fallbackDescription: 'Change the website language.'
    },
    {
      id: 'konami',
      titleKey: 'questKonamiTitle',
      descriptionKey: 'questKonamiDescription',
      icon: 'fa-solid fa-keyboard',
      fallbackTitle: 'The Cheat Code',
      fallbackDescription: 'Enter the famous Konami Code on your keyboard.'
    }
  ];

  class QuestSystem {
    constructor() {
      this.state = this.loadState();
      this.totalQuests = QUEST_DEFINITIONS.length;
      this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
      this.konamiIndex = 0;
      this.currentTheme = this.getCurrentTheme();
      this.currentLanguage = translationService?.getActiveLanguage?.() ?? 'en';
      this.lastLanguage = this.currentLanguage;

      this.journalOverlay = null;
      this.progressBar = null;
      this.progressLabel = null;
      this.questList = null;
      this.triggerButton = null;
      this.toastContainer = null;

      this.boundCloseOnEscape = (event) => {
        if (event.key === 'Escape' && this.journalOverlay?.classList.contains('active')) {
          this.toggleJournal(false);
        }
      };
    }

    init() {
      if (!document.body) {
        return;
      }

      this.renderUI();
      this.registerEventListeners();
      this.updateUI();
    }

    loadState() {
      try {
        const stored = localStorage.getItem(QUEST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        }
      } catch (error) {
        console.warn('Unable to load quest progress from storage.', error);
      }
      return { completed: {} };
    }

    persistState() {
      try {
        localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(this.state));
      } catch (error) {
        console.warn('Unable to persist quest progress to storage.', error);
      }
    }

    translate(key, fallback) {
      if (!translationService) {
        return fallback;
      }

      const activeLanguage = translationService.getActiveLanguage?.() ?? this.currentLanguage;
      const value = translationService.translate?.(key, activeLanguage);
      if (!value || String(value).startsWith('MissingKey')) {
        return fallback;
      }
      return value;
    }

    getCurrentTheme() {
      return document.body.classList.contains('light-theme') ? 'light' : 'dark';
    }

    renderUI() {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'quest-toast-container';
      this.toastContainer.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.toastContainer);

      this.triggerButton = document.createElement('button');
      this.triggerButton.className = 'quest-floating-button';
      this.triggerButton.type = 'button';
      this.triggerButton.setAttribute('aria-expanded', 'false');
      this.triggerButton.setAttribute('aria-controls', 'quest-journal-panel');
      this.triggerButton.innerHTML = `
        <span class="quest-floating-button__icon" aria-hidden="true"><i class="fa-solid fa-scroll"></i></span>
        <span class="quest-floating-button__label"></span>
        <span class="quest-floating-button__progress"></span>
      `;
      document.body.appendChild(this.triggerButton);

      this.journalOverlay = document.createElement('div');
      this.journalOverlay.className = 'quest-journal-overlay';
      this.journalOverlay.id = 'quest-journal-overlay';
      this.journalOverlay.innerHTML = `
        <div class="quest-journal" role="dialog" aria-modal="true" id="quest-journal-panel">
          <div class="quest-journal__header">
            <div>
              <p class="quest-journal__eyebrow">${this.translate('questProgressLabel', 'Quest progress')}</p>
              <h3 class="quest-journal__title"></h3>
            </div>
            <button class="quest-journal__close" type="button" aria-label="${this.translate('questCloseLabel', 'Close quest journal')}">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="quest-journal__progress">
            <div class="quest-journal__progress-text"></div>
            <div class="quest-journal__progress-bar">
              <span class="quest-journal__progress-fill" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></span>
            </div>
          </div>
          <div class="quest-list" aria-live="polite"></div>
        </div>
      `;
      document.body.appendChild(this.journalOverlay);

      this.progressBar = this.journalOverlay.querySelector('.quest-journal__progress-fill');
      this.progressLabel = this.journalOverlay.querySelector('.quest-journal__progress-text');
      this.questList = this.journalOverlay.querySelector('.quest-list');

      this.triggerButton.addEventListener('click', () => this.toggleJournal());
      this.journalOverlay.addEventListener('click', (event) => {
        if (event.target === this.journalOverlay) {
          this.toggleJournal(false);
        }
      });
      const closeButton = this.journalOverlay.querySelector('.quest-journal__close');
      closeButton?.addEventListener('click', () => this.toggleJournal(false));
    }

    toggleJournal(forceState) {
      const shouldOpen = typeof forceState === 'boolean' ? forceState : !this.journalOverlay.classList.contains('active');
      this.journalOverlay.classList.toggle('active', shouldOpen);
      this.triggerButton?.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');

      if (shouldOpen) {
        document.addEventListener('keydown', this.boundCloseOnEscape);
      } else {
        document.removeEventListener('keydown', this.boundCloseOnEscape);
      }
    }

    registerEventListeners() {
      document.addEventListener('keydown', (event) => this.handleKonamiInput(event));

      this.bindCvDownloads();
      this.bindSocialLinks();
      this.bindModalOpenEvents();
      this.observeThemeChanges();
      this.observeLanguageChanges();
    }

    bindCvDownloads() {
      const cvLinks = document.querySelectorAll('a[download][href*="Resume"], a.btn-cv');
      cvLinks.forEach((link) => {
        link.addEventListener('click', () => this.completeQuest('recruiter-loot'));
      });
    }

    bindSocialLinks() {
      const selectors = [
        'a[href*="linkedin.com"]',
        'a[href*="github.com"]'
      ];
      const links = document.querySelectorAll(selectors.join(','));
      links.forEach((link) => {
        link.addEventListener('click', () => this.completeQuest('detective'));
      });
    }

    bindModalOpenEvents() {
      document.addEventListener('projectModalOpened', () => this.completeQuest('diver'));
    }

    observeThemeChanges() {
      const observer = new MutationObserver(() => {
        const newTheme = this.getCurrentTheme();
        if (newTheme !== this.currentTheme) {
          this.currentTheme = newTheme;
          this.completeQuest('theme-mage');
        }
      });

      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    observeLanguageChanges() {
      if (!translationService?.onLanguageChange) {
        return;
      }

      translationService.onLanguageChange((language) => {
        const previousLanguage = this.lastLanguage;
        this.currentLanguage = language;
        this.lastLanguage = language;
        this.updateUI();

        if (previousLanguage && previousLanguage !== language) {
          this.completeQuest('polyglot');
        }
      });
    }

    handleKonamiInput(event) {
      const expectedKey = this.konamiSequence[this.konamiIndex];
      if (event.key === expectedKey) {
        this.konamiIndex += 1;
        if (this.konamiIndex === this.konamiSequence.length) {
          this.completeQuest('konami');
          this.konamiIndex = 0;
        }
      } else {
        this.konamiIndex = 0;
      }
    }

    completeQuest(questId) {
      if (!questId || this.state.completed[questId]) {
        return;
      }

      this.state.completed[questId] = Date.now();
      this.persistState();
      this.updateUI();
      this.showToast(questId);
    }

    updateUI() {
      this.updateTexts();
      this.updateProgress();
      this.renderQuestList();
    }

    updateTexts() {
      const completedCount = this.getCompletedCount();
      const buttonLabel = this.translate('questButtonLabel', 'Quest Log');
      const questTitle = this.translate('questLogTitle', 'Quest Journal');
      const buttonProgress = `${completedCount}/${this.totalQuests}`;

      const buttonLabelElement = this.triggerButton?.querySelector('.quest-floating-button__label');
      const buttonProgressElement = this.triggerButton?.querySelector('.quest-floating-button__progress');

      if (buttonLabelElement) {
        buttonLabelElement.textContent = buttonLabel;
      }
      if (buttonProgressElement) {
        buttonProgressElement.textContent = buttonProgress;
      }

      const titleElement = this.journalOverlay?.querySelector('.quest-journal__title');
      if (titleElement) {
        titleElement.textContent = questTitle;
      }

      const closeButton = this.journalOverlay?.querySelector('.quest-journal__close');
      if (closeButton) {
        closeButton.setAttribute('aria-label', this.translate('questCloseLabel', 'Close quest journal'));
      }
    }

    updateProgress() {
      const completedCount = this.getCompletedCount();
      const progressText = `${this.translate('questProgressLabel', 'Quest progress')}: ${completedCount}/${this.totalQuests}`;

      if (this.progressLabel) {
        this.progressLabel.textContent = progressText;
      }

      if (this.progressBar) {
        const percentage = Math.round((completedCount / this.totalQuests) * 100);
        this.progressBar.style.width = `${percentage}%`;
        this.progressBar.setAttribute('aria-valuenow', String(percentage));
      }
    }

    renderQuestList() {
      if (!this.questList) {
        return;
      }

      this.questList.innerHTML = '';

      QUEST_DEFINITIONS.forEach((quest) => {
        const isCompleted = Boolean(this.state.completed[quest.id]);
        const questItem = document.createElement('article');
        questItem.className = `quest-card${isCompleted ? ' completed' : ''}`;

        const title = this.translate(quest.titleKey, quest.fallbackTitle);
        const description = this.translate(quest.descriptionKey, quest.fallbackDescription);
        const statusLabel = isCompleted
          ? this.translate('questStatusCompleted', 'Completed')
          : this.translate('questStatusLocked', 'Locked');

        questItem.innerHTML = `
          <div class="quest-card__icon" aria-hidden="true"><i class="${quest.icon}"></i></div>
          <div class="quest-card__content">
            <div class="quest-card__title-row">
              <h4 class="quest-card__title">${title}</h4>
              <span class="quest-card__status">${statusLabel}</span>
            </div>
            <p class="quest-card__description">${description}</p>
          </div>
        `;

        this.questList.appendChild(questItem);
      });
    }

    showToast(questId) {
      if (!this.toastContainer) {
        return;
      }

      const quest = QUEST_DEFINITIONS.find((entry) => entry.id === questId);
      const title = quest ? this.translate(quest.titleKey, quest.fallbackTitle) : '';
      const toastText = `${this.translate('questToastUnlocked', 'Quest unlocked')}: ${title}`;

      const toast = document.createElement('div');
      toast.className = 'quest-toast';
      toast.innerHTML = `
        <div class="quest-toast__icon" aria-hidden="true"><i class="fa-solid fa-trophy"></i></div>
        <div class="quest-toast__content">
          <p class="quest-toast__eyebrow">${this.translate('questToastTitle', 'Achievement unlocked')}</p>
          <p class="quest-toast__message">${toastText}</p>
        </div>
      `;

      this.toastContainer.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add('visible');
      });

      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    getCompletedCount() {
      return Object.keys(this.state.completed || {}).length;
    }
  }

  function bootstrapQuestSystem() {
    const questSystem = new QuestSystem();
    questSystem.init();
    global.questSystem = questSystem;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapQuestSystem, { once: true });
  } else {
    bootstrapQuestSystem();
  }
})(typeof window !== 'undefined' ? window : this);
