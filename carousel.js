(function () {
  const BP_3_CARDS = 1598; // to show 3 cards
  const BP_2_CARDS = 1132; // to show 2 cards (else 1)

  document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const leftBtn = document.getElementById('prev-btn');
    const rightBtn = document.getElementById('next-btn');
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    if (!track || !leftBtn || !rightBtn || !carouselWrapper) {
      console.error('Carousel elements not found. Check IDs and classes.');
      return;
    }

    let numOriginalCards = 0;
    let cardWidth = 0;
    let currentNumVisibleCards = 0;
    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let isTransitioning = false;
    let resizeTimeout;
    let currentDragOffset = 0;

    function calculateCardWidth() {
      const referenceCard = track.querySelector('.card');
      if (!referenceCard) return 0;
      const cardStyle = window.getComputedStyle(referenceCard);
      const cardMarginLeft = parseFloat(cardStyle.marginLeft);
      const cardMarginRight = parseFloat(cardStyle.marginRight);
      const cardClientWidth = referenceCard.offsetWidth;
      return cardClientWidth + cardMarginLeft + cardMarginRight;
    }

    function initializeCarousel() {
      console.log(`Initializing carousel with ${currentNumVisibleCards} visible cards.`);

      numOriginalCards = track.querySelectorAll('.card').length;

      if (numOriginalCards === 0) {
        console.warn('No cards found in the carousel track.');
        return;
      }

      cardWidth = calculateCardWidth();
      if (cardWidth <= 0) {
        console.error('Card width calculation resulted in zero or negative. Check card styling and rendering.');
        return;
      }

      currentIndex = currentIndex % numOriginalCards;
      isDragging = false;
      isTransitioning = false;
      track.style.transition = 'none';
      track.style.transform = 'translateX(0)';
      track.style.cursor = 'grab';

      requestAnimationFrame(() => {
        track.style.transition = 'transform 0.5s ease';
      });
    }

    function updateCarouselLayout() {
      const windowWidth = window.innerWidth;
      let newNumVisibleCards;

      if (windowWidth >= BP_3_CARDS) {
        newNumVisibleCards = 3;
      } else if (windowWidth >= BP_2_CARDS) {
        newNumVisibleCards = 2;
      } else {
        newNumVisibleCards = 1;
      }

      const shouldReinitialize = newNumVisibleCards !== currentNumVisibleCards || currentNumVisibleCards === 0;

      if (shouldReinitialize) {
        currentNumVisibleCards = newNumVisibleCards;
        initializeCarousel();
      } else {
        const recalculatedCardWidth = calculateCardWidth();
        if (recalculatedCardWidth > 0 && Math.abs(recalculatedCardWidth - cardWidth) > 0.5) {
          cardWidth = recalculatedCardWidth;
        }
      }

      if (carouselWrapper && cardWidth > 0) {
        carouselWrapper.style.width = (currentNumVisibleCards * cardWidth) + 'px';
      }
    }

    function handleTransitionEnd(direction) {
      return () => {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        requestAnimationFrame(() => {
          track.style.transition = 'transform 0.5s ease';
          isTransitioning = false;
        });
        if (direction === 'next') {
          currentIndex = (currentIndex + 1) % numOriginalCards;
        } else {
          currentIndex = (currentIndex - 1 + numOriginalCards) % numOriginalCards;
        }
      };
    }

    function moveToNextCard() {
      if (isTransitioning || numOriginalCards <= 1) return;

      isTransitioning = true;
      track.style.transition = 'transform 0.5s ease';
      track.style.transform = `translateX(-${cardWidth}px)`;

      const onTransitionEnd = () => {
        track.removeEventListener('transitionend', onTransitionEnd);
        track.appendChild(track.firstElementChild);
        handleTransitionEnd('next')();
      };

      track.addEventListener('transitionend', onTransitionEnd, { once: true });
    }

    function moveToPreviousCard() {
      if (isTransitioning || numOriginalCards <= 1) return;

      isTransitioning = true;
      track.style.transition = 'none';
      track.insertBefore(track.lastElementChild, track.firstElementChild);
      track.style.transform = `translateX(-${cardWidth}px)`;

      requestAnimationFrame(() => {
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = 'translateX(0)';
      });

      const onTransitionEnd = () => {
        track.removeEventListener('transitionend', onTransitionEnd);
        handleTransitionEnd('prev')();
      };

      track.addEventListener('transitionend', onTransitionEnd, { once: true });
    }

    function handleDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = 'grab';
      const dx = currentDragOffset;
      const threshold = cardWidth / 4;

      if (dx < -threshold) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        moveToNextCard();
      } else if (dx > threshold) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        moveToPreviousCard();
      } else {
        track.style.transition = 'transform 0.3s ease';
        track.style.transform = 'translateX(0)';
        const snapHandler = () => {
          track.removeEventListener('transitionend', snapHandler);
          track.style.transition = 'transform 0.5s ease';
        };
        track.addEventListener('transitionend', snapHandler, { once: true });
      }

      currentDragOffset = 0;
    }

    updateCarouselLayout();

    rightBtn.addEventListener('click', moveToNextCard);
    leftBtn.addEventListener('click', moveToPreviousCard);

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCarouselLayout, 250);
    });

    track.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, a, input, textarea')) {
        return;
      }
      if (isTransitioning || numOriginalCards <= 1) {
        return;
      }
      isDragging = true;
      startX = e.pageX;
      currentDragOffset = 0;
      track.style.transition = 'none';
      track.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.pageX - startX;
      currentDragOffset = dx;
      track.style.transform = `translateX(${dx}px)`;
    });

    document.addEventListener('mouseup', handleDragEnd);
    track.addEventListener('mouseleave', (e) => {
      if (isDragging) {
        handleDragEnd(e);
      }
    });
  });
})();
