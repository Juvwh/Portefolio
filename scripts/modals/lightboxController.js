(function initLightboxController(global) {
  const DEFAULT_OPTIONS = {
    overlayId: 'gallery-lightbox',
    imageId: 'lightbox-img',
    captionId: 'lightbox-caption',
    closeButtonId: 'lightbox-close-btn',
    prevButtonId: 'lightbox-prev-btn',
    nextButtonId: 'lightbox-next-btn',
    prevZoneId: 'lightbox-prev-zone',
    nextZoneId: 'lightbox-next-zone'
  };

  class LightboxController {
  constructor({ documentRef = document, options = {}, onClose } = {}) {
    this.document = documentRef;
    this.onClose = onClose;
    this.options = { ...DEFAULT_OPTIONS, ...options };

    this.lightbox = this.document.getElementById(this.options.overlayId);
    this.imageElement = this.document.getElementById(this.options.imageId);
    this.captionElement = this.document.getElementById(this.options.captionId);
    this.closeButton = this.document.getElementById(this.options.closeButtonId);
    this.prevButton = this.document.getElementById(this.options.prevButtonId);
    this.nextButton = this.document.getElementById(this.options.nextButtonId);
    this.prevZone = this.document.getElementById(this.options.prevZoneId);
    this.nextZone = this.document.getElementById(this.options.nextZoneId);

    this.currentImages = [];
    this.currentIndex = 0;
    this.lastWheelTime = 0;
    this.wheelThrottle = 300;

    this.touchStartX = 0;
    this.touchEndX = 0;

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this.registerStaticListeners();
  }

  registerStaticListeners() {
    if (!this.lightbox) {
      return;
    }

    this.closeButton?.addEventListener('click', () => this.close());
    this.prevButton?.addEventListener('click', () => this.showPrevious());
    this.nextButton?.addEventListener('click', () => this.showNext());
    this.prevZone?.addEventListener('click', () => this.showPrevious());
    this.nextZone?.addEventListener('click', () => this.showNext());

    this.lightbox.addEventListener('click', this.handleOverlayClick);
    this.lightbox.addEventListener('wheel', this.handleWheel, { passive: false });
    this.lightbox.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    this.lightbox.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }

  setOnClose(callback) {
    this.onClose = callback;
  }

  isOpen() {
    return Boolean(this.lightbox?.classList.contains('lightbox--active'));
  }

  show(images, startIndex = 0) {
    if (!this.lightbox || !Array.isArray(images) || images.length === 0) {
      return;
    }

    this.currentImages = images;
    this.currentIndex = Math.max(0, Math.min(startIndex, images.length - 1));

    this.document.body.classList.add('modal-open');
    this.lightbox.classList.add('lightbox--active');
    this.showImage(this.currentIndex);

    this.document.addEventListener('keydown', this.handleKeydown);
  }

  close() {
    if (!this.isOpen()) {
      return;
    }

    this.lightbox.classList.remove('lightbox--active');
    this.document.body.classList.remove('modal-open');

    if (this.imageElement) {
      this.imageElement.src = '';
      this.imageElement.style.opacity = 1;
    }

    if (this.captionElement) {
      this.captionElement.textContent = '';
      this.captionElement.style.opacity = 1;
    }

    this.document.removeEventListener('keydown', this.handleKeydown);
    this.currentImages = [];
    this.currentIndex = 0;

    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  showNext() {
    if (this.currentIndex < this.currentImages.length - 1) {
      this.showImage(this.currentIndex + 1);
    }
  }

  showPrevious() {
    if (this.currentIndex > 0) {
      this.showImage(this.currentIndex - 1);
    }
  }

  showImage(index) {
    if (!this.imageElement || !this.captionElement) {
      return;
    }

    if (index < 0 || index >= this.currentImages.length) {
      this.updateNavControls();
      return;
    }

    this.currentIndex = index;
    this.imageElement.style.opacity = 0;
    this.captionElement.style.opacity = 0;

    const entry = this.currentImages[this.currentIndex];
    const src = typeof entry === 'object' ? entry.src : entry;
    const captionText = typeof entry === 'object' ? (entry.alt || entry.caption || '') : '';

    const imageToLoad = new Image();
    imageToLoad.onload = () => {
      this.imageElement.src = src;
      this.captionElement.textContent = captionText;
      this.imageElement.style.opacity = 1;
      this.captionElement.style.opacity = 1;

      this.updateNavControls();
      this.preloadNeighboringImages();
    };

    imageToLoad.onerror = () => {
      this.captionElement.textContent = 'Error loading image.';
      this.imageElement.src = '';
      this.imageElement.style.opacity = 1;
      this.captionElement.style.opacity = 1;
      this.updateNavControls();
    };

    imageToLoad.src = src;
  }

  updateNavControls() {
    if (!this.prevButton || !this.nextButton) {
      return;
    }

    if (this.currentImages.length <= 1) {
      this.prevButton.style.display = 'none';
      this.nextButton.style.display = 'none';
      if (this.prevZone) this.prevZone.style.display = 'none';
      if (this.nextZone) this.nextZone.style.display = 'none';
      return;
    }

    this.prevButton.style.display = this.currentIndex === 0 ? 'none' : 'block';
    this.nextButton.style.display = this.currentIndex === this.currentImages.length - 1 ? 'none' : 'block';

    if (this.prevZone) {
      this.prevZone.style.display = this.currentIndex === 0 ? 'none' : 'block';
    }
    if (this.nextZone) {
      this.nextZone.style.display = this.currentIndex === this.currentImages.length - 1 ? 'none' : 'block';
    }
  }

  preloadNeighboringImages() {
    if (!Array.isArray(this.currentImages) || this.currentImages.length === 0) {
      return;
    }

    if (this.currentIndex < this.currentImages.length - 1) {
      const nextEntry = this.currentImages[this.currentIndex + 1];
      const src = typeof nextEntry === 'object' ? nextEntry.src : nextEntry;
      if (src) {
        const img = new Image();
        img.src = src;
      }
    }

    if (this.currentIndex > 0) {
      const prevEntry = this.currentImages[this.currentIndex - 1];
      const src = typeof prevEntry === 'object' ? prevEntry.src : prevEntry;
      if (src) {
        const img = new Image();
        img.src = src;
      }
    }
  }

  handleKeydown(event) {
    if (!this.isOpen()) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.stopPropagation();
        this.close();
        break;
      case 'ArrowRight':
        this.showNext();
        break;
      case 'ArrowLeft':
        this.showPrevious();
        break;
      default:
        break;
    }
  }

  handleOverlayClick(event) {
    if (event.target === this.lightbox) {
      this.close();
    }
  }

  handleTouchStart(event) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  handleTouchEnd(event) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  handleSwipeGesture() {
    if (!this.isOpen()) {
      return;
    }

    const threshold = 50;
    if (this.touchEndX < this.touchStartX - threshold) {
      this.showNext();
    }
    if (this.touchEndX > this.touchStartX + threshold) {
      this.showPrevious();
    }
  }

  handleWheel(event) {
    if (!this.isOpen()) {
      return;
    }

    const currentTime = Date.now();
    if (currentTime - this.lastWheelTime < this.wheelThrottle) {
      event.preventDefault();
      return;
    }

    this.lastWheelTime = currentTime;

    if (event.deltaY > 0 || event.deltaX > 0) {
      this.showNext();
    } else if (event.deltaY < 0 || event.deltaX < 0) {
      this.showPrevious();
    }
    event.preventDefault();
  }
  }

  global.LightboxController = LightboxController;
})(typeof window !== 'undefined' ? window : this);
