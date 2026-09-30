(function initAnalytics(global) {
  // Privacy-friendly event tracking with GoatCounter (no cookies, no personal data).
  // Every event shows up in the GoatCounter dashboard as a path, e.g. "project/loki".
  const pendingEvents = [];
  const trackedOnce = new Set();

  function sendToGoatCounter(event) {
    const goatcounter = global.goatcounter;
    if (!goatcounter || typeof goatcounter.count !== 'function') {
      return false;
    }
    goatcounter.count({ path: event.path, title: event.title, event: true });
    return true;
  }

  function track(path, title = path) {
    const event = { path, title };
    if (!sendToGoatCounter(event)) {
      pendingEvents.push(event);
    }
  }

  function trackOnce(path, title) {
    if (trackedOnce.has(path)) {
      return;
    }
    trackedOnce.add(path);
    track(path, title);
  }

  // count.js is loaded async: flush whatever happened before it was ready
  function flushPendingEvents() {
    while (pendingEvents.length && sendToGoatCounter(pendingEvents[0])) {
      pendingEvents.shift();
    }
  }

  function currentProjectId() {
    return decodeURIComponent(global.location.hash.substring(1)) || 'unknown';
  }

  function bindProjectEvents() {
    document.addEventListener('projectModalOpened', (event) => {
      const modalId = event.detail?.modalId || 'unknown';
      track(`project/${modalId}`, `Project opened: ${modalId}`);
    });

    // Play / code / thesis / defence buttons inside the project modal
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-analytics]');
      if (button) {
        const projectId = currentProjectId();
        track(`project/${projectId}/${button.dataset.analytics}`, `Project ${projectId}: ${button.dataset.analytics}`);
      }
    });
  }

  function bindCvEvents() {
    document.addEventListener('cvOpened', (event) => {
      const { lang, theme } = event.detail || {};
      track(`cv/open-${lang}-${theme}`, 'CV opened');
    });

    document.addEventListener('cvDownloaded', (event) => {
      const { track: cvTrack, lang, theme, source } = event.detail || {};
      track(`cv/download-${cvTrack}-${lang}-${theme}`, `CV downloaded (${source})`);
    });
  }

  function bindLinkEvents() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) {
        return;
      }

      const href = link.getAttribute('href');
      if (href.startsWith('mailto:')) {
        track('contact/email', 'Email link clicked');
        return;
      }

      if (href.startsWith('#')) {
        if (link.closest('.navbar')) {
          track(`nav/${href.substring(1) || 'cv'}`, `Navbar: ${link.textContent.trim()}`);
        } else if (link.closest('.hero-cta-group')) {
          track(`cta/${href.substring(1)}`, `Hero button: ${link.textContent.trim()}`);
        }
        return;
      }

      try {
        const url = new URL(href, global.location.href);
        if (url.host !== global.location.host) {
          track(`outbound/${url.hostname.replace(/^www\./, '')}`, `Outbound link: ${url.href}`);
        }
      } catch (error) {
        // Ignore malformed URLs
      }
    });
  }

  function bindUiEvents() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      const languageButton = target.closest('.navbar [data-lang]');
      if (languageButton) {
        track(`ui/language-${languageButton.dataset.lang}`, 'Language switched');
      } else if (target.closest('#theme-toggle-btn')) {
        track('ui/theme-toggle', 'Theme toggled');
      } else if (target.closest('.quest-floating-button')) {
        track('ui/quest-journal', 'Quest journal opened');
      } else if (target.closest('#prev-btn, #next-btn')) {
        trackOnce('carousel/navigated', 'Carousel navigated');
      }
    });
  }

  // How far do visitors scroll? One event per section per page view.
  function observeSections() {
    if (!('IntersectionObserver' in global)) {
      return;
    }

    const sections = {
      'featured': '.section-projet-en-avant',
      'games': '#all-games-section',
      'it-projects': '#it-projects-section',
      'journey': '#my-journey',
      'tools': '.icon-gallery',
      'footer': '#contact'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const name = entry.target.dataset.analyticsSection;
          trackOnce(`section/${name}`, `Section viewed: ${name}`);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    Object.entries(sections).forEach(([name, selector]) => {
      const element = document.querySelector(selector);
      if (element) {
        element.dataset.analyticsSection = name;
        observer.observe(element);
      }
    });
  }

  function initialize() {
    document.querySelector('script[data-goatcounter]')?.addEventListener('load', flushPendingEvents);
    bindProjectEvents();
    bindCvEvents();
    bindLinkEvents();
    bindUiEvents();
    observeSections();

    // A shared link like /#loki opens its modal before this script runs
    if (document.querySelector('#project-modal.active')) {
      track(`project/${currentProjectId()}`, `Project opened from a shared link: ${currentProjectId()}`);
    }

    flushPendingEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

  global.analytics = { track };
})(typeof window !== 'undefined' ? window : this);
