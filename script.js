/* ============================================================
   ABHISHEK KUMAR — PORTFOLIO SCRIPTS
   script.js
   ============================================================ */

/* ============================================================
   LOADING SCREEN
   ============================================================ */
(function () {
  const progress = document.getElementById('loader-progress');
  const text     = document.getElementById('loader-text');
  const messages = [
    'initializing...',
    'loading assets...',
    'compiling components...',
    'rendering portfolio...',
    'ready!',
  ];
  let pct    = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    pct = Math.min(pct + Math.random() * 12, 100);
    progress.style.width = pct + '%';

    const mi = Math.floor((pct / 100) * messages.length);
    if (mi !== msgIdx && mi < messages.length) {
      msgIdx           = mi;
      text.textContent = messages[mi];
    }

    if (pct >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        startAnimations();
      }, 300);
    }
  }, 60);
})();

/* ============================================================
   BOOT — START ALL ANIMATIONS AFTER LOAD
   ============================================================ */
function startAnimations() {
  initReveal();
  initTyping();
  initCounters();
  initContribGraph();
  initSkillBars();
}

/* ============================================================
   CUSTOM CURSOR  (desktop only)
   ============================================================ */
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
});

// Smooth-lag ring follow
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(animRing);
})();

// Expand cursor on interactive elements
const interactiveSelectors = [
  'a', 'button', '.btn', '.nav-link', '.project-card',
  '.skill-card', '.faq-question', '.social-btn',
  '.contact-detail', '.contact-social', '.mobile-nav-link',
].join(',');

document.querySelectorAll(interactiveSelectors).forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cur.classList.add('expanded');
    ring.classList.add('expanded');
  });
  el.addEventListener('mouseleave', () => {
    cur.classList.remove('expanded');
    ring.classList.remove('expanded');
  });
});

/* ============================================================
   NAVBAR — SCROLL GLASS EFFECT + ACTIVE LINK
   ============================================================ */
const navbar    = document.getElementById('navbar');
const scrollBtn = document.getElementById('scroll-top');
const sections  = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Glassmorphism on scroll
  navbar.classList.toggle('scrolled', y > 50);

  // Scroll-to-top button visibility
  scrollBtn.classList.toggle('visible', y > 400);

  // Active nav link highlight
  let current = '';
  sections.forEach((s) => {
    if (y >= s.offsetTop - 100) current = s.id;
  });

  document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
  const activeLink = [...document.querySelectorAll('.nav-link')].find(
    (l) =>
      l.textContent.trim().toLowerCase() === current ||
      l.getAttribute('onclick')?.includes(current)
  );
  if (activeLink) activeLink.classList.add('active');
});

/* ============================================================
   MOBILE MENU
   ============================================================ */
function toggleMenu() {
  document.getElementById('hamburger').classList.toggle('open');
  document.getElementById('mobile-menu').classList.toggle('open');
}

function closeMenu() {
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobile-menu').classList.remove('open');
}

/* ============================================================
   THEME TOGGLE  (dark ↔ light)
   ============================================================ */
const themeBtn = document.getElementById('theme-toggle');

themeBtn.addEventListener('click', () => {
  const html   = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? '🌙' : '☀️';
});

/* ============================================================
   SMOOTH SCROLL TO SECTION
   ============================================================ */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   SCROLL REVEAL  (IntersectionObserver)
   ============================================================ */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => obs.observe(el));
}

/* ============================================================
   TYPING ANIMATION  (hero role)
   ============================================================ */
function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Full Stack MERN Developer',
    'React.js Enthusiast',
    'Node.js Developer',
    'UI/UX Minded Coder',
    'Future AI Engineer',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isTyping    = true;

  function type() {
    const phrase = phrases[phraseIndex];

    if (isTyping) {
      el.textContent = phrase.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === phrase.length) {
        isTyping = false;
        setTimeout(type, 1800); // pause before deleting
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isTyping     = true;
        phraseIndex  = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(type, isTyping ? 75 : 40);
  }

  type();
}

/* ============================================================
   ANIMATED COUNTERS  (stats bar)
   ============================================================ */
function initCounters() {
  const els = document.querySelectorAll('.stat-number[data-count]');

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting || e.target._counted) return;
        e.target._counted = true;

        const target = +e.target.dataset.count;
        const suffix = e.target.dataset.suffix || '';
        let   start  = 0;

        const duration = 1600;
        const step     = duration / target;
        const interval = step < 16 ? 16 : step;

        const timer = setInterval(() => {
          start = Math.min(start + Math.ceil(target / 40), target);
          e.target.textContent = start + suffix;
          if (start >= target) clearInterval(timer);
        }, interval);
      });
    },
    { threshold: 0.5 }
  );

  els.forEach((el) => obs.observe(el));
}

/* ============================================================
   GITHUB CONTRIBUTION GRAPH  (generated randomly)
   ============================================================ */
function initContribGraph() {
  const grid = document.getElementById('contrib-grid');
  if (!grid) return;

  for (let w = 0; w < 26; w++) {
    const week = document.createElement('div');
    week.className = 'contrib-week';

    for (let d = 0; d < 7; d++) {
      const day = document.createElement('div');
      const r   = Math.random();
      const lvl = r < 0.35 ? '' : r < 0.55 ? 'l1' : r < 0.7 ? 'l2' : r < 0.85 ? 'l3' : 'l4';
      day.className = 'contrib-day ' + lvl;
      week.appendChild(day);
    }

    grid.appendChild(week);
  }
}

/* ============================================================
   SKILL PROGRESS BARS  (animate on scroll into view)
   ============================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill[data-width]');

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + '%';
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((b) => obs.observe(b));
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function toggleFaq(el) {
  const item = el.parentElement;
  item.classList.toggle('open');
}

/* ============================================================
   CONTACT FORM  (mock submit)
   ============================================================ */
function handleFormSubmit() {
  const fieldIds = ['f-first', 'f-last', 'f-email', 'f-subject', 'f-message'];

  // Validate — all fields required
  for (const id of fieldIds) {
    if (!document.getElementById(id).value.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
  }

  // Basic email format check
  const email = document.getElementById('f-email').value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address.', 'error');
    return;
  }

  const btn = document.querySelector('.form-submit');
  btn.textContent = 'Sending...';
  btn.disabled    = true;

  // Simulate async submission
  setTimeout(() => {
    btn.textContent = '✓ Message Sent!';
    showToast("Message sent! I'll get back to you within 24 hours.", 'success');
    fieldIds.forEach((id) => (document.getElementById(id).value = ''));

    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.disabled    = false;
    }, 3000);
  }, 1500);
}

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = 'toast ' + type;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
