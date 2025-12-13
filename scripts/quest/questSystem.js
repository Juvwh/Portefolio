(function initQuestSystem(documentRef, windowRef) {
  const documentScope = documentRef || document;
  const windowScope = windowRef || window;
  const QUEST_EVENT = 'quest:ui-event';
  const STORAGE_KEY = 'quest:unlocked-achievements';

  const ACHIEVEMENTS = [
    {
      id: 'quest-scroll',
      title: 'Curious scroller',
      description: 'Tu as commencé à explorer la page.',
      icon: 'fa-arrow-down-long',
      condition: (state) => state.hasScrolled
    },
    {
      id: 'quest-project-hover',
      title: 'Project scout',
      description: 'Tu as inspecté un projet en le survolant.',
      icon: 'fa-magnifying-glass-arrow-right',
      condition: (state) => state.hoveredProject
    },
    {
      id: 'quest-modal-opened',
      title: 'Deep diver',
      description: 'Tu as ouvert une fiche projet détaillée.',
      icon: 'fa-folder-open',
      condition: (state) => state.openedModal
    },
    {
      id: 'quest-bottom-reached',
      title: 'Completionist',
      description: 'Tu as atteint le bas de la page.',
      icon: 'fa-flag-checkered',
      condition: (state) => state.reachedBottom
    },
    {
      id: 'quest-language-switch',
      title: 'Globetrotter',
      description: 'Tu as changé la langue du portfolio.',
      icon: 'fa-language',
      condition: (state) => state.languageSwitched
    }
  ];

  const questStore = {
    state: {
      hasScrolled: false,
      hoveredProject: false,
      openedModal: false,
      reachedBottom: false,
      languageSwitched: false
    },
    unlocked: new Set(loadUnlockedAchievements()),
    subscribers: [],
    subscribe(callback) {
      if (typeof callback === 'function') {
        this.subscribers.push(callback);
      }
    },
    notify() {
      this.subscribers.forEach((callback) => {
        try {
          callback({ ...this.state }, new Set(this.unlocked));
        } catch (error) {
          console.error('Quest subscriber error', error);
        }
      });
    },
    setFlag(flagName) {
      if (this.state[flagName]) {
        return;
      }
      this.state[flagName] = true;
      this.notify();
    },
    unlock(achievementId) {
      if (this.unlocked.has(achievementId)) {
        return false;
      }
      this.unlocked.add(achievementId);
      persistUnlockedAchievements(Array.from(this.unlocked));
      this.notify();
      return true;
    }
  };

  const uiElements = {
    toggleButton: null,
    panel: null,
    list: null,
    toastStack: null,
    progressBar: null,
    newPill: null
  };

  let audioContext = null;

  function loadUnlockedAchievements() {
    try {
      const raw = windowScope.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.warn('Unable to read quest achievements from storage', error);
      return [];
    }
  }

  function persistUnlockedAchievements(values) {
    try {
      windowScope.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (error) {
      console.warn('Unable to persist quest achievements', error);
    }
  }

  function playRewardTone() {
    try {
      if (!('AudioContext' in windowScope || 'webkitAudioContext' in windowScope)) {
        return;
      }
      audioContext = audioContext || new (windowScope.AudioContext || windowScope.webkitAudioContext)();
      const now = audioContext.currentTime;

      const oscillator = audioContext.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(880, now);

      const gain = audioContext.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } catch (error) {
      console.warn('Reward tone playback failed', error);
    }
  }

  function buildQuestListItem(achievement, isUnlocked) {
    const item = documentScope.createElement('li');
    item.className = `quest-list__item ${isUnlocked ? 'is-unlocked' : ''}`;
    item.dataset.questId = achievement.id;

    const icon = documentScope.createElement('span');
    icon.className = 'quest-list__icon';
    icon.innerHTML = `<i class="fa-solid ${achievement.icon}" aria-hidden="true"></i>`;

    const content = documentScope.createElement('div');
    content.className = 'quest-list__content';

    const title = documentScope.createElement('p');
    title.className = 'quest-list__title';
    title.textContent = achievement.title;

    const description = documentScope.createElement('p');
    description.className = 'quest-list__description';
    description.textContent = achievement.description;

    const status = documentScope.createElement('span');
    status.className = 'quest-list__status';
    status.textContent = isUnlocked ? 'Débloqué' : 'À débloquer';

    content.appendChild(title);
    content.appendChild(description);

    item.appendChild(icon);
    item.appendChild(content);
    item.appendChild(status);

    return item;
  }

  function renderQuestList() {
    if (!uiElements.list) {
      return;
    }

    uiElements.list.innerHTML = '';
    const unlockedIds = questStore.unlocked;

    ACHIEVEMENTS.forEach((achievement) => {
      const listItem = buildQuestListItem(achievement, unlockedIds.has(achievement.id));
      uiElements.list.appendChild(listItem);
    });

    updateProgressBar();
    refreshNewBadge();
  }

  function updateProgressBar() {
    if (!uiElements.progressBar) {
      return;
    }
    const completion = questStore.unlocked.size / ACHIEVEMENTS.length;
    uiElements.progressBar.style.width = `${Math.round(completion * 100)}%`;
  }

  function refreshNewBadge() {
    if (!uiElements.newPill) {
      return;
    }
    const hasLocked = questStore.unlocked.size < ACHIEVEMENTS.length;
    uiElements.newPill.hidden = !hasLocked;
  }

  function findQuestListItem(achievementId) {
    return uiElements.list?.querySelector(`[data-quest-id="${achievementId}"]`);
  }

  function markQuestAsUnlocked(achievement) {
    const questItem = findQuestListItem(achievement.id);
    if (questItem) {
      questItem.classList.add('is-unlocked');
      const statusElement = questItem.querySelector('.quest-list__status');
      if (statusElement) {
        statusElement.textContent = 'Débloqué';
      }
    }
  }

  function pushToast(achievement) {
    if (!uiElements.toastStack) {
      return;
    }
    const toast = documentScope.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `
      <div class="quest-toast__icon">
        <i class="fa-solid ${achievement.icon}" aria-hidden="true"></i>
      </div>
      <div class="quest-toast__content">
        <p class="quest-toast__eyebrow">Succès débloqué</p>
        <p class="quest-toast__title">${achievement.title}</p>
        <p class="quest-toast__text">${achievement.description}</p>
      </div>
    `;

    uiElements.toastStack.appendChild(toast);
    playRewardTone();

    windowScope.setTimeout(() => {
      toast.classList.add('is-hiding');
      windowScope.setTimeout(() => toast.remove(), 400);
    }, 4200);
  }

  function evaluateAchievements() {
    ACHIEVEMENTS.forEach((achievement) => {
      if (questStore.unlocked.has(achievement.id)) {
        return;
      }

      if (achievement.condition(questStore.state)) {
        const wasUnlocked = questStore.unlock(achievement.id);
        if (wasUnlocked) {
          markQuestAsUnlocked(achievement);
          pushToast(achievement);
          updateProgressBar();
          refreshNewBadge();
        }
      }
    });
  }

  function handleQuestEvent(detail) {
    switch (detail?.type) {
      case 'scroll-start':
        questStore.setFlag('hasScrolled');
        break;
      case 'project-hover':
        questStore.setFlag('hoveredProject');
        break;
      case 'modal-opened':
        questStore.setFlag('openedModal');
        break;
      case 'bottom-reached':
        questStore.setFlag('reachedBottom');
        break;
      case 'language-switched':
        questStore.setFlag('languageSwitched');
        break;
      default:
        return;
    }

    evaluateAchievements();
  }

  function registerQuestListeners() {
    documentScope.addEventListener(QUEST_EVENT, (event) => {
      handleQuestEvent(event.detail);
    });

    questStore.subscribe(() => {
      updateProgressBar();
      refreshNewBadge();
    });
  }

  function installUiEmitters() {
    const emit = (type, detail = {}) => {
      documentScope.dispatchEvent(new CustomEvent(QUEST_EVENT, { detail: { type, ...detail } }));
    };

    let hasNotifiedScroll = false;
    let hasNotifiedBottom = false;
    const handleScroll = () => {
      if (!hasNotifiedScroll && windowScope.scrollY > 40) {
        hasNotifiedScroll = true;
        emit('scroll-start');
      }

      if (hasNotifiedBottom) {
        return;
      }
      const reachedBottom = windowScope.innerHeight + windowScope.scrollY >= documentScope.body.offsetHeight - 120;
      if (reachedBottom) {
        hasNotifiedBottom = true;
        emit('bottom-reached');
      }
    };

    windowScope.addEventListener('scroll', handleScroll, { passive: true });

    let hasHoveredProject = false;
    documentScope.addEventListener('pointerenter', (event) => {
      if (hasHoveredProject) {
        return;
      }
      const hoveredCard = event.target?.closest?.('.card, .game-card');
      if (hoveredCard) {
        hasHoveredProject = true;
        emit('project-hover');
      }
    });

    const languageButtons = documentScope.querySelectorAll('.language-switcher button');
    languageButtons.forEach((button) => {
      button.addEventListener('click', () => emit('language-switched', { language: button.dataset.lang }));
    });
  }

  function cacheUiElements() {
    uiElements.toggleButton = documentScope.getElementById('quest-toggle');
    uiElements.panel = documentScope.getElementById('quest-panel');
    uiElements.list = documentScope.getElementById('quest-list');
    uiElements.toastStack = documentScope.getElementById('quest-toast-stack');
    uiElements.progressBar = documentScope.getElementById('quest-progress-bar');
    uiElements.newPill = uiElements.toggleButton?.querySelector('.quest-toggle__pill') || null;
  }

  function registerToggleInteraction() {
    if (!uiElements.toggleButton || !uiElements.panel) {
      return;
    }

    uiElements.toggleButton.addEventListener('click', () => {
      const isHidden = uiElements.panel.hasAttribute('hidden');
      uiElements.panel.toggleAttribute('hidden');
      uiElements.toggleButton.setAttribute('aria-expanded', String(isHidden));
      if (isHidden) {
        uiElements.panel.focus({ preventScroll: true });
      }
    });
  }

  function init() {
    cacheUiElements();
    registerQuestListeners();
    installUiEmitters();
    registerToggleInteraction();
    renderQuestList();
    evaluateAchievements();
  }

  if (documentScope.readyState === 'loading') {
    documentScope.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(document, window);
