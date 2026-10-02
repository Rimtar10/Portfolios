/* Mariam Tarhini: Neuro-Industrial Leadership landing page
   Plain JavaScript, no dependencies. */

/* ------------------------------------------------------------------
   CONFIG: 1:1 booking link
   PENDING: replace the value below with the real scheduling URL
   (must start with https://). While it is still "PENDING_BOOKING_URL"
   the "Book a Conversation" button stays disabled on purpose.
------------------------------------------------------------------- */
const BOOKING_URL = 'PENDING_BOOKING_URL';

/* ---------- Booking CTA ---------- */
const booking = document.querySelector('#booking-link');
if (booking && /^https:\/\//i.test(BOOKING_URL)) {
  booking.href = BOOKING_URL;
  booking.target = '_blank';
  booking.rel = 'noopener noreferrer';
  booking.removeAttribute('aria-disabled');
  booking.removeAttribute('role');
  booking.removeAttribute('title');
  booking.classList.remove('booking-pending');
}

/* ---------- Mobile menu ---------- */
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

function setMenu(open) {
  if (!toggle || !nav) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('is-open', open);
}

toggle?.addEventListener('click', () => {
  setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});

// Close after choosing a link
nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

// Close with Escape and return focus to the toggle
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});

// Close when clicking outside the header
document.addEventListener('click', (event) => {
  if (toggle?.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) {
    setMenu(false);
  }
});

/* ---------- Footer year ---------- */
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
