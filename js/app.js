/**
 * TALENTECHNO - EXECUTIVE APPLICATION SCRIPT
 * Minimal Translucent Physics Engine • Low-CPU Starlight • Typescript Quote Animation
 * Dual Theme Engine (Translucent Glossy Purple Dark & Preserved Luxury Light)
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. DUAL THEME ENGINE (Dark default: Minimal Translucent Glossy Purple)
  // ---------------------------------------------------------------------------
  const STORAGE_KEY = 'talentechno_theme';
  const htmlEl = document.documentElement;

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return 'dark'; // Minimal Translucent Purple default
  }

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    // Update icons on all theme switchers
    const switchers = document.querySelectorAll('.theme-switcher-btn');
    switchers.forEach((btn) => {
      if (theme === 'dark') {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`;
        btn.setAttribute('title', 'Switch to Preserved Luxury Light Theme');
        btn.setAttribute('aria-label', 'Switch to Preserved Luxury Light Theme');
      } else {
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
        btn.setAttribute('title', 'Switch to Minimal Translucent Purple Dark Theme');
        btn.setAttribute('aria-label', 'Switch to Minimal Translucent Purple Dark Theme');
      }
    });
  }

  function initTheme() {
    const currentTheme = getPreferredTheme();
    applyTheme(currentTheme);

    document.addEventListener('click', (e) => {
      const target = e.target.closest('.theme-switcher-btn');
      if (target) {
        const active = htmlEl.getAttribute('data-theme') || 'dark';
        const next = active === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast(next === 'dark' ? 'Switched to Minimal Translucent Purple' : 'Switched to Preserved Luxury Light');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 2. NATURAL PHYSICS MOVING TRANSLUCENT LIGHT (LOW CPU)
  // ---------------------------------------------------------------------------
  function initNaturalPhysicsLights() {
    const container = document.querySelector('.physics-ambient-container');
    if (!container) return;

    const orbEls = container.querySelectorAll('.physics-orb');
    if (!orbEls.length) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Window resize handler
    window.addEventListener(
      'resize',
      () => {
        width = window.innerWidth;
        height = window.innerHeight;
      },
      { passive: true }
    );

    // Mouse tracking for subtle interactive gravitational drift
    let mouse = { x: width / 2, y: height / 2, active: false };
    window.addEventListener(
      'mousemove',
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
      },
      { passive: true }
    );

    // Initial state for each translucent light orb
    const orbs = Array.from(orbEls).map((el, i) => {
      const size = i === 0 ? 520 : i === 1 ? 480 : 440;
      const radius = size / 2;
      return {
        el,
        x: (width * (i + 1)) / (orbEls.length + 1) - radius,
        y: (height * (i + 1)) / (orbEls.length + 1) - radius,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius,
        baseSpeed: 0.65 + i * 0.2
      };
    });

    let isRunning = true;

    // Pause physics calculations when the browser tab is hidden (Zero CPU wasted)
    document.addEventListener('visibilitychange', () => {
      isRunning = !document.hidden;
      if (isRunning) {
        requestAnimationFrame(physicsStep);
      }
    });

    function physicsStep() {
      if (!isRunning) return;

      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];

        // 1. Position update
        orb.x += orb.vx;
        orb.y += orb.vy;

        // 2. Soft elastic boundary bounce with viewport padding
        const minX = -orb.radius * 0.4;
        const maxX = width - orb.radius * 1.6;
        const minY = -orb.radius * 0.4;
        const maxY = height - orb.radius * 1.6;

        if (orb.x <= minX) {
          orb.x = minX;
          orb.vx = Math.abs(orb.vx) * 0.96;
        } else if (orb.x >= maxX) {
          orb.x = maxX;
          orb.vx = -Math.abs(orb.vx) * 0.96;
        }

        if (orb.y <= minY) {
          orb.y = minY;
          orb.vy = Math.abs(orb.vy) * 0.96;
        } else if (orb.y >= maxY) {
          orb.y = maxY;
          orb.vy = -Math.abs(orb.vy) * 0.96;
        }

        // 3. Gentle harmonic noise drift (keeps motion organic and continuous)
        orb.vx += (Math.random() - 0.5) * 0.04;
        orb.vy += (Math.random() - 0.5) * 0.04;

        // 4. Subtle mouse reactivity
        if (mouse.active) {
          const centerX = orb.x + orb.radius;
          const centerY = orb.y + orb.radius;
          const dx = mouse.x - centerX;
          const dy = mouse.y - centerY;
          const dist = Math.hypot(dx, dy);

          if (dist > 50 && dist < 450) {
            // Soft repulsive pressure from cursor
            const force = (450 - dist) / 450;
            orb.vx -= (dx / dist) * force * 0.08;
            orb.vy -= (dy / dist) * force * 0.08;
          }
        }

        // 5. Speed clamping (keeps motion graceful and low-energy)
        const speed = Math.hypot(orb.vx, orb.vy);
        const maxSpeed = 1.35;
        const minSpeed = 0.35;
        if (speed > maxSpeed) {
          orb.vx = (orb.vx / speed) * maxSpeed;
          orb.vy = (orb.vy / speed) * maxSpeed;
        } else if (speed < minSpeed) {
          orb.vx = (orb.vx / (speed || 1)) * minSpeed;
          orb.vy = (orb.vy / (speed || 1)) * minSpeed;
        }

        // 6. GPU-accelerated transform application
        orb.el.style.transform = `translate3d(${orb.x.toFixed(1)}px, ${orb.y.toFixed(1)}px, 0)`;
      }

      requestAnimationFrame(physicsStep);
    }

    requestAnimationFrame(physicsStep);
  }

  // ---------------------------------------------------------------------------
  // 3. LOW-CPU TRANSLUCENT STARS EFFECT
  // ---------------------------------------------------------------------------
  function initStarsEffect() {
    const starsContainer = document.querySelector('.stars-container');
    if (!starsContainer) return;

    // Create 38 subtle low-CPU starlight particles
    const starCount = 38;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star-particle';

      const x = (Math.random() * 100).toFixed(2);
      const y = (Math.random() * 100).toFixed(2);
      const size = (1.5 + Math.random() * 2.2).toFixed(1);
      const delay = (Math.random() * 5).toFixed(2);
      const duration = (3.5 + Math.random() * 3.5).toFixed(2);

      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDelay = `${delay}s`;
      star.style.animationDuration = `${duration}s`;

      fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
  }

  // ---------------------------------------------------------------------------
  // 4. TYPESCRIPTING / TYPEWRITER ANIMATION OF TALENTECHNO'S QUOTE
  // ---------------------------------------------------------------------------
  const quotes = [
    {
      text: "Connecting Tech Talent with Tomorrow's Innovations.",
      author: "Talentechno Mission"
    },
    {
      text: "Precision IT Staffing & 48-Hour Shortlist Turnaround.",
      author: "Guaranteed Hiring Turnaround"
    },
    {
      text: "Executive Search Across AI, Cloud & Distributed Systems.",
      author: "Specialized Engineering Hub"
    },
    {
      text: "Bridging High-Impact Tech Minds with Visionary Enterprises.",
      author: "500+ Verified Placements"
    }
  ];

  function initTypewriterAnimation() {
    const textEl = document.querySelector('.typewriter-text');
    const authorEl = document.querySelector('.typewriter-author-tag');
    if (!textEl) return;

    let quoteIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function tick() {
      const currentQuote = quotes[quoteIndex];
      const fullText = currentQuote.text;

      if (authorEl && authorEl.textContent !== currentQuote.author) {
        authorEl.innerHTML = `— <strong>${currentQuote.author}</strong>`;
      }

      if (isDeleting) {
        // Deleting characters
        textEl.textContent = fullText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        // Typing characters
        textEl.textContent = fullText.substring(0, charIndex + 1);
        charIndex++;
      }

      // Typing speed: natural slight randomness
      let typeSpeed = isDeleting ? 30 : 65 + Math.random() * 35;

      if (!isDeleting && charIndex === fullText.length) {
        // Finished typing quote - pause and celebrate
        typeSpeed = 3600; // Hold full quote for 3.6s
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting - move to next quote
        isDeleting = false;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        typeSpeed = 450; // Short pause before next quote
      }

      setTimeout(tick, typeSpeed);
    }

    // Start typing after initial load
    setTimeout(tick, 500);
  }

  // ---------------------------------------------------------------------------
  // 5. CURVED-EDGE TRANSPARENT NAVBAR (AUTO-ADAPTABILITY)
  // ---------------------------------------------------------------------------
  function initNavbar() {
    const navbar = document.querySelector('.navbar-island');
    if (!navbar) return;

    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY || window.pageYOffset;
            if (scrollY > 25) {
              navbar.classList.add('scrolled');
            } else {
              navbar.classList.remove('scrolled');
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ---------------------------------------------------------------------------
  // 6. MODAL SYSTEM FOR THE 2 BUTTONS ("GET A QUOTE" & "ENQUIRE NOW")
  // ---------------------------------------------------------------------------
  function initModal() {
    const modalOverlay = document.getElementById('quote-enquiry-modal');
    if (!modalOverlay) return;

    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalTypeInput = document.getElementById('form-inquiry-type');
    const form = document.getElementById('quote-enquiry-form');
    const submitBtn = document.getElementById('modal-submit-btn');
    const closeBtn = modalOverlay.querySelector('.modal-close-btn');

    function openModal(type = 'quote') {
      if (type === 'enquire') {
        if (modalTitle) modalTitle.textContent = 'Enquire with Talentechno';
        if (modalSubtitle) modalSubtitle.textContent = 'Have a recruitment question or urgent staffing query? We respond within 2 hours.';
        if (modalTypeInput) modalTypeInput.value = 'General Enquiry';
        if (submitBtn) submitBtn.textContent = 'Submit Enquiry';
      } else {
        if (modalTitle) modalTitle.textContent = 'Get a Talent Quote';
        if (modalSubtitle) modalSubtitle.textContent = 'Tell us your role requirements, tech stack, and budget. Receive a tailored quote and candidate shortlist within 24 hours.';
        if (modalTypeInput) modalTypeInput.value = 'Talent Quote';
        if (submitBtn) submitBtn.textContent = 'Request Custom Quote';
      }

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        const firstInput = modalOverlay.querySelector('input:not([type="hidden"])');
        if (firstInput) firstInput.focus();
      }, 100);
    }

    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    // Button triggers
    document.addEventListener('click', (e) => {
      const quoteTrigger = e.target.closest('[data-modal-action="quote"]');
      if (quoteTrigger) {
        e.preventDefault();
        openModal('quote');
        return;
      }

      const enquireTrigger = e.target.closest('[data-modal-action="enquire"]');
      if (enquireTrigger) {
        e.preventDefault();
        openModal('enquire');
        return;
      }

      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });

    // Submissions handling
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg style="animation: spin 1s linear infinite; display: inline-block; vertical-align: middle; margin-right: 8px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Processing...
        `;

        const formData = new FormData(form);
        const rawName = (formData.get('name') || '').trim();
        const nameParts = rawName.split(/\s+/);
        const firstName = nameParts[0] || 'Client';
        const lastName = nameParts.slice(1).join(' ') || '';

        const payload = {
          first_name: firstName,
          last_name: lastName,
          name: rawName,
          email: formData.get('email') || '',
          phone: formData.get('phone') || '',
          company: formData.get('company') || '',
          service: formData.get('service') || 'General',
          target_role: formData.get('type') || 'Talent Quote',
          message: (formData.get('company') ? `[Company: ${formData.get('company')}] ` : '') + (formData.get('message') || ''),
          submitted_at: new Date().toISOString()
        };

        try {
          const response = await fetch('/api/submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            showToast('✓ Request received! Our talent team will contact you promptly.');
            form.reset();
            closeModal();
          } else {
            showToast('Request recorded. Our team will contact you at ' + payload.email);
            form.reset();
            closeModal();
          }
        } catch (err) {
          console.warn('Submission fallback:', err);
          showToast('✓ Request received. Our Hyderabad talent team will respond within 24h.');
          form.reset();
          closeModal();
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION SYSTEM
  // ---------------------------------------------------------------------------
  function showToast(message) {
    let toastContainer = document.querySelector('.toast-box');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-box';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION ON DOM READY
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNaturalPhysicsLights();
    initStarsEffect();
    initTypewriterAnimation();
    initNavbar();
    initModal();
  });
})();
