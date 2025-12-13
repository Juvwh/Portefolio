(function initQuestSystem(global) {
  const QUEST_STORAGE_KEY = 'quest-system-progress';
  const TOAST_DURATION = 5200;

  const achievementDefinitions = [
    {
      id: 'cv-download',
      title: 'Télécharger le CV !',
      description: 'Tu as récupéré mon CV pour explorer encore plus en détail.',
      icon: 'fa-file-arrow-down',
      event: 'cv-download',
      condition: () => true,
    },
    {
      id: 'f-pattern-breaker',
      title: 'F-pattern breaker',
      description: 'Tu as exploré au-delà du premier écran du portfolio.',
      icon: 'fa-compass-drafting',
      event: 'scroll-progress',
      condition: ({ scrollRatio = 0, scrollY = 0 }) => scrollRatio >= 0.45 || scrollY > 900,
    },
    {
      id: 'full-stack-overflow',
      title: 'Full Stack Overflow',
      description: 'Tu as survolé au moins 5 icônes de technologies différentes.',
      icon: 'fa-layer-group',
      event: 'tech-hover',
      condition: ({ techCount = 0 }) => techCount >= 5,
    },
  ];

  class QuestSystem {
    constructor(definitions) {
      this.definitions = definitions;
      this.state = this.restoreState();
      this.toastContainer = this.createToastContainer();
      this.soundEffect = this.createSound();
    }

    restoreState() {
      try {
        const stored = global.localStorage.getItem(QUEST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          return {
            unlocked: new Set(parsed.unlocked || []),
            hoveredProjects: new Set(parsed.hoveredProjects || []),
            hoveredTechs: new Set(parsed.hoveredTechs || []),
          };
        }
      } catch (error) {
        console.warn('QuestSystem: unable to restore state', error);
      }

      return {
        unlocked: new Set(),
        hoveredProjects: new Set(),
        hoveredTechs: new Set(),
      };
    }

    persistState() {
      const payload = {
        unlocked: Array.from(this.state.unlocked),
        hoveredProjects: Array.from(this.state.hoveredProjects),
        hoveredTechs: Array.from(this.state.hoveredTechs),
      };

      try {
        global.localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(payload));
      } catch (error) {
        console.warn('QuestSystem: unable to persist state', error);
      }
    }

    createToastContainer() {
      const existing = document.querySelector('.quest-toast-container');
      if (existing) {
        return existing;
      }

      const container = document.createElement('div');
      container.className = 'quest-toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('role', 'status');
      document.body.appendChild(container);
      return container;
    }

    createSound() {
      const audioData =
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQcAAAAA/////////////////////////////w==';
      const audio = new Audio(audioData);
      audio.preload = 'auto';
      return audio;
    }

    emit(eventName, payload = {}) {
      this.definitions.forEach((definition) => {
        if (definition.event !== eventName) {
          return;
        }

        if (this.state.unlocked.has(definition.id)) {
          return;
        }

        if (definition.condition(payload, this.getSnapshot())) {
          this.unlock(definition);
        }
      });
    }

    trackProjectHover(projectId) {
      if (!projectId) {
        return;
      }

      this.state.hoveredProjects.add(projectId);
      this.persistState();
      this.emit('project-hover', { totalHovered: this.state.hoveredProjects.size, projectId });
    }

    trackTechHover(techName) {
      if (!techName) {
        return;
      }

      this.state.hoveredTechs.add(techName);
      this.persistState();
      this.emit('tech-hover', { techCount: this.state.hoveredTechs.size, techName });
    }

    getSnapshot() {
      return {
        unlocked: new Set(this.state.unlocked),
        hoveredProjects: new Set(this.state.hoveredProjects),
        hoveredTechs: new Set(this.state.hoveredTechs),
      };
    }

    unlock(definition) {
      this.state.unlocked.add(definition.id);
      this.persistState();
      this.showToast(definition);
      this.playSound();
    }

    playSound() {
      if (!this.soundEffect) {
        return;
      }

      this.soundEffect.currentTime = 0;
      this.soundEffect.play().catch(() => {
        /* Audio playback can be blocked by the browser; fail silently */
      });
    }

    showToast(definition) {
      const toast = document.createElement('div');
      toast.className = 'quest-toast';
      toast.innerHTML = `
        <div class="quest-toast__icon"><i class="fa-solid ${definition.icon}"></i></div>
        <div class="quest-toast__content">
          <p class="quest-toast__label">Succès débloqué</p>
          <p class="quest-toast__title">${definition.title}</p>
          <p class="quest-toast__description">${definition.description}</p>
        </div>
        <button class="quest-toast__close" aria-label="Fermer la notification">&times;</button>
      `;

      const closeToast = () => {
        toast.classList.remove('is-visible');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
      };

      toast.querySelector('.quest-toast__close').addEventListener('click', closeToast);
      this.toastContainer.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add('is-visible');
      });

      setTimeout(closeToast, TOAST_DURATION);
    }
  }

  function setupScrollQuest(questSystem) {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = global.scrollY || global.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - global.innerHeight;
        const atBottom = maxScroll > 0 && scrollY >= maxScroll - 8;

        questSystem.emit('scroll-progress', { scrollY, scrollRatio: maxScroll ? scrollY / maxScroll : 0 });

        if (atBottom) {
          questSystem.emit('scroll-bottom', { scrollY });
        }

        ticking = false;
      });
    };

    global.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function setupHoverQuest(questSystem) {
    const selectors = ['.game-card', '.card', '.btn', '.btn-cta-primary', '.btn-cta-secondary'];

    document.addEventListener('mouseenter', (event) => {
      const target = selectors
        .map((selector) => event.target.closest(selector))
        .find((element) => element);

      if (!target) {
        return;
      }

      const projectId = target.dataset.modalId || target.dataset.projectId || target.getAttribute('aria-label') || target.textContent?.trim();
      questSystem.trackProjectHover(projectId);
    }, true);
  }

  function setupTechHoverQuest(questSystem) {
    document.addEventListener('mouseenter', (event) => {
      const techTarget = event.target.closest('[data-tech]');
      if (!techTarget) {
        return;
      }

      const techName = techTarget.dataset.tech?.trim();
      questSystem.trackTechHover(techName);
    }, true);
  }

  function setupCtaQuest(questSystem) {
    const ctaSelectors = ['.btn-cta-primary', '.btn-cta-secondary', '.hero-scroll-indicator'];

    ctaSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.addEventListener('click', () => questSystem.emit('cta-interaction'));
      });
    });
  }

  function setupCvQuest(questSystem) {
    document.querySelectorAll('[data-quest="cv-download"]').forEach((element) => {
      element.addEventListener('click', () => questSystem.emit('cv-download'));
    });
  }

  function bootstrapQuestSystem() {
    if (!global || !global.document) {
      return;
    }

    const questSystem = new QuestSystem(achievementDefinitions);
    setupScrollQuest(questSystem);
    setupHoverQuest(questSystem);
    setupCtaQuest(questSystem);
    setupTechHoverQuest(questSystem);
    setupCvQuest(questSystem);

    global.questSystem = questSystem;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapQuestSystem, { once: true });
  } else {
    bootstrapQuestSystem();
  }
})(typeof window !== 'undefined' ? window : this);
