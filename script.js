/* =============================================
   HERENA KONECIA — PORTFOLIO SCRIPTS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     1. CUSTOM CURSOR
  ============================================ */
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower animation
  function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverEls = document.querySelectorAll(
    'a, button, .project-card, .skill-category, .stat-card, input, textarea'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });


  /* ============================================
     2. STICKY NAVBAR + SCROLL CLASS
  ============================================ */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  /* ============================================
     3. MOBILE HAMBURGER MENU
  ============================================ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks   = document.querySelectorAll('.mob-link');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    }
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });


  /* ============================================
     4. SCROLL REVEAL ANIMATIONS
  ============================================ */
  const revealEls = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Respect the data-delay attribute from hero section
        const delay = entry.target.dataset.delay;
        if (delay) {
          entry.target.style.transitionDelay = delay + 'ms';
        }
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // Trigger hero elements immediately on load
  const heroRevealEls = document.querySelectorAll('.hero .reveal-up');
  setTimeout(() => {
    heroRevealEls.forEach(el => el.classList.add('visible'));
  }, 100);


  /* ============================================
     5. ANIMATED COUNTER STATS
  ============================================ */
  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start    = performance.now();
    const isCGPA   = suffix === '/10';

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic

      let value = Math.round(eased * target);
      if (isCGPA) {
        // Display as 7.53
        value = (eased * (target / 100)).toFixed(2);
        el.textContent = value + '/10';
      } else {
        el.textContent = value + (suffix && !isCGPA ? suffix : '');
      }

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObserver.observe(el));


  /* ============================================
     6. SKILL BARS ANIMATION
  ============================================ */
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.dataset.width;
        // Small delay to make it feel intentional
        setTimeout(() => {
          bar.style.width = width + '%';
        }, 200);
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => barObserver.observe(bar));


  /* ============================================
     7. ACTIVE NAV LINK HIGHLIGHTING
  ============================================ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link:not(.cta-link)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(s => sectionObserver.observe(s));

  // Inject active nav style
  const navStyle = document.createElement('style');
  navStyle.textContent = `
    .nav-link.active {
      color: var(--white) !important;
      background: var(--accent-dim) !important;
    }
  `;
  document.head.appendChild(navStyle);


  /* ============================================
     8. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset     = navbar.offsetHeight + 20;
        const targetTop  = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });


  /* ============================================
     9. BACK TO TOP BUTTON
  ============================================ */
  const backToTopBtn = document.getElementById('backToTop');

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ============================================
     10. CONTACT FORM HANDLING
  ============================================ */
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Button loading state
      const btnSpan = submitBtn.querySelector('span');
      const btnSvg  = submitBtn.querySelector('svg');
      btnSpan.textContent = 'Sending...';
      submitBtn.disabled  = true;
      submitBtn.style.opacity = '0.7';

      // Simulate async send (replace with actual form logic / EmailJS / Formspree)
      setTimeout(() => {
        // Reset button
        btnSpan.textContent    = 'Message Sent!';
        submitBtn.style.opacity = '1';

        // Show toast
        showToast('✓  Message sent successfully! I\'ll get back to you soon.');

        // Reset form
        setTimeout(() => {
          contactForm.reset();
          btnSpan.textContent = 'Send Message';
          submitBtn.disabled  = false;
        }, 2500);
      }, 1500);
    });
  }


  /* ============================================
     11. TOAST NOTIFICATION
  ============================================ */
  function showToast(message) {
    // Remove existing toast if any
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">✦</span><span>${message}</span>`;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }


  /* ============================================
     12. PROJECT CARD TILT EFFECT (subtle 3D)
  ============================================ */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const deltaX  = (e.clientX - centerX) / (rect.width  / 2);
      const deltaY  = (e.clientY - centerY) / (rect.height / 2);
      const rotateX = -deltaY * 4;
      const rotateY =  deltaX * 4;

      card.style.transform = `
        translateY(-6px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
      card.style.transition = 'border-color 0.35s, box-shadow 0.35s, transform 0.05s';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'border-color 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s';
    });
  });


  /* ============================================
     13. TYPING EFFECT IN HERO (role titles)
  ============================================ */
  const roles = ['Web Developer', 'SEO Analyst', 'UI Designer', 'Front-End Dev'];
  const roleEls = document.querySelectorAll('.role');

  if (roleEls.length > 0) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const targetEl = roleEls[0];
    const originalText = targetEl.textContent;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        targetEl.textContent = currentRole.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(typeEffect, 2000);
          return;
        }
      } else {
        targetEl.textContent = currentRole.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex  = (roleIndex + 1) % roles.length;
        }
      }

      const speed = isDeleting ? 60 : 90;
      setTimeout(typeEffect, speed);
    }

    // Start typing after page load
    setTimeout(typeEffect, 1800);
  }


  /* ============================================
     14. PARALLAX ON HERO BG TEXT
  ============================================ */
  const heroBgText = document.querySelector('.hero-bg-text');

  if (heroBgText) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBgText.style.transform = `translateY(calc(-50% + ${scrollY * 0.3}px))`;
      }
    }, { passive: true });
  }


  /* ============================================
     15. PILL HOVER RIPPLE EFFECT
  ============================================ */
  const pills = document.querySelectorAll('.pill, .tech-tag');

  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(200,241,53,0.35);
        transform: scale(0);
        animation: ripple 0.5s linear;
        pointer-events: none;
        width: 80px; height: 80px;
        left: ${e.offsetX - 40}px;
        top:  ${e.offsetY - 40}px;
      `;
      pill.style.position = 'relative';
      pill.style.overflow = 'hidden';
      pill.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to { transform: scale(3); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);


  /* ============================================
     16. FORM INPUT FLOATING LABEL EFFECT
  ============================================ */
  const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });

  // Inject focused label style
  const formStyle = document.createElement('style');
  formStyle.textContent = `
    .form-group.focused label {
      color: var(--accent);
    }
  `;
  document.head.appendChild(formStyle);


  /* ============================================
     INIT COMPLETE
  ============================================ */
  console.log('%c✦ Herena Konecia Portfolio Loaded', 'color: #c8f135; font-size: 14px; font-weight: bold;');
  console.log('%cCrafted with HTML, CSS & Vanilla JavaScript', 'color: #888899; font-size: 11px;');

}); // End DOMContentLoaded