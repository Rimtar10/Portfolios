/* Mariam Tarhini: Neuro-Industrial Leadership landing page
   Plain JavaScript, no dependencies, no tracking. */

/* ------------------------------------------------------------------
   CONFIG: Calendly booking links
   Paste the two Calendly event URLs here (they must start with https://).
     org      = Organizational Discovery Call, 30 min
     coaching = 1:1 Coaching Conversation, 20 min
   While a value is empty, its buttons keep their fallback behaviour:
   organization buttons scroll to Let's Talk / open email, and the
   coaching card button stays disabled.
------------------------------------------------------------------- */
const CALENDLY = {
  org: '',
  coaching: '',
};

/* ---------- Booking CTAs ---------- */
document.querySelectorAll('[data-calendly]').forEach((link) => {
  const url = CALENDLY[link.dataset.calendly];
  if (!/^https:\/\//i.test(url || '')) return;

  link.href = url;
  link.target = '_blank';                 // booking page opens in a new tab
  link.rel = 'noopener noreferrer';
  link.removeAttribute('aria-disabled');
  link.removeAttribute('role');
  link.removeAttribute('title');
  link.classList.remove('is-pending');

  const note = document.createElement('span');
  note.className = 'visually-hidden';
  note.textContent = ' (opens in a new tab)';
  link.appendChild(note);
});

/* ---------- Compact sticky header while scrolling ---------- */
const header = document.querySelector('.site-header');
let ticking = false;

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    window.requestAnimationFrame(updateHeader);
  }
}, { passive: true });
updateHeader();

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

// Close when tapping outside the header
document.addEventListener('click', (event) => {
  if (toggle?.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) {
    setMenu(false);
  }
});

/* ---------- Footer year ---------- */
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
