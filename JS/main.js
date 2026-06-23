//main Java script for all webpages in this website
'use strict;'


//Navbar scroll state and rhe mobile drawer
const navbar    = document.getElementById('mainNavbar');
const toggler   = document.getElementById('navToggler');
const drawer    = document.getElementById('navDrawer');
const overlay   = document.getElementById('drawerOverlay');

// Transparent → solid on scroll (home page only)
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// Mobile drawer open / close
function openDrawer() {
  drawer.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (toggler) toggler.addEventListener('click', openDrawer);
if (overlay) overlay.addEventListener('click', closeDrawer);

// Close drawer on link click
if (drawer) {
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}
