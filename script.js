document.documentElement.classList.add('js');

const body = document.body;
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const progress = document.querySelector('.scroll-marker i');
const walkthrough = document.querySelector('[data-walkthrough]');
const walkFrames = [...document.querySelectorAll('[data-walk-frame]')];
const walkCopy = document.querySelector('[data-walk-copy]');
const walkInstruction = document.querySelector('[data-walk-instruction]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const updateScrollState = () => {
  const offset = window.scrollY;
  const walkthroughComplete = !walkthrough || walkthrough.getBoundingClientRect().bottom <= window.innerHeight;
  header?.classList.toggle('is-solid', offset > 28 && walkthroughComplete);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.height = `${max > 0 ? (offset / max) * 100 : 0}%`;
  }
};
updateScrollState();
window.addEventListener('scroll', updateScrollState, { passive: true });

let walkTicking = false;
const updateWalkthrough = () => {
  if (!walkthrough || !walkFrames.length || reducedMotion) return;
  const top = walkthrough.getBoundingClientRect().top;
  const scrollRange = Math.max(1, walkthrough.offsetHeight - window.innerHeight);
  const amount = Math.min(1, Math.max(0, -top / scrollRange));
  const point = amount * (walkFrames.length - 1);
  const current = Math.floor(point);
  const transition = point - current;
  const last = walkFrames.length - 1;

  walkFrames.forEach((frame, index) => {
    let opacity = 0;
    if (index === current) opacity = 1 - transition;
    if (index === Math.min(current + 1, last)) opacity = transition;
    if (amount === 1 && index === last) opacity = 1;
    frame.style.opacity = String(opacity);
    frame.style.transform = `scale(${1.035 - amount * .025})`;
  });

  const copyAmount = Math.min(1, Math.max(0, (amount - .68) / .2));
  if (walkCopy) {
    walkCopy.style.opacity = String(copyAmount);
    walkCopy.style.transform = `translateY(${(1 - copyAmount) * 16}px)`;
  }
  if (walkInstruction) walkInstruction.style.opacity = String(1 - Math.min(1, amount / .17));
  walkTicking = false;
};

const requestWalkthroughUpdate = () => {
  if (walkTicking) return;
  walkTicking = true;
  window.requestAnimationFrame(updateWalkthrough);
};

updateWalkthrough();
window.addEventListener('scroll', requestWalkthroughUpdate, { passive: true });
window.addEventListener('resize', requestWalkthroughUpdate, { passive: true });

const setMenu = (isOpen) => {
  menuButton?.setAttribute('aria-expanded', String(isOpen));
  mobileMenu?.classList.toggle('is-open', isOpen);
  mobileMenu?.setAttribute('aria-hidden', String(!isOpen));
  body.classList.toggle('has-menu-open', isOpen);
};

menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => { if (window.innerWidth > 960) setMenu(false); });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const modal = document.querySelector('[data-lightbox-modal]');
const modalImage = document.querySelector('[data-lightbox-image]');
const modalCaption = document.querySelector('[data-lightbox-caption]');
const closeButton = document.querySelector('[data-lightbox-close]');
let lastTrigger;

const closeLightbox = () => {
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
  body.classList.remove('has-modal-open');
  lastTrigger?.focus();
};

document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (!modal || !modalImage) return;
    lastTrigger = trigger;
    modalImage.src = trigger.dataset.lightbox;
    modalImage.alt = trigger.querySelector('img')?.alt || '';
    if (modalCaption) modalCaption.textContent = trigger.dataset.caption || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('has-modal-open');
    closeButton?.focus();
  });
});
closeButton?.addEventListener('click', closeLightbox);
modal?.addEventListener('click', (event) => { if (event.target === modal) closeLightbox(); });

window.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (modal?.classList.contains('is-open')) closeLightbox();
  else if (menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false);
});

const form = document.querySelector('[data-contact-form]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent('Zapytanie ze strony — Pracownia Oversize');
  const message = encodeURIComponent(`Imię i nazwisko: ${data.get('name') || ''}\nE-mail: ${data.get('email') || ''}\n\n${data.get('message') || ''}`);
  window.location.href = `mailto:biuro@pracowniaoversize.pl?subject=${subject}&body=${message}`;
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
