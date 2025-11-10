document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.site-nav');

  if (!navbar) {
    console.error('Navbar element not found. Check class name.');
    return;
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      navbar.classList.add('site-nav--scrolled');
    } else {
      navbar.classList.remove('site-nav--scrolled');
    }
  });

  const toggleButton = navbar.querySelector('.site-nav__toggle');
  const navLinksGroup = navbar.querySelector('.site-nav__links');

  if (toggleButton && navLinksGroup) {
    toggleButton.addEventListener('click', () => {
      const isMenuOpen = toggleButton.classList.toggle('is-open');
      navLinksGroup.classList.toggle('is-open');
      toggleButton.setAttribute('aria-expanded', String(isMenuOpen));
    });

    const navLinks = navLinksGroup.querySelectorAll('.site-nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinksGroup.classList.contains('is-open')) {
          toggleButton.classList.remove('is-open');
          navLinksGroup.classList.remove('is-open');
          toggleButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  } else {
    console.error('Hamburger button or nav links group not found. Check class names.');
  }
});
