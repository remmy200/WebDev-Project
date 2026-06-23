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

//6. ROOM FILTER - ROOMS.HTML
const roomFilterBtns = document.querySelectorAll('[data-filter]');
const roomCards      = document.querySelectorAll('.room-card-wrap');
const noRoomsMsg     = document.getElementById('noRoomsMsg');

if (roomFilterBtns.length > 0) {
  roomFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roomFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visible  = 0;

      roomCards.forEach(card => {
        const cats   = card.dataset.category || '';
        const show   = filter === 'all' || cats.includes(filter);
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });

      if (noRoomsMsg) {
        noRoomsMsg.classList.toggle('d-none', visible > 0);
      }
    });
  });
}


//7. GALLERY FILTER - Gallery.html
const galleryFilterBtns = document.querySelectorAll('[data-gfilter]');
const galleryItems      = document.querySelectorAll('.gallery-item');
const noPhotosMsg       = document.getElementById('noPhotosMsg');

if (galleryFilterBtns.length > 0) {
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.gfilter;
      let visible  = 0;

      galleryItems.forEach(item => {
        const cat   = item.dataset.category;
        const show  = filter === 'all' || cat === filter;
        item.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });

      if (noPhotosMsg) {
        noPhotosMsg.classList.toggle('d-none', visible > 0);
      }
    });
  });
}


//8. GALLERY LIGHTBOX - gallery.html
const lightboxModal   = document.getElementById('lightboxModal');
const lightboxImage   = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');

if (lightboxModal) {
  lightboxModal.addEventListener('show.bs.modal', (e) => {
    const trigger = e.relatedTarget; // the img that was clicked
    if (!trigger) return;
    const src     = trigger.dataset.img     || trigger.src;
    const caption = trigger.dataset.caption || trigger.alt;
    if (lightboxImage)   lightboxImage.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption;
  });

  lightboxModal.addEventListener('hidden.bs.modal', () => {
    if (lightboxImage)   lightboxImage.src = '';
    if (lightboxCaption) lightboxCaption.textContent = '';
  });
}


//9. COUNTDOWN TIMER - offers.html
const countdownEl = document.getElementById('offerCountdown');

if (countdownEl) {
  const deadline = new Date(countdownEl.dataset.deadline).getTime();

  const cdDays    = document.getElementById('cdDays');
  const cdHours   = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function updateCountdown() {
    const now  = Date.now();
    const diff = deadline - now;

    if (diff <= 0) {
      if (cdDays)    cdDays.textContent    = '00';
      if (cdHours)   cdHours.textContent   = '00';
      if (cdMinutes) cdMinutes.textContent = '00';
      if (cdSeconds) cdSeconds.textContent = '00';
      clearInterval(countdownTimer);
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (cdDays)    cdDays.textContent    = pad(days);
    if (cdHours)   cdHours.textContent   = pad(hours);
    if (cdMinutes) cdMinutes.textContent = pad(minutes);
    if (cdSeconds) cdSeconds.textContent = pad(seconds);
  }

  updateCountdown();
  const countdownTimer = setInterval(updateCountdown, 1000);
}






