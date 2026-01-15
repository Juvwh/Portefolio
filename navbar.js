(function initNavbar() {
  const toggleButton = document.querySelector('.nav__toggle');
  const navGroup = document.querySelector('.nav__group');

  if (!toggleButton || !navGroup) {
    return;
  }

  function toggleMenu() {
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    toggleButton.setAttribute('aria-expanded', !isExpanded);
    toggleButton.classList.toggle('nav__toggle--open');
    navGroup.classList.toggle('nav__group--open');
  }

  function closeMenu() {
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.classList.remove('nav__toggle--open');
    navGroup.classList.remove('nav__group--open');
  }

  toggleButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', (event) => {
    if (navGroup.classList.contains('nav__group--open') &&
        !navGroup.contains(event.target) &&
        !toggleButton.contains(event.target)) {
      closeMenu();
    }
  });

  const links = navGroup.querySelectorAll('.nav__link');
  links.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
})();
