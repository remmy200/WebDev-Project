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

//10. NEWSLETTER FORM - offers.html
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input[type="email"]');
    if (!input || !input.value) return;

    // Replace form with success message
    newsletterForm.innerHTML = `
      <p class="font-serif text-muted">
        <i class="fa-solid fa-check-circle text-gold"></i>
        Thank you — you're on the list. We'll be in touch with our next offer.
      </p>`;
  });
}

//11. MULTI-STEP BOOKING FORM
const bookingNextBtns = document.querySelectorAll('.booking-next');
const bookingBackBtns = document.querySelectorAll('.booking-back');
const bookingSteps    = document.querySelectorAll('.booking-step');
const bookingPanels   = document.querySelectorAll('.booking-panel');

function showPanel(stepNum) {
  bookingPanels.forEach(panel => panel.classList.remove('active'));
  bookingSteps.forEach(step  => step.classList.remove('active', 'completed'));

  const target = document.getElementById(`panel-${stepNum}`);
  if (target) target.classList.add('active');

  bookingSteps.forEach(step => {
    const num = parseInt(step.dataset.step);
    if (num < stepNum)  step.classList.add('completed');
    if (num === stepNum) step.classList.add('active');
  });

  // Scroll to form top smoothly
  const formTop = document.getElementById('reservationForm');
  if (formTop) formTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (bookingNextBtns.length > 0) {
  bookingNextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.dataset.next);

      // Basic validation before advancing
      if (next === 2) {
        const checkin  = document.getElementById('resCheckin')?.value;
        const checkout = document.getElementById('resCheckout')?.value;
        if (!checkin || !checkout) {
          alert('Please select your check-in and check-out dates.');
          return;
        }
        if (checkout <= checkin) {
          alert('Check-out must be after check-in.');
          return;
        }
        updateSidebar();
      }

      if (next === 3) {
        const chosen = document.querySelector('input[name="roomChoice"]:checked');
        if (!chosen) {
          alert('Please select a room to continue.');
          return;
        }
        updateSidebar();
      }

      if (next === 4) {
        const firstName = document.getElementById('resFirstName')?.value;
        const lastName  = document.getElementById('resLastName')?.value;
        const email     = document.getElementById('resEmail')?.value;
        const phone     = document.getElementById('resPhone')?.value;
        if (!firstName || !lastName || !email || !phone) {
          alert('Please fill in all required fields.');
          return;
        }
        updateSidebar();
        populateConfirmSummary();
      }

      showPanel(next);
    });
  });
}

if (bookingBackBtns.length > 0) {
  bookingBackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showPanel(parseInt(btn.dataset.back));
    });
  });
}

// Update the sidebar summary as the user fills in the form
function updateSidebar() {
  const checkin  = document.getElementById('resCheckin')?.value;
  const checkout = document.getElementById('resCheckout')?.value;
  const adults   = document.getElementById('resAdults')?.value   || '2';
  const children = document.getElementById('resChildren')?.value || '0';
  const chosen   = document.querySelector('input[name="roomChoice"]:checked');

  // Dates
  const sumCheckin  = document.getElementById('sumCheckin');
  const sumCheckout = document.getElementById('sumCheckout');
  if (sumCheckin  && checkin)  sumCheckin.textContent  = formatDate(checkin);
  if (sumCheckout && checkout) sumCheckout.textContent = formatDate(checkout);

  // Guests
  const sumGuests = document.getElementById('sumGuests');
  if (sumGuests) {
    let guestStr = `${adults} adult${adults > 1 ? 's' : ''}`;
    if (parseInt(children) > 0) guestStr += `, ${children} child${children > 1 ? 'ren' : ''}`;
    sumGuests.textContent = guestStr;
  }

  // Room and total
  const sumRoom  = document.getElementById('sumRoom');
  const sumTotal = document.getElementById('sumTotal');

  if (chosen && sumRoom) {
    // Get the label text (room name) from the parent card
    const label = chosen.closest('.room-select-card');
    const name  = label?.querySelector('h4')?.textContent || chosen.value;
    sumRoom.textContent = name;

    if (sumTotal && checkin && checkout) {
      const nights    = calcNights(checkin, checkout);
      const price     = parseInt(chosen.dataset.price) || 0;
      const total     = nights * price;
      sumTotal.textContent = `€${total.toLocaleString()}`;
    }
  }
}

// Populate the confirmation panel summary (step 4)
function populateConfirmSummary() {
  const summaryBox = document.getElementById('bookingSummary');
  if (!summaryBox) return;

  const checkin    = document.getElementById('resCheckin')?.value;
  const checkout   = document.getElementById('resCheckout')?.value;
  const adults     = document.getElementById('resAdults')?.value || '2';
  const children   = document.getElementById('resChildren')?.value || '0';
  const firstName  = document.getElementById('resFirstName')?.value || '';
  const lastName   = document.getElementById('resLastName')?.value  || '';
  const email      = document.getElementById('resEmail')?.value     || '';
  const phone      = document.getElementById('resPhone')?.value     || '';
  const requests   = document.getElementById('resRequests')?.value  || 'None';
  const chosen     = document.querySelector('input[name="roomChoice"]:checked');
  const label      = chosen?.closest('.room-select-card');
  const roomName   = label?.querySelector('h4')?.textContent || '—';
  const nights     = checkin && checkout ? calcNights(checkin, checkout) : 0;
  const price      = parseInt(chosen?.dataset.price) || 0;
  const total      = nights * price;

  summaryBox.innerHTML = `
    <table class="table-chateau">
      <tbody>
        <tr><td>Name</td><td>${firstName} ${lastName}</td></tr>
        <tr><td>Email</td><td>${email}</td></tr>
        <tr><td>Phone</td><td>${phone}</td></tr>
        <tr><td>Check-In</td><td>${formatDate(checkin)}</td></tr>
        <tr><td>Check-Out</td><td>${formatDate(checkout)}</td></tr>
        <tr><td>Nights</td><td>${nights}</td></tr>
        <tr><td>Guests</td><td>${adults} adult(s), ${children} child(ren)</td></tr>
        <tr><td>Room</td><td>${roomName}</td></tr>
        <tr><td><strong>Estimated Total</strong></td><td><strong>€${total.toLocaleString()}</strong></td></tr>
        <tr><td>Special Requests</td><td>${requests}</td></tr>
      </tbody>
    </table>`;
}

// Reservation form submit (step 4)
const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
  reservationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const terms = document.getElementById('resTerms');
    if (!terms?.checked) {
      alert('Please agree to the cancellation policy to continue.');
      return;
    }
    // Replace form with confirmation message
    const container = reservationForm.closest('.col-lg-8');
    if (container) {
      container.innerHTML = `
        <div class="booking-confirm">
          <i class="fa-solid fa-circle-check booking-confirm__icon"></i>
          <h3 class="font-display">Reservation Request Received</h3>
          <p class="text-muted mt-3">Thank you for choosing Château de Remmy. Our reservations team will contact you within 24 hours to confirm your booking.</p>
          <a href="index.html" class="btn-chateau btn-chateau--filled mt-4">Return Home</a>
        </div>`;
    }
  });
}

// Pre-fill dates from URL params if arriving from quick-book
(function prefillFromURL() {
  const params   = new URLSearchParams(window.location.search);
  const checkin  = params.get('checkin');
  const checkout = params.get('checkout');
  const ci = document.getElementById('resCheckin');
  const co = document.getElementById('resCheckout');
  if (ci && checkin)  ci.value = checkin;
  if (co && checkout) co.value = checkout;
  if (checkin || checkout) updateSidebar();
})();

// 12. CONTACT FORM - contact.html
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const emailInput = document.getElementById('contactEmail');
  const phoneInput = document.getElementById('contactPhone');
  const emailError = document.getElementById('contactEmailError');
  const phoneError = document.getElementById('contactPhoneError');

  // Real-time email validation
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
      if (emailError) {
        emailError.textContent = valid || !emailInput.value ? '' : 'Please enter a valid email address.';
      }
    });
  }

  // Real-time phone validation (accepts +254 Kenya and +33 France formats)
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      const val   = phoneInput.value.trim();
      const valid = !val || /^(\+?[\d\s\-()]{7,15})$/.test(val);
      if (phoneError) {
        phoneError.textContent = valid ? '' : 'Please enter a valid phone number.';
      }
    });
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('contactName')?.value.trim();
    const email   = emailInput?.value.trim();
    const subject = document.getElementById('contactSubject')?.value;
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const success = document.getElementById('contactFormSuccess');
    if (success) success.classList.remove('d-none');
    contactForm.reset();
  });
}


//13. EVENT INQUIRY FORM - events.html
const eventForm = document.getElementById('eventInquiryForm');

if (eventForm) {
  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('eventName')?.value.trim();
    const email = document.getElementById('eventEmail')?.value.trim();
    const type  = document.getElementById('eventType')?.value;

    if (!name || !email || !type) {
      alert('Please fill in your name, email, and event type.');
      return;
    }

    const success = document.getElementById('eventFormSuccess');
    if (success) success.classList.remove('d-none');
    eventForm.reset();
  });
}

//14. FAQ AND FILTER - FAQ.html
const faqSearchInput = document.getElementById('faqSearchInput');
const faqFilterBtns  = document.querySelectorAll('[data-faqfilter]');
const faqItems       = document.querySelectorAll('.faq-item');
const noFaqMsg       = document.getElementById('noFaqMsg');

let currentFaqFilter = 'all';

function applyFaqFilters() {
  const searchTerm = faqSearchInput?.value.toLowerCase().trim() || '';
  let visible = 0;

  faqItems.forEach(item => {
    const questionEl = item.querySelector('.accordion-button');
    const answerEl   = item.querySelector('.accordion-body');
    const question   = questionEl?.textContent.toLowerCase() || '';
    const answer     = answerEl?.textContent.toLowerCase()   || '';
    const category   = item.dataset.category || '';

    const matchesFilter = currentFaqFilter === 'all' || category === currentFaqFilter;
    const matchesSearch = !searchTerm || question.includes(searchTerm) || answer.includes(searchTerm);

    const show = matchesFilter && matchesSearch;
    item.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  if (noFaqMsg) {
    noFaqMsg.classList.toggle('d-none', visible > 0);
  }
}

// Category filter
if (faqFilterBtns.length > 0) {
  faqFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      faqFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFaqFilter = btn.dataset.faqfilter;
      applyFaqFilters();
    });
  });
}

// Search input
if (faqSearchInput) {
  faqSearchInput.addEventListener('input', applyFaqFilters);
}

//15. HELPER FUNCTIONS
// Format ISO date string to readable format e.g. "Mon, 14 Jul 2026"
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Calculate nights between two ISO date strings
function calcNights(checkin, checkout) {
  if (!checkin || !checkout) return 0;
  const ci = new Date(checkin  + 'T00:00:00');
  const co = new Date(checkout + 'T00:00:00');
  return Math.max(0, Math.round((co - ci) / (1000 * 60 * 60 * 24)));
}












