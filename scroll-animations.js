const initScrollAnimations = () => {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (revealElements.length === 0) {
    return;
  }

  const showElement = (element) => {
    element.classList.add('is-visible');
  };

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(showElement);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, {
    threshold: 0.2,
  });

  revealElements.forEach((element) => {
    observer.observe(element);

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      showElement(element);
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
  initScrollAnimations();
}
