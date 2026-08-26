const header = document.querySelector('.site-header');
const heroMedia = document.querySelector('.hero-media');
const menu = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('is-scrolled', y > 24);
  if (heroMedia && y < window.innerHeight * 1.15 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroMedia.style.transform = `scale(1.03) translate3d(0, ${y * 0.055}px, 0)`;
  }
};
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

toggle?.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.offer-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.offer-list details[open]').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});
