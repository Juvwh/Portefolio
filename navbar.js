document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');

  if (!navbar) {
    return;
  }

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 0);
  }, { passive: true });

  const hamburgerBtn = navbar.querySelector('.hamburger-menu');
  const navLinksGroup = navbar.querySelector('.nav-links-group');

  if (!hamburgerBtn || !navLinksGroup) {
    return;
  }

  function setMenuOpen(isOpen) {
    hamburgerBtn.classList.toggle('open', isOpen);
    navLinksGroup.classList.toggle('mobile-menu-open', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  }

  hamburgerBtn.addEventListener('click', () => {
    setMenuOpen(!navLinksGroup.classList.contains('mobile-menu-open'));
  });

  // Close the menu when a link is clicked or Escape is pressed
  navLinksGroup.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenuOpen(false);
    }
  });
});
