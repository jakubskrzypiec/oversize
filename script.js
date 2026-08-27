const header = document.querySelector('[data-header]');
const progress = document.querySelector('.page-progress span');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

const onScroll = () => {
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 24);
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
};
onScroll();
addEventListener('scroll', onScroll, { passive: true });

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
}, { threshold: .12, rootMargin: '0px 0px -4% 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Keep only one service open at a time on desktop for a cleaner rhythm.
const services = [...document.querySelectorAll('.service')];
services.forEach(item => item.addEventListener('toggle', () => {
  if (item.open && innerWidth > 700) services.forEach(other => { if (other !== item) other.open = false; });
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
  const body = encodeURIComponent(
    `Imię i nazwisko: ${data.get('name') || ''}\nE-mail: ${data.get('email') || ''}\nTelefon: ${data.get('phone') || ''}\n\n${data.get('message') || ''}`
  );
  location.href = `mailto:biuro@pracowniaoversize.pl?subject=${subject}&body=${body}`;
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
const cookie = document.querySelector('[data-cookie]');
if (localStorage.getItem('oversize-cookie-ok') === '1') cookie?.classList.add('is-hidden');
document.querySelector('[data-cookie-ok]')?.addEventListener('click', () => {
  localStorage.setItem('oversize-cookie-ok','1');
  cookie?.classList.add('is-hidden');
});
