const body = document.body;
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const progress = document.querySelector('.scroll-marker i');

const updateScrollState = () => {
  const offset = window.scrollY;
  header?.classList.toggle('is-solid', offset > 28);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.height = `${max > 0 ? (offset / max) * 100 : 0}%`;
  }
};
updateScrollState();
window.addEventListener('scroll', updateScrollState, { passive: true });

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

const parallaxImages = [...document.querySelectorAll('[data-parallax]')];
let parallaxTicking = false;
const updateParallax = () => {
  if (!parallaxImages.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 620) {
    parallaxTicking = false;
    return;
  }
  const viewportMiddle = window.innerHeight / 2;
  parallaxImages.forEach((image) => {
    const frame = image.parentElement?.getBoundingClientRect();
    if (!frame || frame.bottom < 0 || frame.top > window.innerHeight) return;
    const position = (frame.top + frame.height / 2 - viewportMiddle) / window.innerHeight;
    const shift = Math.max(-18, Math.min(18, position * -18));
    image.style.transform = `translate3d(0, ${shift}px, 0) scale(1.055)`;
  });
  parallaxTicking = false;
};
const requestParallax = () => {
  if (parallaxTicking) return;
  parallaxTicking = true;
  window.requestAnimationFrame(updateParallax);
};
updateParallax();
window.addEventListener('scroll', requestParallax, { passive: true });
window.addEventListener('resize', requestParallax, { passive: true });

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
