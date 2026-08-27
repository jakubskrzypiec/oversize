const body = document.body;
const header = document.querySelector('[data-header]');
const progress = document.querySelector('.page-progress span');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 24);
  body.classList.toggle('scrolled', y > 24);
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
};

onScroll();
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => {
  if (innerWidth > 1120) {
    mobileMenu?.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  mobileMenu?.classList.toggle('is-open', !open);
  document.body.style.overflow = !open ? 'hidden' : '';
});

mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const services = [...document.querySelectorAll('.service')];
services.forEach(item => item.addEventListener('toggle', () => {
  if (item.open && innerWidth > 760) {
    services.forEach(other => { if (other !== item) other.open = false; });
  }
}));

const modal = document.querySelector('[data-lightbox-modal]');
const modalImage = document.querySelector('[data-lightbox-image]');
const closeModal = () => {
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

document.querySelectorAll('[data-lightbox]').forEach(btn => btn.addEventListener('click', () => {
  if (!modal || !modalImage) return;
  modalImage.src = btn.dataset.lightbox;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}));

document.querySelector('.lightbox__close')?.addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

const form = document.querySelector('[data-contact-form]');
form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const subject = encodeURIComponent('Zapytanie ze strony — Pracownia Oversize');
  const bodyText = encodeURIComponent(
    `Imię i nazwisko: ${data.get('name') || ''}\n` +
    `E-mail: ${data.get('email') || ''}\n` +
    `Telefon: ${data.get('phone') || ''}\n` +
    `Planowana lokalizacja: ${data.get('location') || ''}\n\n` +
    `${data.get('message') || ''}`
  );
  location.href = `mailto:biuro@pracowniaoversize.pl?subject=${subject}&body=${bodyText}`;
});

const yearNode = document.querySelector('[data-year]');
if (yearNode) yearNode.textContent = new Date().getFullYear();
