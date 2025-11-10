export class ModalManager {
  constructor({
    dataRepository,
    lightboxController,
    translationProvider,
    documentRef = document,
    windowRef = window
  }) {
    this.dataRepository = dataRepository;
    this.lightbox = lightboxController;
    this.translate = typeof translationProvider === 'function' ? translationProvider : (() => null);
    this.document = documentRef;
    this.window = windowRef;

    this.modalOverlay = null;
    this.modalCloseBtn = null;
    this.modalCard = null;
    this.modalTitleElement = null;
    this.modalDescriptionElement = null;
    this.modalVideoIframe = null;
    this.modalImageElement = null;
    this.modalVideoContainer = null;
    this.modalHoverImageElement = null;
    this.modalGalleryElement = null;
    this.modalBadgesContainer = null;
    this.modalButtonsContainer = null;

    this.modalIdSequence = [];
    this.activeModalId = null;
    this.currentLightboxImages = [];
    this.lightboxJustClosed = false;

    this.touchStartX = null;
    this.touchStartY = null;
    this.SWIPE_THRESHOLD = 60;

    this.handleBodyClick = this.handleBodyClick.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  initialize() {
    this.cacheDomReferences();
    this.modalIdSequence = this.computeModalSequence();

    if (this.lightbox) {
      this.lightbox.setOnClose(() => {
        if (this.modalOverlay?.classList.contains('active')) {
          this.document.body.classList.add('modal-open');
        }
        this.lightboxJustClosed = true;
      });
    }

    this.registerEventListeners();
    this.openModalFromUrl();
  }

  getTranslationValue(key, fallback = '') {
    if (!key) {
      return fallback;
    }

    try {
      const translated = this.translate(key);
      if (!translated || String(translated).startsWith('MissingKey')) {
        return fallback;
      }
      return translated;
    } catch (error) {
      console.error('Error retrieving translation for key:', key, error);
      return fallback;
    }
  }

  cacheDomReferences() {
    this.modalOverlay = this.document.getElementById('project-modal');
    this.modalCloseBtn = this.document.getElementById('modal-close-btn');
    this.modalCard = this.modalOverlay ? this.modalOverlay.querySelector('.modal-card') : null;

    if (!this.modalOverlay) {
      console.error('Modal overlay element not found. Modal functionality disabled.');
      return;
    }

    this.modalTitleElement = this.modalOverlay.querySelector('.modal-title');
    this.modalDescriptionElement = this.modalOverlay.querySelector('.modal-description');
    this.modalVideoIframe = this.modalOverlay.querySelector('.modal-video-container iframe');
    this.modalImageElement = this.modalOverlay.querySelector('#modal-image-element');
    this.modalVideoContainer = this.modalOverlay.querySelector('.modal-video-container');
    this.modalHoverImageElement = this.modalOverlay.querySelector('#modal-hover-image');
    this.modalGalleryElement = this.modalOverlay.querySelector('.modal-gallery');
    this.modalBadgesContainer = this.modalOverlay.querySelector('.modal-badges');
    this.modalButtonsContainer = this.modalOverlay.querySelector('.modal-buttons-container');
  }

  computeModalSequence() {
    return Array.from(new Set(Array.from(this.document.querySelectorAll('[data-modal-id]'))
      .map((element) => element.dataset.modalId)
      .filter(Boolean)));
  }

  registerEventListeners() {
    this.document.body.addEventListener('click', this.handleBodyClick);

    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }

    if (this.modalOverlay) {
      this.modalOverlay.addEventListener('click', this.handleOverlayClick);
    }

    const swipeTarget = this.modalCard || this.modalOverlay;
    if (swipeTarget) {
      swipeTarget.addEventListener('touchstart', this.handleTouchStart, { passive: true });
      swipeTarget.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    }

    this.document.addEventListener('keydown', this.handleKeydown);
  }

  handleBodyClick(event) {
    const triggerButton = event.target.closest('.section-projet-en-avant .btn, .project-modal-trigger, .game-card');
    if (!triggerButton) {
      return;
    }

    event.preventDefault();
    this.openModal(triggerButton);
  }

  handleOverlayClick(event) {
    if (event.target === this.modalOverlay) {
      this.closeModal();
    }
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      if (this.lightbox?.isOpen()) {
        return;
      }

      if (this.modalOverlay?.classList.contains('active')) {
        if (this.lightboxJustClosed) {
          this.lightboxJustClosed = false;
        } else {
          this.closeModal();
        }
      }
    }
  }

  handleTouchStart(event) {
    if (!this.swipeInteractionsEnabled() || event.touches.length > 1) {
      return;
    }

    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
  }

  handleTouchEnd(event) {
    if (!this.swipeInteractionsEnabled() || this.touchStartX === null || this.touchStartY === null) {
      this.touchStartX = null;
      this.touchStartY = null;
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    this.touchStartX = null;
    this.touchStartY = null;

    if (Math.abs(deltaX) < this.SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX > 0) {
      this.closeModal();
    } else if (this.activeModalId) {
      const currentIndex = this.modalIdSequence.indexOf(this.activeModalId);
      if (currentIndex !== -1 && this.modalIdSequence.length > 0) {
        const nextIndex = (currentIndex + 1) % this.modalIdSequence.length;
        const nextModalId = this.modalIdSequence[nextIndex];
        this.openModalById(nextModalId);
      }
    }
  }

  swipeInteractionsEnabled() {
    if (!this.modalOverlay || !this.modalOverlay.classList.contains('active')) {
      return false;
    }

    return this.window.matchMedia('(pointer: coarse)').matches || this.window.innerWidth <= 768;
  }

  openModal(triggerButton) {
    if (!this.modalOverlay) {
      console.error('Modal overlay element not found. Cannot open modal.');
      return;
    }

    this.lightboxJustClosed = false;

    let modalDataToDisplay = null;
    const modalId = triggerButton.dataset.modalId;

    if (modalId) {
      const repositoryData = this.dataRepository?.getModalData?.(modalId);
      if (repositoryData) {
        modalDataToDisplay = repositoryData;
      }
    }

    if (!modalDataToDisplay) {
      modalDataToDisplay = this.buildModalDataFromTrigger(triggerButton);
    }

    if (modalDataToDisplay) {
      this.populateModal(modalDataToDisplay);
      this.modalOverlay.classList.add('active');
      this.document.body.classList.add('modal-open');
      this.activeModalId = modalId || null;
    } else {
      console.error('No data available to populate the modal for button:', triggerButton);
    }
  }

  buildModalDataFromTrigger(triggerButton) {
    try {
      const rawGalleryDataAttr = triggerButton.dataset.modalGallery;
      let galleryItems = [];
      let galleryCaptions = [];

      if (rawGalleryDataAttr) {
        const parsedGalleryData = JSON.parse(rawGalleryDataAttr);
        if (Array.isArray(parsedGalleryData) && parsedGalleryData.length > 0 && typeof parsedGalleryData[0] === 'object') {
          galleryItems = parsedGalleryData.map((item) => item.src);
          galleryCaptions = parsedGalleryData.map((item, index) => item.alt || item.caption || `Image ${index + 1}`);
        } else if (Array.isArray(parsedGalleryData)) {
          galleryItems = parsedGalleryData;
          galleryCaptions = galleryItems.map((_, idx) => `Image ${idx + 1}`);
        }
      }

      return {
        title: triggerButton.dataset.modalTitle,
        description: triggerButton.dataset.modalDescription,
        videoUrl: triggerButton.dataset.modalVideoUrl,
        imageUrl: triggerButton.dataset.modalImageUrl,
        badges: JSON.parse(triggerButton.dataset.modalBadges || '[]'),
        gallery: galleryItems,
        galleryCaptions,
        playUrl: triggerButton.dataset.modalPlayUrl,
        playMessageKey: triggerButton.dataset.modalPlayMessageKey,
        reportUrl: triggerButton.dataset.modalReportUrl,
        thesisUrl: triggerButton.dataset.modalThesisUrl,
        thesisBtnKey: triggerButton.dataset.modalThesisBtnKey,
        defenceUrl: triggerButton.dataset.modalDefenceUrl,
        defenceBtnKey: triggerButton.dataset.modalDefenceBtnKey
      };
    } catch (error) {
      console.error('Error parsing modal data from button attributes:', error);
      return { title: 'Error', description: 'Could not load modal content.' };
    }
  }

  openModalById(modalId) {
    if (!this.modalOverlay || !modalId) {
      return false;
    }

    const data = this.dataRepository?.getModalData?.(modalId);
    if (data) {
      this.populateModal(data);
      this.modalOverlay.classList.add('active');
      this.document.body.classList.add('modal-open');
      this.activeModalId = modalId;
      return true;
    }

    const fallbackTrigger = this.document.querySelector(`[data-modal-id="${modalId}"]`);
    if (fallbackTrigger) {
      this.openModal(fallbackTrigger);
      return true;
    }

    console.warn(`Unable to open modal with id "${modalId}" because no data or trigger was found.`);
    return false;
  }

  closeModal() {
    if (!this.modalOverlay || !this.modalOverlay.classList.contains('active')) {
      return;
    }

    this.modalOverlay.classList.remove('active');
    this.document.body.classList.remove('modal-open');

    if (this.modalVideoIframe) {
      const currentVideoSrc = this.modalVideoIframe.src;
      this.modalVideoIframe.src = currentVideoSrc;
    }

    this.activeModalId = null;
    this.lightboxJustClosed = false;
  }

  populateModal(data) {
    if (!this.modalOverlay) {
      console.error('Modal overlay element not found. Cannot populate modal.');
      return;
    }

    this.populateTitle(data);
    this.populateDescription(data);
    this.populateMedia(data);
    this.populateBadges(data);
    this.populateGallery(data);
    this.populateButtons(data);
  }

  populateTitle(data) {
    if (!this.modalTitleElement) {
      return;
    }

    if (data.titleKey) {
      this.modalTitleElement.innerHTML = this.getTranslationValue(data.titleKey, 'Project Title');
    } else if (data.title) {
      this.modalTitleElement.textContent = data.title;
    } else {
      this.modalTitleElement.textContent = 'Project Title';
    }
  }

  populateDescription(data) {
    if (!this.modalDescriptionElement) {
      return;
    }

    if (data.descriptionKey) {
      const translatedDescription = this.getTranslationValue(data.descriptionKey, 'Description not available.');
      this.modalDescriptionElement.innerHTML = translatedDescription.replace(/\n/g, '<br>');
    } else if (data.description) {
      this.modalDescriptionElement.textContent = data.description;
    } else {
      this.modalDescriptionElement.textContent = 'Description not available.';
    }
  }

  populateMedia(data) {
    if (!this.modalVideoIframe || !this.modalImageElement) {
      return;
    }

    if (data.imageUrl) {
      this.modalVideoIframe.style.display = 'none';
      this.modalVideoIframe.src = '';
      this.modalImageElement.style.display = 'block';
      this.modalImageElement.src = data.imageUrl;
    } else if (data.videoUrl) {
      this.modalImageElement.style.display = 'none';
      this.modalImageElement.src = '';
      this.modalVideoIframe.style.display = 'block';
      this.modalVideoIframe.src = data.videoUrl;
    } else {
      this.modalImageElement.style.display = 'none';
      this.modalVideoIframe.style.display = 'block';
      this.modalVideoIframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    }
  }

  populateBadges(data) {
    if (!this.modalBadgesContainer) {
      return;
    }

    this.modalBadgesContainer.innerHTML = '';

    if (!Array.isArray(data.badges)) {
      return;
    }

    data.badges.forEach((badgeData) => {
      const badgeEl = this.document.createElement('span');
      badgeEl.className = 'badge';

      if (badgeData.className) {
        const classNames = Array.isArray(badgeData.className) ? badgeData.className : [badgeData.className];
        classNames.filter(Boolean).forEach((cls) => badgeEl.classList.add(cls));
      }

      const iconHTML = badgeData.icon ? `<i class="${badgeData.icon}"></i> ` : '';
      const badgeText = badgeData.textKey ? this.getTranslationValue(badgeData.textKey, '') : (badgeData.text || '');
      badgeEl.innerHTML = `${iconHTML}${badgeText}`;

      this.modalBadgesContainer.appendChild(badgeEl);
    });
  }

  populateGallery(data) {
    if (!this.modalGalleryElement) {
      return;
    }

    this.modalGalleryElement.innerHTML = '';
    this.currentLightboxImages = [];

    if (!Array.isArray(data.gallery)) {
      return;
    }

    data.gallery.forEach((item, index) => {
      const entry = typeof item === 'object' ? item : { src: item };
      const imgEl = this.document.createElement('img');
      imgEl.src = entry.src;
      const altText = entry.alt || (data.galleryCaptions?.[index]) || `Gallery image ${index + 1}`;
      imgEl.alt = altText;
      imgEl.className = 'modal-gallery-img';

      this.currentLightboxImages.push({ src: entry.src, alt: altText });

      imgEl.addEventListener('click', () => {
        this.lightbox?.show(this.currentLightboxImages, index);
      });

      if (this.modalHoverImageElement && this.modalVideoContainer) {
        imgEl.addEventListener('mouseover', () => {
          this.modalHoverImageElement.src = entry.src;
          this.modalHoverImageElement.style.display = 'block';
          this.modalVideoContainer.style.visibility = 'hidden';
          this.modalVideoContainer.style.opacity = '0';
          this.modalVideoContainer.style.pointerEvents = 'none';
          this.window.requestAnimationFrame(() => {
            this.modalHoverImageElement.style.opacity = '1';
            this.modalHoverImageElement.style.pointerEvents = 'auto';
          });
        });

        imgEl.addEventListener('mouseout', () => {
          this.modalHoverImageElement.style.opacity = '0';
          this.modalHoverImageElement.style.pointerEvents = 'none';
          this.modalVideoContainer.style.visibility = 'visible';
          this.modalVideoContainer.style.opacity = '1';
          this.modalVideoContainer.style.pointerEvents = 'auto';
        });
      }

      this.modalGalleryElement.appendChild(imgEl);
    });
  }

  populateButtons(data) {
    if (!this.modalButtonsContainer) {
      return;
    }

    this.modalButtonsContainer.innerHTML = '';

    if (data.playUrl) {
      const playButton = this.document.createElement('button');
      playButton.className = 'btn modal-play-btn';
      playButton.textContent = this.getTranslationValue('modalPlayButton', 'Play');
      playButton.addEventListener('click', () => {
        this.window.open(data.playUrl, '_blank');
        this.closeModal();
      });
      this.modalButtonsContainer.appendChild(playButton);
    } else if (data.playMessageKey) {
      const playMessage = this.document.createElement('p');
      playMessage.className = 'modal-on-request-message';
      playMessage.textContent = this.getTranslationValue(data.playMessageKey, '');
      this.modalButtonsContainer.appendChild(playMessage);
    }

    if (data.reportUrl) {
      const reportButton = this.document.createElement('button');
      reportButton.className = 'btn';
      reportButton.textContent = 'View Report';
      reportButton.addEventListener('click', () => {
        this.window.open(data.reportUrl, '_blank');
      });
      this.modalButtonsContainer.appendChild(reportButton);
    }

    if (data.thesisUrl) {
      const thesisButton = this.document.createElement('button');
      thesisButton.className = 'btn';
      thesisButton.textContent = data.thesisBtnKey ? this.getTranslationValue(data.thesisBtnKey, 'Read Thesis') : 'Read Thesis';
      thesisButton.addEventListener('click', () => {
        this.window.open(data.thesisUrl, '_blank');
      });
      this.modalButtonsContainer.appendChild(thesisButton);
    }

    if (data.defenceUrl) {
      const defenceButton = this.document.createElement('button');
      defenceButton.className = 'btn';
      defenceButton.textContent = data.defenceBtnKey ? this.getTranslationValue(data.defenceBtnKey, 'View the defence') : 'View the defence';
      defenceButton.addEventListener('click', () => {
        this.window.open(data.defenceUrl, '_blank');
      });
      this.modalButtonsContainer.appendChild(defenceButton);
    }
  }

  openModalFromUrl() {
    const hash = this.window.location.hash.substring(1);
    if (!hash) {
      return;
    }

    const triggerElement = this.document.querySelector(`[data-modal-id="${hash}"]`);
    if (triggerElement) {
      this.openModal(triggerElement);
    } else {
      console.warn(`URL hash #${hash} found, but no corresponding modal trigger element could be found.`);
    }
  }
}
