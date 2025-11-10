export class CarouselController {
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

  #reinitializeTrack() {
    const cardSelector = this.#config.selectors.card;
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
    this.#state.currentIndex %= cardCount;
    this.#state.isDragging = false;
    this.#state.isTransitioning = false;
    this.#state.currentDragOffset = 0;

    this.#track.style.transition = 'none';
    this.#track.style.transform = 'translateX(0)';
    this.#track.style.cursor = 'grab';

    window.requestAnimationFrame(() => {
      this.#track.style.transition = 'transform 0.5s ease';
    });

    this.#updateWrapperWidth();

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

  #moveToNextCard() {
    if (this.#state.isTransitioning || this.#state.numOriginalCards <= 1) {
      return;
    }

    this.#state.isTransitioning = true;
    this.#track.style.transition = 'transform 0.5s ease';
    this.#track.style.transform = `translateX(-${this.#state.cardWidth}px)`;

    const onTransitionEnd = () => {
      this.#track.removeEventListener('transitionend', onTransitionEnd);
      this.#track.appendChild(this.#track.firstElementChild);
      this.#finalizeTransition('next');
    };

    this.#track.addEventListener('transitionend', onTransitionEnd, { once: true });
  }

  #moveToPreviousCard() {
    if (this.#state.isTransitioning || this.#state.numOriginalCards <= 1) {
      return;
    }

    const lastCard = this.#track.lastElementChild;
    if (!lastCard) {
      return;
    }

    this.#state.isTransitioning = true;
    this.#track.style.transition = 'none';
    this.#track.insertBefore(lastCard, this.#track.firstElementChild);
    this.#track.style.transform = `translateX(-${this.#state.cardWidth}px)`;

    window.requestAnimationFrame(() => {
      this.#track.style.transition = 'transform 0.5s ease';
      this.#track.style.transform = 'translateX(0)';
    });

    const onTransitionEnd = () => {
      this.#track.removeEventListener('transitionend', onTransitionEnd);
      this.#finalizeTransition('prev');
    };

    this.#track.addEventListener('transitionend', onTransitionEnd, { once: true });
  }

  #finalizeTransition(direction) {
    this.#track.style.transition = 'none';
    this.#track.style.transform = 'translateX(0)';

    window.requestAnimationFrame(() => {
      this.#track.style.transition = 'transform 0.5s ease';
    });

    const total = this.#state.numOriginalCards;
    if (total > 0) {
      if (direction === 'next') {
        this.#state.currentIndex = (this.#state.currentIndex + 1) % total;
      } else if (direction === 'prev') {
        this.#state.currentIndex = (this.#state.currentIndex - 1 + total) % total;
      }
    }

    this.#state.isTransitioning = false;
  }

  #handleTrackMouseDown(event) {
    if (this.#state.isTransitioning || this.#state.numOriginalCards <= 1) {
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
    this.#track.style.cursor = 'grabbing';

    event.preventDefault();
  }

  #handleDocumentMouseMove(event) {
    if (!this.#state.isDragging) {
      return;
    }

    const dx = event.pageX - this.#state.startX;
    this.#state.currentDragOffset = dx;
    this.#track.style.transform = `translateX(${dx}px)`;
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
    this.#track.style.cursor = 'grab';

    const dx = this.#state.currentDragOffset;
    const threshold = this.#state.cardWidth * this.#config.drag.threshold;
    this.#state.currentDragOffset = 0;

    if (dx < -threshold) {
      this.#track.style.transition = 'none';
      this.#track.style.transform = 'translateX(0)';
      this.#moveToNextCard();
      return;
    }

    if (dx > threshold) {
      this.#track.style.transition = 'none';
      this.#track.style.transform = 'translateX(0)';
      this.#moveToPreviousCard();
      return;
    }

    this.#track.style.transition = 'transform 0.3s ease';
    this.#track.style.transform = 'translateX(0)';

    const onSnapEnd = () => {
      this.#track.removeEventListener('transitionend', onSnapEnd);
      this.#track.style.transition = 'transform 0.5s ease';
    };

    this.#track.addEventListener('transitionend', onSnapEnd, { once: true });
  }
}
