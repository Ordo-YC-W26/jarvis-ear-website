// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  lastScroll = window.scrollY;
}, { passive: true });

// ─── Mobile menu toggle ───
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

// ─── Scroll reveal ───
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── Terminal line stagger ───
const terminalLines = document.querySelectorAll('.t-line');
terminalLines.forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateY(6px)';
  line.style.transition = `opacity 0.35s ease ${i * 0.1}s, transform 0.35s ease ${i * 0.1}s`;
});

const terminalEl = document.querySelector('.terminal');
if (terminalEl) {
  const termObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        terminalLines.forEach(line => {
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        });
        termObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  termObserver.observe(terminalEl);
}

// ─── Smooth anchor scrolling ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ─── Waitlist form ───
const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
  waitlistForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    const btn = this.querySelector('button span:first-child');

    btn.textContent = 'Joining...';

    setTimeout(() => {
      btn.textContent = "You're in";
      this.querySelector('button').style.background = 'var(--green)';
      input.value = '';
      input.placeholder = 'Welcome aboard.';
      input.disabled = true;
      this.querySelector('button').disabled = true;
    }, 800);
  });
}

// ─── Device SVG subtle parallax on scroll ───
const deviceWrapper = document.getElementById('deviceWrapper');
if (deviceWrapper) {
  window.addEventListener('scroll', () => {
    const rect = deviceWrapper.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewCenter = window.innerHeight / 2;
    const offset = (center - viewCenter) / window.innerHeight;
    deviceWrapper.style.transform = `translateY(${offset * -12}px)`;
  }, { passive: true });
}
