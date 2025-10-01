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

  const hamburgerBtn = document.querySelector('.site-nav__toggle');
  const navLinksGroup = document.querySelector('.site-nav [data-nav-links]');

  if (hamburgerBtn && navLinksGroup) {
    hamburgerBtn.addEventListener('click', () => {
      const isMenuOpen = hamburgerBtn.classList.toggle('site-nav__toggle--open');
      navLinksGroup.classList.toggle('site-nav__links--open');
      hamburgerBtn.setAttribute('aria-expanded', isMenuOpen);
    });

    // Close menu when a link is clicked
    const navLinks = navLinksGroup.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinksGroup.classList.contains('site-nav__links--open')) {
          hamburgerBtn.classList.remove('site-nav__toggle--open');
          navLinksGroup.classList.remove('site-nav__links--open');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  } else {
    console.error('Hamburger button or nav links group not found. Check class names.');
  }
});
