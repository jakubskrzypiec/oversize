const body = document.body;
const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const progress = document.querySelector('.scroll-marker i');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const setMenu = (isOpen) => {
  menuButton?.setAttribute('aria-expanded', String(isOpen));
  mobileMenu?.classList.toggle('is-open', isOpen);
  mobileMenu?.setAttribute('aria-hidden', String(!isOpen));
  body.classList.toggle('has-menu-open', isOpen);
};

menuButton?.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .13, rootMargin: '0px 0px -7% 0px' });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const railItems = [...document.querySelectorAll('.rail-item')];
const activeRailItems = new Set();
const railObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      activeRailItems.add(entry.target);
    } else {
      activeRailItems.delete(entry.target);
      if (window.innerWidth <= 620 && !reducedMotion.matches) entry.target.style.setProperty('--wipe', '0%');
    }
  });
}, { threshold: 0, rootMargin: '15% 0px 15% 0px' });
railItems.forEach((item) => railObserver.observe(item));

const parallaxImages = [...document.querySelectorAll('[data-parallax]')];
const lightStudy = document.querySelector('[data-light-study]');
const lightBeam = document.querySelector('[data-light-beam]');
const lightTimes = [...document.querySelectorAll('[data-light-time]')];

const updateLightStudy = (viewportHeight) => {
  if (!lightStudy || !lightBeam) return;

  if (reducedMotion.matches) {
    lightBeam.style.transform = 'translate3d(32vw, 0, 0)';
    lightBeam.style.opacity = '.34';
    lightTimes.forEach((time, index) => time.classList.toggle('is-active', index === lightTimes.length - 1));
    return;
  }

  const rect = lightStudy.getBoundingClientRect();
  const travel = Math.max(1, rect.height - viewportHeight);
  const sectionProgress = clamp(-rect.top / travel);
  const beamX = -34 + sectionProgress * 68;
  const beamOpacity = .42 + Math.sin(sectionProgress * Math.PI) * .22;

  lightBeam.style.transform = `translate3d(${beamX.toFixed(2)}vw, 0, 0)`;
  lightBeam.style.opacity = beamOpacity.toFixed(3);

  const timeIndex = sectionProgress < .34 ? 0 : sectionProgress < .68 ? 1 : 2;
  lightTimes.forEach((time, index) => time.classList.toggle('is-active', index === timeIndex));
};

const updateMobileRail = (viewportHeight) => {
  if (window.innerWidth > 620) {
    railItems.forEach((item) => item.style.removeProperty('--wipe'));
    return;
  }

  if (reducedMotion.matches) {
    railItems.forEach((item) => item.style.setProperty('--wipe', '48%'));
    return;
  }

  activeRailItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const distance = Math.abs(itemCenter - viewportCenter);
    const proximity = 1 - clamp(distance / (viewportHeight * .72));
    const wipe = proximity * 84;
    item.style.setProperty('--wipe', `${wipe.toFixed(2)}%`);
  });
};

const updateParallax = (viewportHeight) => {
  if (reducedMotion.matches || window.innerWidth <= 620) {
    parallaxImages.forEach((image) => { image.style.transform = 'none'; });
    return;
  }

  const viewportMiddle = viewportHeight / 2;
  parallaxImages.forEach((image) => {
    const frame = image.parentElement?.getBoundingClientRect();
    if (!frame || frame.bottom < 0 || frame.top > viewportHeight) return;
    const position = (frame.top + frame.height / 2 - viewportMiddle) / viewportHeight;
    const shift = Math.max(-18, Math.min(18, position * -18));
    image.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) scale(1.055)`;
  });
};

let frameRequested = false;
const updateScrollEffects = () => {
  const viewportHeight = window.innerHeight;
  const offset = window.scrollY;

  header?.classList.toggle('is-solid', offset > 28);

  if (progress) {
    const max = document.documentElement.scrollHeight - viewportHeight;
    const value = max > 0 ? clamp(offset / max) : 0;
    progress.style.transform = `scaleY(${value.toFixed(4)})`;
  }

  updateParallax(viewportHeight);
  updateMobileRail(viewportHeight);
  updateLightStudy(viewportHeight);
  frameRequested = false;
};

const requestScrollUpdate = () => {
  if (frameRequested) return;
  frameRequested = true;
  window.requestAnimationFrame(updateScrollEffects);
};

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 960) setMenu(false);
  requestScrollUpdate();
}, { passive: true });
reducedMotion.addEventListener?.('change', requestScrollUpdate);
requestScrollUpdate();

const modal = document.querySelector('[data-lightbox-modal]');
const modalImage = document.querySelector('[data-lightbox-image]');
const modalCaption = document.querySelector('[data-lightbox-caption]');
const closeButton = document.querySelector('[data-lightbox-close]');
let lastTrigger = null;

const closeLightbox = () => {
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
  body.classList.remove('has-modal-open');
  lastTrigger?.focus();
};

railItems.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    if (!modal || !modalImage) return;
    lastTrigger = trigger;
    modalImage.src = trigger.dataset.lightbox || '';
    modalImage.alt = trigger.querySelector('img')?.alt || '';
    if (modalCaption) modalCaption.textContent = trigger.dataset.caption || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('has-modal-open');
    closeButton?.focus();
  });
});

closeButton?.addEventListener('click', closeLightbox);
modal?.addEventListener('click', (event) => {
  if (event.target === modal) closeLightbox();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (modal?.classList.contains('is-open')) closeLightbox();
    else if (menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false);
  }

  if (event.key === 'Tab' && modal?.classList.contains('is-open')) {
    event.preventDefault();
    closeButton?.focus();
  }
});

// Native <details> keeps keyboard support. aria-expanded is mirrored explicitly for assistive tech.
document.querySelectorAll('.scope details').forEach((details) => {
  const summary = details.querySelector('summary');
  const sync = () => summary?.setAttribute('aria-expanded', String(details.open));
  sync();
  details.addEventListener('toggle', sync);
});

const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');

const setFormStatus = (message, type = '') => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.toggle('is-error', type === 'error');
  formStatus.classList.toggle('is-success', type === 'success');
};

const openMailFallback = (data) => {
  const subject = encodeURIComponent('Zapytanie ze strony — Pracownia Oversize');
  const message = encodeURIComponent(`Imię i nazwisko: ${data.get('name') || ''}\nE-mail: ${data.get('email') || ''}\n\n${data.get('message') || ''}`);
  window.location.href = `mailto:biuro@pracowniaoversize.pl?subject=${subject}&body=${message}`;
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  form.classList.add('was-validated');

  if (!form.checkValidity()) {
    setFormStatus('Uzupełnij wymagane pola i sprawdź adres e-mail.', 'error');
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  if (data.get('_gotcha')) {
    setFormStatus('Dziękujemy. Wiadomość została przyjęta.', 'success');
    form.reset();
    return;
  }

  const endpoint = form.dataset.formspreeEndpoint || '';
  const hasRealFormspreeId = /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint) && !endpoint.includes('XXXXXXXX');
  const submitButton = form.querySelector('button[type="submit"]');

  submitButton?.setAttribute('disabled', '');
  setFormStatus(hasRealFormspreeId ? 'Wysyłamy wiadomość…' : 'Otwieramy program pocztowy…');

  if (!hasRealFormspreeId) {
    openMailFallback(data);
    submitButton?.removeAttribute('disabled');
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Formspree request failed');

    form.reset();
    form.classList.remove('was-validated');
    setFormStatus('Dziękujemy. Wiadomość została wysłana.', 'success');
  } catch (error) {
    setFormStatus('Nie udało się wysłać formularza. Otwieramy wiadomość e-mail jako zapasową opcję.', 'error');
    openMailFallback(data);
  } finally {
    submitButton?.removeAttribute('disabled');
  }
});

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
