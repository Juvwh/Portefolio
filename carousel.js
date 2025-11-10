(function initCarousel(global) {
  const CarouselController = global.CarouselController;
  if (!CarouselController) {
    console.error('CarouselController is not available.');
    return;
  }

  let carouselInstance = null;

  function initializeCarousel() {
  if (carouselInstance) {
    return carouselInstance;
  }

  const track = document.querySelector('#carousel-track');
  const wrapper = document.querySelector('.project-carousel__viewport');
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

  function getCarouselController() {
    return carouselInstance;
  }

  function destroyCarousel() {
  if (!carouselInstance) {
    return;
  }

  carouselInstance.destroy();
  carouselInstance = null;
  }

  function mountCarousel() {
    return initializeCarousel();
  }

  global.carouselApi = {
    getCarouselController,
    destroyCarousel,
    mountCarousel,
  };
})(typeof window !== 'undefined' ? window : this);
