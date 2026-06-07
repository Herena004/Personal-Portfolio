/* =============================================
   HERENA KONECIA P — PORTFOLIO JAVASCRIPT
   ============================================= */

'use strict';

/* =============================================
   1. PARTICLE BACKGROUND
   ============================================= */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x   = rand(0, W);
      this.y   = rand(0, H);
      this.vx  = rand(-0.4, 0.4);
      this.vy  = rand(-0.4, 0.4);
      this.r   = rand(1, 2.5);
      this.alpha = rand(0.2, 0.7);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = '#00e5c3';
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.2;
          ctx.strokeStyle = '#00e5c3';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
      // mouse connection
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 160) * 0.4;
          ctx.strokeStyle = '#00b8f0';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();


/* =============================================
   2. TYPING ANIMATION
   ============================================= */
(function initTyping() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const words = ['SEO Analyst', 'Frontend Developer', 'Content Optimizer', 'Tech Enthusiast'];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const word = words[wordIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; }
    }
    setTimeout(type, deleting ? 55 : 90);
  }
  type();
})();


/* =============================================
   3. NAVBAR — SCROLL & MOBILE TOGGLE
   ============================================= */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('navToggle');
  const links   = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);
  });

  toggle.addEventListener('click', () => links.classList.toggle('open'));

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* =============================================
   4. SCROLL REVEAL
   ============================================= */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => io.observe(item));
})();


/* =============================================
   5. ANIMATED COUNTERS
   ============================================= */
(function initCounters() {
  const nums = document.querySelectorAll('.counter-num');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const dur = 1600;
      const step = dur / target;
      let cur = 0;
      const timer = setInterval(() => {
        cur++;
        el.textContent = cur;
        if (cur >= target) clearInterval(timer);
      }, step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
})();


/* =============================================
   6. SKILL BAR ANIMATION
   ============================================= */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const width = el.dataset.width;
      requestAnimationFrame(() => { el.style.width = width + '%'; });
      io.unobserve(el);
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
})();


/* =============================================
   7. TOOLKIT TABS
   ============================================= */
(function initTabs() {
  const tabs   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.toolkit-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
})();


/* =============================================
   8. META TITLE CHECKER (live)
   ============================================= */
(function initMetaTitle() {
  const input  = document.getElementById('metaTitleInput');
  const result = document.getElementById('metaTitleResult');
  const preview = document.getElementById('serpTitleText');
  if (!input) return;

  input.addEventListener('input', () => {
    const len = input.value.length;
    preview.textContent = input.value || 'Your title will appear here';
    if (len === 0) { result.textContent = ''; return; }
    if (len < 30) {
      result.innerHTML = `<span class="result-warn">⚠ Too short (${len}/60). Add more keywords.</span>`;
    } else if (len <= 60) {
      result.innerHTML = `<span class="result-ok">✓ Great length (${len}/60). Well optimized!</span>`;
    } else if (len <= 70) {
      result.innerHTML = `<span class="result-warn">⚠ Slightly long (${len}/60). May get truncated.</span>`;
    } else {
      result.innerHTML = `<span class="result-bad">✗ Too long (${len}/60). Google will truncate this.</span>`;
    }
  });
})();


/* =============================================
   9. META DESCRIPTION CHECKER (live)
   ============================================= */
(function initMetaDesc() {
  const textarea = document.getElementById('metaDescInput');
  const result   = document.getElementById('metaDescResult');
  const preview  = document.getElementById('serpDescText');
  if (!textarea) return;

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    preview.textContent = textarea.value || 'Your description will appear here...';
    if (len === 0) { result.textContent = ''; return; }
    if (len < 70) {
      result.innerHTML = `<span class="result-warn">⚠ Too short (${len}/160). Expand with more detail.</span>`;
    } else if (len <= 160) {
      result.innerHTML = `<span class="result-ok">✓ Perfect length (${len}/160). Well done!</span>`;
    } else if (len <= 180) {
      result.innerHTML = `<span class="result-warn">⚠ Slightly long (${len}/160). Consider trimming.</span>`;
    } else {
      result.innerHTML = `<span class="result-bad">✗ Too long (${len}/160). Will be cut by Google.</span>`;
    }
  });
})();


/* =============================================
   10. KEYWORD DENSITY CHECKER
   ============================================= */
(function initKeywordDensity() {
  const btn    = document.getElementById('calcDensity');
  const result = document.getElementById('keywordResult');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const content = document.getElementById('keywordContent').value.trim();
    const keyword = document.getElementById('keywordTarget').value.trim().toLowerCase();
    if (!content || !keyword) {
      result.innerHTML = `<span class="result-warn">⚠ Please enter both content and a target keyword.</span>`;
      return;
    }
    const words    = content.toLowerCase().split(/\s+/).filter(Boolean);
    const total    = words.length;
    const count    = words.filter(w => w.replace(/[^a-z0-9]/g,'') === keyword.replace(/[^a-z0-9]/g,'')).length;
    const density  = total > 0 ? ((count / total) * 100).toFixed(2) : 0;

    let status = '';
    if (density < 0.5)      status = `<span class="result-warn">⚠ Low density (${density}%). Try 1–3% for better ranking.</span>`;
    else if (density <= 3)  status = `<span class="result-ok">✓ Ideal keyword density: ${density}% (${count} times in ${total} words)</span>`;
    else if (density <= 5)  status = `<span class="result-warn">⚠ Slightly high (${density}%). Risk of keyword stuffing.</span>`;
    else                    status = `<span class="result-bad">✗ Keyword stuffing detected! (${density}%). Reduce usage.</span>`;

    result.innerHTML = status;
  });
})();


/* =============================================
   11. CONTACT FORM VALIDATION
   ============================================= */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErrors() {
    ['nameError','emailError','subjectError','messageError'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    });
    ['formName','formEmail','formSubject','formMessage'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });
  }

  function validate() {
    clearErrors();
    let valid = true;
    const name    = document.getElementById('formName');
    const email   = document.getElementById('formEmail');
    const subject = document.getElementById('formSubject');
    const message = document.getElementById('formMessage');

    if (!name.value.trim()) {
      showError('nameError', 'Name is required.'); name.classList.add('error'); valid = false;
    } else if (name.value.trim().length < 2) {
      showError('nameError', 'Name must be at least 2 characters.'); name.classList.add('error'); valid = false;
    }
    if (!email.value.trim()) {
      showError('emailError', 'Email is required.'); email.classList.add('error'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showError('emailError', 'Please enter a valid email address.'); email.classList.add('error'); valid = false;
    }
    if (!subject.value.trim()) {
      showError('subjectError', 'Subject is required.'); subject.classList.add('error'); valid = false;
    }
    if (!message.value.trim()) {
      showError('messageError', 'Message is required.'); message.classList.add('error'); valid = false;
    } else if (message.value.trim().length < 10) {
      showError('messageError', 'Message must be at least 10 characters.'); message.classList.add('error'); valid = false;
    }
    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;
    const btn = document.getElementById('formSubmit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      form.reset();
      clearErrors();
      const success = document.getElementById('formSuccess');
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1400);
  });
})();


/* =============================================
   12. DOWNLOAD RESUME (placeholder)
   ============================================= */



/* =============================================
   13. SMOOTH ACTIVE NAV HIGHLIGHT ON SCROLL
   ============================================= */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--accent)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();
