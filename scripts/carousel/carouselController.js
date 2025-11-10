(function initCarouselController(global) {
  class CarouselController {
  #track;
  #config;
  #wrapper = null;
  #prevButton = null;
  #nextButton = null;
  #state = {
    currentIndex: 0,
    cardWidth: 0,
    numOriginalCards: 0,
    numVisibleCards: 0,
    leftCloneCount: 0,
    isDragging: false,
    isTransitioning: false,
    startX: 0,
    currentDragOffset: 0,
  };
  #isMounted = false;
  #resizeTimeoutId = null;
  #onNextClick;
  #onPrevClick;
  #onTrackMouseDown;
  #onDocumentMouseMove;
  #onDocumentMouseUp;
  #onTrackMouseLeave;
  #onResize;

  constructor(trackElement, config = {}) {
    if (!(trackElement instanceof HTMLElement)) {
      throw new Error('CarouselController requires a valid track element.');
    }

    this.#track = trackElement;
    const defaultConfig = {
      breakpoints: [
        { minWidth: 1598, cards: 3 },
        { minWidth: 1132, cards: 2 },
      ],
      selectors: {
        wrapper: '.carousel-wrapper',
        prevButton: '#prev-btn',
        nextButton: '#next-btn',
        card: '.card',
      },
      drag: {
        threshold: 0.25,
        exclude: 'button, a, input, textarea',
      },
      resizeDebounce: 250,
    };

    this.#config = this.#normalizeConfig(defaultConfig, config);

    this.#onNextClick = () => this.#moveToNextCard();
    this.#onPrevClick = () => this.#moveToPreviousCard();
    this.#onTrackMouseDown = (event) => this.#handleTrackMouseDown(event);
    this.#onDocumentMouseMove = (event) => this.#handleDocumentMouseMove(event);
    this.#onDocumentMouseUp = () => this.#completeDrag();
    this.#onTrackMouseLeave = () => this.#handleTrackMouseLeave();
    this.#onResize = this.#createThrottledResizeHandler();
  }

  mount() {
    if (this.#isMounted) {
      return;
    }

    this.#wrapper = this.#resolveElement(this.#config.selectors.wrapper);
    this.#prevButton = this.#resolveElement(this.#config.selectors.prevButton);
    this.#nextButton = this.#resolveElement(this.#config.selectors.nextButton);

    if (!this.#wrapper || !this.#prevButton || !this.#nextButton) {
      throw new Error('CarouselController could not locate required controls.');
    }

    this.#state.numVisibleCards = this.#resolveVisibleCards(window.innerWidth);

    if (!this.#reinitializeTrack()) {
      return;
    }

    this.#bindEvents();
    this.#isMounted = true;
    this.#updateCarouselLayout();
  }

  destroy() {
    if (!this.#isMounted) {
      return;
    }

    this.#unbindEvents();
    this.#isMounted = false;
    this.#state.currentIndex = 0;
    this.#state.cardWidth = 0;
    this.#state.numOriginalCards = 0;
    this.#state.leftCloneCount = 0;
    this.#state.numVisibleCards = 0;
    this.#state.isDragging = false;
    this.#state.isTransitioning = false;
    this.#state.startX = 0;
    this.#state.currentDragOffset = 0;

    if (this.#resizeTimeoutId) {
      window.clearTimeout(this.#resizeTimeoutId);
      this.#resizeTimeoutId = null;
    }

    if (this.#wrapper) {
      this.#wrapper.style.width = '';
    }

    this.#track.style.cursor = '';
    this.#track.style.transition = '';
    this.#track.style.transform = '';
    this.#removeLegacyClones();

    this.#wrapper = null;
    this.#prevButton = null;
    this.#nextButton = null;
  }

  #bindEvents() {
    this.#nextButton.addEventListener('click', this.#onNextClick);
    this.#prevButton.addEventListener('click', this.#onPrevClick);
    this.#track.addEventListener('mousedown', this.#onTrackMouseDown);
    document.addEventListener('mousemove', this.#onDocumentMouseMove);
    document.addEventListener('mouseup', this.#onDocumentMouseUp);
    this.#track.addEventListener('mouseleave', this.#onTrackMouseLeave);
    window.addEventListener('resize', this.#onResize);
  }

  #unbindEvents() {
    this.#nextButton?.removeEventListener('click', this.#onNextClick);
    this.#prevButton?.removeEventListener('click', this.#onPrevClick);
    this.#track.removeEventListener('mousedown', this.#onTrackMouseDown);
    document.removeEventListener('mousemove', this.#onDocumentMouseMove);
    document.removeEventListener('mouseup', this.#onDocumentMouseUp);
    this.#track.removeEventListener('mouseleave', this.#onTrackMouseLeave);
    window.removeEventListener('resize', this.#onResize);
  }

  #removeLegacyClones() {
    if (!this.#track) {
      return;
    }

    const clones = this.#track.querySelectorAll('[data-carousel-clone="true"]');
    clones.forEach((clone) => clone.remove());
  }

  #createThrottledResizeHandler() {
    const delay = Math.max(0, Number(this.#config.resizeDebounce) || 0);
    return () => {
      if (this.#resizeTimeoutId) {
        window.clearTimeout(this.#resizeTimeoutId);
      }

      this.#resizeTimeoutId = window.setTimeout(() => {
        this.#updateCarouselLayout();
      }, delay);
    };
  }

  #resolveElement(reference) {
    if (!reference) {
      return null;
    }

    if (reference instanceof HTMLElement) {
      return reference;
    }

    if (typeof reference === 'string') {
      return document.querySelector(reference);
    }

    return null;
  }

  #normalizeConfig(defaults, overrides) {
    const normalized = {
      breakpoints: Array.isArray(overrides.breakpoints) && overrides.breakpoints.length
        ? overrides.breakpoints
        : defaults.breakpoints,
      selectors: {
        ...defaults.selectors,
        ...(overrides.selectors || {}),
      },
      drag: {
        ...defaults.drag,
        ...(overrides.drag || {}),
      },
      resizeDebounce: typeof overrides.resizeDebounce === 'number'
        ? overrides.resizeDebounce
        : defaults.resizeDebounce,
    };

    normalized.breakpoints = [...normalized.breakpoints]
      .filter((bp) => typeof bp?.minWidth === 'number' && typeof bp?.cards === 'number')
      .sort((a, b) => b.minWidth - a.minWidth);

    if (!normalized.breakpoints.length) {
      normalized.breakpoints = [...defaults.breakpoints];
    }

    return normalized;
  }

  #updateControls() {
    if (!this.#prevButton || !this.#nextButton) {
      return;
    }

    const totalCards = this.#state.numOriginalCards;
    const visibleCards = this.#state.numVisibleCards;
    const hasEnoughCards = totalCards > visibleCards;

    this.#prevButton.disabled = !hasEnoughCards;
    this.#nextButton.disabled = !hasEnoughCards;
  }

  #reinitializeTrack() {
    const cardSelector = this.#config.selectors.card;
    const normalizedIndex = this.#resolveNormalizedCurrentIndex();

    this.#removeLegacyClones();

    const cards = this.#track.querySelectorAll(cardSelector);
    const cardCount = cards.length;

    if (!cardCount) {
      return false;
    }

    const cardWidth = this.#calculateCardWidth(cards[0]);

    if (!cardWidth) {
      return false;
    }

    this.#state.numOriginalCards = cardCount;
    this.#state.cardWidth = cardWidth;
    this.#state.leftCloneCount = 0;
    this.#state.currentIndex = 0;
    this.#state.isDragging = false;
    this.#state.isTransitioning = false;
    this.#state.currentDragOffset = 0;

    const canLoop = this.#state.numOriginalCards > this.#state.numVisibleCards;

    if (canLoop) {
      const cloneCount = this.#createClones(Array.from(cards));
      this.#state.leftCloneCount = cloneCount;

      const safeIndex = Math.min(normalizedIndex, this.#state.numOriginalCards - 1);
      this.#state.currentIndex = this.#state.leftCloneCount + safeIndex;
    }

    this.#track.style.transition = 'none';
    this.#setTrackTransform();
    this.#track.style.cursor = canLoop ? 'grab' : 'default';

    window.requestAnimationFrame(() => {
      this.#setDefaultTransition();
    });

    this.#updateWrapperWidth();
    this.#updateControls();

    return true;
  }

  #calculateCardWidth(referenceCard) {
    const card = referenceCard ?? this.#track.querySelector(this.#config.selectors.card);

    if (!(card instanceof HTMLElement)) {
      return 0;
    }

    const style = window.getComputedStyle(card);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;

    return card.offsetWidth + marginLeft + marginRight;
  }

  #resolveNormalizedCurrentIndex() {
    if (!this.#state.numOriginalCards) {
      return 0;
    }

    const total = this.#state.numOriginalCards;
    const relativeIndex = this.#state.currentIndex - this.#state.leftCloneCount;
    let normalized = relativeIndex % total;

    if (normalized < 0) {
      normalized += total;
    }

    return normalized;
  }

  #updateCarouselLayout() {
    const visibleCards = this.#resolveVisibleCards(window.innerWidth);
    const shouldReinitialize =
      visibleCards !== this.#state.numVisibleCards || !this.#state.cardWidth;

    this.#state.numVisibleCards = visibleCards;

    if (shouldReinitialize) {
      if (!this.#reinitializeTrack()) {
        return;
      }
    } else {
      const recalculatedWidth = this.#calculateCardWidth();
      if (recalculatedWidth > 0 && Math.abs(recalculatedWidth - this.#state.cardWidth) > 0.5) {
        this.#state.cardWidth = recalculatedWidth;
      }

      this.#track.style.transition = 'none';
      const normalizedIndex = this.#resolveNormalizedCurrentIndex();
      const safeIndex = Math.min(normalizedIndex, this.#state.numOriginalCards - 1);
      this.#state.currentIndex = this.#state.leftCloneCount + safeIndex;
      this.#setTrackTransform();
      window.requestAnimationFrame(() => {
        this.#setDefaultTransition();
      });
      this.#updateControls();
    }

    this.#updateWrapperWidth();
  }

  #updateWrapperWidth() {
    if (!this.#wrapper || !this.#state.cardWidth || !this.#state.numVisibleCards) {
      return;
    }

    this.#wrapper.style.width = `${this.#state.numVisibleCards * this.#state.cardWidth}px`;
  }

  #resolveVisibleCards(windowWidth) {
    for (const breakpoint of this.#config.breakpoints) {
      if (windowWidth >= breakpoint.minWidth) {
        return breakpoint.cards;
      }
    }

    return 1;
  }

  #createClones(cards) {
    if (!Array.isArray(cards) || !cards.length) {
      return 0;
    }

    const cloneCount = Math.min(this.#state.numVisibleCards, cards.length);

    if (!cloneCount) {
      return 0;
    }

    const leftFragment = document.createDocumentFragment();
    const rightFragment = document.createDocumentFragment();

    for (let i = cards.length - cloneCount; i < cards.length; i += 1) {
      const clone = cards[i].cloneNode(true);
      clone.dataset.carouselClone = 'true';
      leftFragment.appendChild(clone);
    }

    for (let i = 0; i < cloneCount; i += 1) {
      const clone = cards[i].cloneNode(true);
      clone.dataset.carouselClone = 'true';
      rightFragment.appendChild(clone);
    }

    this.#track.insertBefore(leftFragment, this.#track.firstChild);
    this.#track.appendChild(rightFragment);

    return cloneCount;
  }

  #setTrackTransform(additionalOffset = 0) {
    if (!this.#state.cardWidth) {
      this.#track.style.transform = 'translateX(0)';
      return;
    }

    const baseOffset = -this.#state.currentIndex * this.#state.cardWidth;
    const totalOffset = baseOffset + additionalOffset;
    this.#track.style.transform = `translateX(${totalOffset}px)`;
  }

  #setDefaultTransition() {
    this.#track.style.transition = 'transform 0.5s ease-in-out';
  }

  #jumpToIndex(index) {
    this.#state.currentIndex = index;
    this.#state.currentDragOffset = 0;
    this.#track.style.transition = 'none';
    this.#setTrackTransform();
    void this.#track.offsetWidth;
    this.#setDefaultTransition();
  }

  #moveToNextCard(options = {}) {
    if (
      this.#state.isTransitioning ||
      this.#state.numOriginalCards <= this.#state.numVisibleCards ||
      !this.#state.cardWidth
    ) {
      return;
    }

    const duration = options.fromDrag ? 0.3 : 0.5;
    this.#state.isTransitioning = true;
    this.#track.style.transition = `transform ${duration}s ease-in-out`;
    this.#state.currentIndex += 1;
    this.#setTrackTransform();

    const onTransitionEnd = (event) => {
      if (event.target !== this.#track || event.propertyName !== 'transform') {
        return;
      }

      this.#track.removeEventListener('transitionend', onTransitionEnd);

      const maxIndex = this.#state.leftCloneCount + this.#state.numOriginalCards;
      if (this.#state.currentIndex >= maxIndex) {
        this.#jumpToIndex(this.#state.leftCloneCount);
      } else {
        this.#state.currentDragOffset = 0;
        this.#setDefaultTransition();
      }

      this.#state.isTransitioning = false;
      this.#updateControls();
    };

    this.#track.addEventListener('transitionend', onTransitionEnd);
  }

  #moveToPreviousCard(options = {}) {
    if (
      this.#state.isTransitioning ||
      this.#state.numOriginalCards <= this.#state.numVisibleCards ||
      !this.#state.cardWidth
    ) {
      return;
    }

    const duration = options.fromDrag ? 0.3 : 0.5;
    this.#state.isTransitioning = true;
    this.#track.style.transition = `transform ${duration}s ease-in-out`;
    this.#state.currentIndex -= 1;
    this.#setTrackTransform();

    const onTransitionEnd = (event) => {
      if (event.target !== this.#track || event.propertyName !== 'transform') {
        return;
      }

      this.#track.removeEventListener('transitionend', onTransitionEnd);

      if (this.#state.currentIndex < this.#state.leftCloneCount) {
        const lastIndex =
          this.#state.leftCloneCount + this.#state.numOriginalCards - 1;
        this.#jumpToIndex(lastIndex);
      } else {
        this.#state.currentDragOffset = 0;
        this.#setDefaultTransition();
      }

      this.#state.isTransitioning = false;
      this.#updateControls();
    };

    this.#track.addEventListener('transitionend', onTransitionEnd);
  }

  #handleTrackMouseDown(event) {
    if (
      this.#state.isTransitioning ||
      this.#state.numOriginalCards <= this.#state.numVisibleCards ||
      !this.#state.cardWidth
    ) {
      return;
    }

    if (this.#config.drag.exclude && event.target instanceof HTMLElement) {
      if (event.target.closest(this.#config.drag.exclude)) {
        return;
      }
    }

    this.#state.isDragging = true;
    this.#state.startX = event.pageX;
    this.#state.currentDragOffset = 0;
    this.#track.style.transition = 'none';
    this.#setTrackTransform();
    this.#track.style.cursor = 'grabbing';

    event.preventDefault();
  }

  #handleDocumentMouseMove(event) {
    if (!this.#state.isDragging) {
      return;
    }

    const dx = event.pageX - this.#state.startX;
    this.#state.currentDragOffset = dx;
    this.#setTrackTransform(dx);
  }

  #handleDocumentMouseUp() {
    this.#completeDrag();
  }

  #handleTrackMouseLeave() {
    if (this.#state.isDragging) {
      this.#completeDrag();
    }
  }

  #completeDrag() {
    if (!this.#state.isDragging) {
      return;
    }

    this.#state.isDragging = false;
    this.#track.style.cursor =
      this.#state.numOriginalCards > this.#state.numVisibleCards ? 'grab' : 'default';

    const dx = this.#state.currentDragOffset;
    const threshold = this.#state.cardWidth * this.#config.drag.threshold;
    this.#state.currentDragOffset = 0;

    if (dx < -threshold && this.#state.numOriginalCards > this.#state.numVisibleCards) {
      window.requestAnimationFrame(() => {
        this.#moveToNextCard({ fromDrag: true });
      });
      return;
    }

    if (dx > threshold && this.#state.numOriginalCards > this.#state.numVisibleCards) {
      window.requestAnimationFrame(() => {
        this.#moveToPreviousCard({ fromDrag: true });
      });
      return;
    }

    if (Math.abs(dx) < 1) {
      this.#setDefaultTransition();
      this.#setTrackTransform();
      return;
    }

    this.#track.style.transition = 'transform 0.3s ease-in-out';
    this.#setTrackTransform();

    const onSnapEnd = () => {
      this.#track.removeEventListener('transitionend', onSnapEnd);
      this.#setDefaultTransition();
    };

    this.#track.addEventListener('transitionend', onSnapEnd, { once: true });
  }
  }

  global.CarouselController = CarouselController;
})(typeof window !== 'undefined' ? window : this);
