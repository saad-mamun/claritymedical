const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const backToTop = document.querySelector('#back-to-top');
const navLinks = [...document.querySelectorAll('.nav-link')];
const sections = [...document.querySelectorAll('main section[id]')];

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  mainNav.classList.toggle('open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  mainNav.classList.remove('open');
}));

const updateScrollState = () => {
  header.classList.toggle('scrolled', window.scrollY > 12);
  backToTop.classList.toggle('visible', window.scrollY > 550);

  const current = sections.reduce((active, section) => {
    if (window.scrollY >= section.offsetTop - 150) return section.id;
    return active;
  }, 'home');

  navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
};
window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const counter = entry.target;
    const target = Number(counter.dataset.counter);
    const suffix = counter.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      counter.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(counter);
  });
}, { threshold: 0.65 });

counters.forEach((counter) => counterObserver.observe(counter));

const testimonials = [...document.querySelectorAll('.testimonial')];
const previousTestimonial = document.querySelector('#prev-testimonial');
const nextTestimonial = document.querySelector('#next-testimonial');
let testimonialIndex = 0;
let carouselTimer;

const showTestimonial = (nextIndex) => {
  testimonialIndex = (nextIndex + testimonials.length) % testimonials.length;
  testimonials.forEach((testimonial, index) => testimonial.classList.toggle('active', index === testimonialIndex));
};

const resetCarouselTimer = () => {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => showTestimonial(testimonialIndex + 1), 6000);
};

previousTestimonial.addEventListener('click', () => { showTestimonial(testimonialIndex - 1); resetCarouselTimer(); });
nextTestimonial.addEventListener('click', () => { showTestimonial(testimonialIndex + 1); resetCarouselTimer(); });
resetCarouselTimer();

const appointmentForm = document.querySelector('#appointment-form');
const appointmentMessage = appointmentForm.querySelector('.form-message');
appointmentForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!appointmentForm.checkValidity()) {
    appointmentMessage.textContent = 'Please complete the required fields so we can confirm your visit.';
    appointmentMessage.classList.add('error');
    appointmentForm.reportValidity();
    return;
  }
  appointmentMessage.classList.remove('error');
  appointmentMessage.textContent = 'Thank you. Your request is with our care team and we will be in touch shortly.';
  appointmentForm.reset();
});

const contactForm = document.querySelector('#contact-form');
const contactMessage = contactForm.querySelector('.form-message');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactMessage.textContent = 'Please complete the required fields.';
    contactMessage.classList.add('error');
    contactForm.reportValidity();
    return;
  }
  contactMessage.classList.remove('error');
  contactMessage.textContent = 'Message received. Our team will reply within one business day.';
  contactForm.reset();
});

const contactLinks = document.querySelectorAll('a[href="#contact"]');
contactLinks.forEach((link) => link.addEventListener('click', () => {
  const contactHeading = document.querySelector('#contact h2');
  if (contactHeading) contactHeading.setAttribute('tabindex', '-1');
}));
