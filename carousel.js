import { CarouselController } from './scripts/carousel/carouselController.js';

let carouselInstance = null;

function initializeCarousel() {
  if (carouselInstance) {
    return carouselInstance;
  }

  const track = document.querySelector('#carousel-track');
  const wrapper = document.querySelector('.carousel-wrapper');
  const prevButton = document.querySelector('#prev-btn');
  const nextButton = document.querySelector('#next-btn');

  if (!track || !wrapper || !prevButton || !nextButton) {
    return null;
  }

  const controller = new CarouselController(track, {
    selectors: {
      wrapper,
      prevButton,
      nextButton,
    },
  });

  controller.mount();
  carouselInstance = controller;
  return carouselInstance;
}

function handleDOMContentLoaded() {
  initializeCarousel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', handleDOMContentLoaded, { once: true });
} else {
  handleDOMContentLoaded();
}

export function getCarouselController() {
  return carouselInstance;
}

export function destroyCarousel() {
  if (!carouselInstance) {
    return;
  }

  carouselInstance.destroy();
  carouselInstance = null;
}

export function mountCarousel() {
  return initializeCarousel();
}
