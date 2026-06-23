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

//2.Back to top button responsivennes
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

//3. SCROLL REVEAL ANIMATIONS
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));
}

//4. ACTIVE NAV LINK - Highlight current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
  }
});

//5. RESERVE.HTML DATE VALIDATIONS
const quickBookForm = document.getElementById('quickBookForm');

if (quickBookForm) {
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  const checkinInput  = document.getElementById('qbCheckin');
  const checkoutInput = document.getElementById('qbCheckout');

  if (checkinInput)  checkinInput.setAttribute('min', today);
  if (checkoutInput) checkoutInput.setAttribute('min', today);

  // When check-in changes, push check-out min forward
  if (checkinInput) {
    checkinInput.addEventListener('change', () => {
      if (checkoutInput) {
        checkoutInput.setAttribute('min', checkinInput.value);
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
          checkoutInput.value = '';
        }
      }
    });
  }

  quickBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkin  = checkinInput?.value;
    const checkout = checkoutInput?.value;

    if (!checkin || !checkout) {
      alert('Please select both check-in and check-out dates.');
      return;
    }
    if (checkout <= checkin) {
      alert('Check-out must be after check-in.');
      return;
    }
    // Redirect to reservations with dates in URL query
    window.location.href = `reservations.html?checkin=${checkin}&checkout=${checkout}`;
  });
}





