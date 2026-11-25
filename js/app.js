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
  // 2. TYPESCRIPTING / TYPEWRITER ANIMATION OF TALENTECHNO'S QUOTE
  // ---------------------------------------------------------------------------
  const quotes = [
    {
      text: "BE THE CHANGE YOU WISH TO SEE IN THE WORLD.",
      author: "Mahatma Gandhi • Talentechno Guiding Spirit"
    },
    {
      text: "CONNECTING TECH TALENT WITH TOMORROW'S INNOVATIONS.",
      author: "Talentechno Core Mission"
    },
    {
      text: "PRECISION IT STAFFING & 48-HOUR SHORTLIST TURNAROUND.",
      author: "Guaranteed Talent Turnaround"
    },
    {
      text: "BRIDGING HIGH-IMPACT TECH MINDS WITH VISIONARY ENTERPRISES.",
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
  // 5. NATURAL PHYSICS GAZE ENGINE (LOW CPU • 3D NUCLEUS & DISPERSED SATELLITES)
  // ---------------------------------------------------------------------------
  function initGazePhysics() {
    const stage = document.getElementById('gaze-stage');
    const nucleus = document.getElementById('organic-nucleus');
    const dispersedContainer = document.getElementById('dispersed-stage');
    const sparkleStar = document.getElementById('sparkle-star');
    const card = document.getElementById('gaze-card');
    if (!stage || !card) return;

    const satelliteNodes = dispersedContainer ? Array.from(dispersedContainer.querySelectorAll('[data-depth]')) : [];

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMouseActive = false;
    let lastInteractionTime = 0;
    let isRunning = true;

    // Track cursor gaze on desktop
    window.addEventListener(
      'mousemove',
      (e) => {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        targetX = (e.clientX - halfW) / halfW; // -1 to +1
        targetY = (e.clientY - halfH) / halfH; // -1 to +1
        isMouseActive = true;
        lastInteractionTime = performance.now();
      },
      { passive: true }
    );

    // Track touch gaze on mobile / tablet
    window.addEventListener(
      'touchmove',
      (e) => {
        if (!e.touches.length) return;
        const touch = e.touches[0];
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        targetX = ((touch.clientX - halfW) / halfW) * 0.7;
        targetY = ((touch.clientY - halfH) / halfH) * 0.7;
        isMouseActive = true;
        lastInteractionTime = performance.now();
      },
      { passive: true }
    );

    // Pause physics calculations when the browser tab is hidden (Zero CPU wasted)
    document.addEventListener('visibilitychange', () => {
      isRunning = !document.hidden;
      if (isRunning) {
        requestAnimationFrame(physicsStep);
      }
    });

    function physicsStep(timestamp) {
      if (!isRunning) return;

      // When mouse is idle for > 2s, blend into natural organic sine wave drift
      const elapsedSinceInteraction = timestamp - lastInteractionTime;
      if (!isMouseActive || elapsedSinceInteraction > 2000) {
        const t = timestamp * 0.0012;
        targetX = Math.sin(t) * 0.35 + Math.cos(t * 0.7) * 0.15;
        targetY = Math.cos(t * 0.85) * 0.25 + Math.sin(t * 0.5) * 0.1;
      }

      // Smooth inertia spring damping (lerp)
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      // 1. Move 3D Liquid Glass Nucleus (Matches Reference Image at Depth 0.04)
      if (nucleus) {
        const nX = (currentX * 18).toFixed(2);
        const nY = (currentY * 14).toFixed(2);
        nucleus.style.transform = `translate(-50%, -50%) translate3d(${nX}px, ${nY}px, 0)`;
      }

      // 2. Move Dispersed Satellite Glass Droplets & Celestial Filaments
      for (let i = 0; i < satelliteNodes.length; i++) {
        const node = satelliteNodes[i];
        const depth = parseFloat(node.getAttribute('data-depth')) || 0.05;
        const moveX = (currentX * depth * 340).toFixed(2);
        const moveY = (currentY * depth * 240).toFixed(2);

        if (node.classList.contains('ring-alpha')) {
          node.style.transform = `translate(-50%, -50%) translate3d(${moveX}px, ${moveY}px, 0) rotate(-12deg)`;
        } else if (node.classList.contains('ring-beta')) {
          node.style.transform = `translate(-50%, -50%) translate3d(${moveX}px, ${moveY}px, 0) rotate(18deg)`;
        } else {
          node.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        }
      }

      // 3. Move Reference 4-Point Diamond Sparkle Star (Depth 0.09)
      if (sparkleStar) {
        const sX = (currentX * 24).toFixed(2);
        const sY = (currentY * 18).toFixed(2);
        sparkleStar.style.transform = `translate3d(${sX}px, ${sY}px, 0)`;
      }

      // 4. Foreground Frosted Card: subtle gentle counter-tilt for optical gaze lock
      const cardX = (-currentX * 4).toFixed(2);
      const cardY = (-currentY * 3).toFixed(2);
      const cardRotX = (-currentY * 3.5).toFixed(2);
      const cardRotY = (currentX * 4.5).toFixed(2);
      card.style.transform = `translate3d(${cardX}px, ${cardY}px, 0) rotateX(${cardRotX}deg) rotateY(${cardRotY}deg)`;

      requestAnimationFrame(physicsStep);
    }

    requestAnimationFrame(physicsStep);
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION ON DOM READY
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypewriterAnimation();
    initNavbar();
    initModal();
    initGazePhysics();
  });
})();
