// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── Mobile menu toggle ───
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

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
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── Word-by-word reveal on scroll ───
document.querySelectorAll('.word-reveal').forEach(el => {
  const text = el.textContent.trim();
  el.innerHTML = text.split(/\s+/).map(word =>
    `<span class="word">${word}</span>`
  ).join(' ');

  const words = el.querySelectorAll('.word');

  const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate words based on scroll position within the viewport
        const updateWords = () => {
          const rect = el.getBoundingClientRect();
          const viewH = window.innerHeight;
          // Progress from 0 (just entered) to 1 (centered or past)
          const progress = Math.max(0, Math.min(1,
            1 - (rect.top / (viewH * 0.7))
          ));
          const litCount = Math.floor(progress * words.length);
          words.forEach((w, i) => {
            w.classList.toggle('lit', i < litCount);
          });
        };

        const onScroll = () => requestAnimationFrame(updateWords);
        window.addEventListener('scroll', onScroll, { passive: true });
        updateWords();

        // Clean up when fully revealed
        const cleanup = () => {
          const allLit = Array.from(words).every(w => w.classList.contains('lit'));
          if (allLit) {
            window.removeEventListener('scroll', onScroll);
          }
        };
        window.addEventListener('scroll', cleanup, { passive: true });

        wordObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  wordObserver.observe(el);
});

// ─── Terminal line stagger ───
const terminalLines = document.querySelectorAll('.t-line');
terminalLines.forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateY(8px)';
  line.style.transition = `opacity 0.4s ease ${i * 0.12}s, transform 0.4s ease ${i * 0.12}s`;
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
  }, { threshold: 0.2 });
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

// ─── Waitlist + Pre-order flow ───
const SUPABASE_URL = 'https://mynmpjnecxseeaqkurjy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm1wam5lY3hzZWVhcWt1cmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1ODM0MzQsImV4cCI6MjA5MTE1OTQzNH0.Khfb2ycvnm4Sjbfx8rukg1M9DYgFxFOU34j2BkZearA';

// Check for payment return
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('payment') === 'success') {
  const waitlistSection = document.getElementById('waitlist');
  if (waitlistSection) {
    const inner = waitlistSection.querySelector('.waitlist-inner');
    const form = document.getElementById('waitlistForm');
    const preorder = document.getElementById('preorderStep');
    const note = document.getElementById('waitlistNote');
    if (form) form.style.display = 'none';
    if (preorder) preorder.style.display = 'none';
    if (note) note.style.display = 'none';

    const successMsg = document.createElement('div');
    successMsg.className = 'preorder-step';
    successMsg.style.display = 'block';
    successMsg.innerHTML = `
      <p class="preorder-msg" style="color:var(--green);">Pre-order confirmed!</p>
      <p style="font-size:16px;color:var(--text-2);line-height:1.7;">
        Check your email for the confirmation. We'll keep you updated on development milestones.
      </p>
    `;
    inner.appendChild(successMsg);

    // Clean URL
    history.replaceState({}, '', window.location.pathname);
  }
}

let savedEmail = '';

const waitlistForm = document.getElementById('waitlistForm');
if (waitlistForm) {
  waitlistForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nameInput = this.querySelector('input[name="name"]');
    const emailInput = this.querySelector('input[name="email"]');
    const btn = document.getElementById('waitlistBtn');
    const btnText = btn.querySelector('span:first-child');
    const errorEl = document.getElementById('waitlistError');

    errorEl.textContent = '';
    btn.disabled = true;
    btnText.textContent = 'Joining...';

    savedEmail = emailInput.value.trim().toLowerCase();

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/waitlist-signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nameInput.value.trim(),
          email: savedEmail
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Hide form, show pre-order step
        waitlistForm.style.display = 'none';
        document.getElementById('waitlistNote').style.display = 'none';
        document.getElementById('preorderStep').style.display = 'block';
      } else {
        errorEl.textContent = data.error || 'Something went wrong. Please try again.';
        btn.disabled = false;
        btnText.textContent = 'Join Waitlist';
      }
    } catch (err) {
      errorEl.textContent = 'Network error. Please try again.';
      btn.disabled = false;
      btnText.textContent = 'Join Waitlist';
    }
  });
}

// Pre-order button → Stripe Checkout
const preorderBtn = document.getElementById('preorderBtn');
if (preorderBtn) {
  preorderBtn.addEventListener('click', async function() {
    const btnText = this.querySelector('span:first-child');
    this.disabled = true;
    btnText.textContent = 'Redirecting to checkout...';

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: savedEmail })
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        btnText.textContent = data.error || 'Something went wrong';
        this.disabled = false;
        setTimeout(() => { btnText.textContent = 'Pre-order for $80'; }, 3000);
      }
    } catch (err) {
      btnText.textContent = 'Network error. Try again.';
      this.disabled = false;
      setTimeout(() => { btnText.textContent = 'Pre-order for $80'; }, 3000);
    }
  });
}

// ─── Parallax on device image ───
const deviceWrapper = document.getElementById('deviceWrapper');
if (deviceWrapper) {
  window.addEventListener('scroll', () => {
    const rect = deviceWrapper.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewCenter = window.innerHeight / 2;
    const offset = (center - viewCenter) / window.innerHeight;
    deviceWrapper.style.transform = `translateY(${offset * -16}px)`;
  }, { passive: true });
}

// ─── Parallax on lifestyle break ───
const lifestyleBg = document.querySelector('.lifestyle-bg');
if (lifestyleBg) {
  window.addEventListener('scroll', () => {
    const section = lifestyleBg.closest('.lifestyle-break');
    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;
    if (rect.top < viewH && rect.bottom > 0) {
      const progress = (viewH - rect.top) / (viewH + rect.height);
      lifestyleBg.style.transform = `translateY(${progress * -30}px) scale(1.05)`;
    }
  }, { passive: true });
}

// ─── Stagger feature cards on hover (subtle glow) ───
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(232,168,124,0.04) 0%, var(--bg-card) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});
