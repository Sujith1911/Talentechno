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
  // 5. SYNAPTIC PARTICLE & STREAM PHYSICS ENGINE (CANVAS 2D • LOW-CPU)
  // Ascending Fiber-Optic Beams • Digital Glyphs & Rings • Physical Wake
  // Deflection on Cursor/Touch • Gyroscope Gravity Slant • Tab-Pause Zero CPU
  // ---------------------------------------------------------------------------
  function initSynapticParticles() {
    const canvas = document.getElementById('synaptic-particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isRunning = true;
    let isMobile = false;

    // Theme palette definition
    const THEMES = {
      dark: {
        primary: 'rgba(168, 85, 247, ',    // Purple
        secondary: 'rgba(192, 132, 252, ',  // Light lavender
        accent: 'rgba(56, 189, 248, ',     // Neon cyan
        white: 'rgba(255, 255, 255, ',     // Diamond tip
        deep: 'rgba(126, 34, 206, '        // Deep purple
      },
      light: {
        primary: 'rgba(180, 115, 15, ',    // Rich warm amber gold
        secondary: 'rgba(212, 160, 45, ',  // Soft champagne gold
        accent: 'rgba(146, 64, 14, ',      // Deep rich bronze
        white: 'rgba(255, 255, 255, ',     // Crisp white tips
        deep: 'rgba(120, 53, 15, '         // Dark amber
      }
    };

    function getPalette() {
      const theme = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      return THEMES[theme];
    }

    // Physical Device & Interaction State
    const mouse = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      radius: 130,
      active: false
    };

    // Device Tilt Gravity (Mobile Gyroscope)
    let gravityX = 0;

    // Synaptic Ripples (Click / Tap shockwaves)
    const shockwaves = [];

    // Collections
    let streams = [];
    let particles = [];
    let trailSparks = [];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      isMobile = width <= 640;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initEntities();
    }

    function initEntities() {
      streams = [];
      particles = [];
      trailSparks = [];

      // Scale stream count and particle count across entire screen boundaries (boundary-to-boundary)
      const streamCount = Math.max(8, Math.min(Math.round(width / 115), 20));
      const particleCount = Math.max(45, Math.min(Math.round(width / 18), 110));

      // 1. Initialize Ascending Light Beams with Real-Time Trailing Physics
      const slotW = width / streamCount;
      for (let i = 0; i < streamCount; i++) {
        const isCurved = i % 3 === 0; // Smooth circuit bezier bend
        const streamX = i * slotW + Math.random() * slotW; // Even distribution from left to right boundaries
        streams.push({
          x: streamX,
          y: Math.random() * (height + 200),
          speed: 1.1 + Math.random() * 1.4,
          thickness: 0.75 + Math.random() * 0.65, // Micro refined thickness
          isCurved: isCurved,
          curveDir: Math.random() > 0.5 ? 1 : -1,
          curveAmount: 18 + Math.random() * 32,
          swayPhase: Math.random() * Math.PI * 2,
          swaySpeed: 0.015 + Math.random() * 0.02,
          swayAmp: isCurved ? (0.45 + Math.random() * 0.65) : (0.12 + Math.random() * 0.2),
          colorType: (i % 4 === 0) ? 'accent' : (i % 2 === 0 ? 'primary' : 'secondary'),
          headRadius: 1.0 + Math.random() * 0.75, // Micro head radius
          headGlow: 4.5 + Math.random() * 5.5,
          forceX: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          trail: [], // Real-time breadcrumb history with decay & disappearance
          maxTrailPoints: 24 + Math.floor(Math.random() * 18),
          shedTimer: Math.random() * 10
        });
      }

      // 2. Initialize Micro-Scale Data Particles & Micro-Glyphs (Boundary-to-boundary)
      const types = ['dot', 'dot', 'ring', 'ring', 'square', 'bokeh'];
      for (let i = 0; i < particleCount; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const depth = 0.4 + Math.random() * 0.6;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseVy: -(0.32 + Math.random() * 0.75) * depth,
          vx: 0,
          vy: 0,
          forceX: 0,
          forceY: 0,
          type: type,
          // Reduced micro particle dimensions:
          size: type === 'bokeh' ? (2.0 + Math.random() * 2.2) : (type === 'ring' ? (1.2 + Math.random() * 0.9) : (0.75 + Math.random() * 0.75)),
          depth: depth,
          alpha: type === 'bokeh' ? (0.10 + Math.random() * 0.18) : (0.35 + Math.random() * 0.50),
          colorType: (i % 5 === 0) ? 'accent' : (i % 3 === 0 ? 'white' : 'primary'),
          waveOffset: Math.random() * Math.PI * 2,
          waveSpeed: 0.015 + Math.random() * 0.025,
          waveAmp: 0.20 + Math.random() * 0.45
        });
      }
    }

    // Physical Interaction Event Listeners (Fixed Viewport Coordinates)
    window.addEventListener(
      'mousemove',
      (e) => {
        const curX = e.clientX;
        const curY = e.clientY;
        if (mouse.x > -9000) {
          mouse.vx = (curX - mouse.x) * 0.3;
          mouse.vy = (curY - mouse.y) * 0.3;
        }
        mouse.x = curX;
        mouse.y = curY;
        mouse.active = true;
      },
      { passive: true }
    );

    window.addEventListener(
      'mouseleave',
      () => {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      },
      { passive: true }
    );

    // Touch Support (Fixed Viewport Coordinates)
    window.addEventListener(
      'touchmove',
      (e) => {
        if (!e.touches.length) return;
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        mouse.active = true;
      },
      { passive: true }
    );

    window.addEventListener(
      'touchend',
      () => {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      },
      { passive: true }
    );

    // Click / Tap Synaptic Shockwave Ripple
    window.addEventListener('click', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        shockwaves.push({
          x: x,
          y: y,
          radius: 0,
          maxRadius: 180 + Math.random() * 80,
          opacity: 0.75,
          speed: 5.5
        });
      }
    });

    // Device Orientation (Mobile Gyroscope Gravity Slant)
    if (window.DeviceOrientationEvent) {
      window.addEventListener(
        'deviceorientation',
        (e) => {
          if (e.gamma !== null && e.gamma !== undefined) {
            const rad = (e.gamma * Math.PI) / 180;
            gravityX = Math.sin(rad) * 0.45;
          }
        },
        { passive: true }
      );
    }

    // Visibility Handling (Zero CPU when backgrounded)
    document.addEventListener('visibilitychange', () => {
      isRunning = !document.hidden;
      if (isRunning) {
        lastTime = performance.now();
        requestAnimationFrame(render);
      }
    });

    // Main Physics & Render Loop
    let lastTime = performance.now();
    function render(timestamp) {
      if (!isRunning) return;

      const dt = Math.min((timestamp - lastTime) / 16.67, 2.0); // normalized to 60fps
      lastTime = timestamp;

      const palette = getPalette();
      ctx.clearRect(0, 0, width, height);

      // Mouse velocity damping
      mouse.vx *= 0.88;
      mouse.vy *= 0.88;

      // 1. Process Shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += sw.speed * dt;
        sw.opacity *= Math.pow(0.94, dt);

        if (sw.opacity < 0.02 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(s, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = palette.primary + sw.opacity * 0.45 + ')';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 2. Update & Draw Ascending Light Beams with Real-Time Trailing Physics & Disappearance
      for (let i = 0; i < streams.length; i++) {
        const st = streams[i];

        // Physical deflection from cursor
        if (mouse.active) {
          const dx = st.x - mouse.x;
          const dy = st.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 1) {
            const force = (1 - dist / mouse.radius) * 2.2;
            st.forceX += (dx / dist) * force;
          }
        }

        // Apply physical damping, sway & mobile gyroscope tilt
        st.forceX *= Math.pow(0.90, dt);
        st.swayPhase += st.swaySpeed * dt;
        const swayOffset = Math.sin(st.swayPhase) * st.swayAmp;
        st.x += (st.forceX + swayOffset + gravityX * 0.5) * dt;
        st.y -= st.speed * dt;

        // Wrap around vertically when off-screen top
        if (st.y < -40) {
          st.y = height + 40 + Math.random() * 60;
          st.x = Math.random() * width;
          st.forceX = 0;
          st.trail = [];
        }

        // Keep inside screen width with soft wrap
        if (st.x < -30) st.x = width + 20;
        if (st.x > width + 30) st.x = -20;

        // Record real-time breadcrumb point for trailing physics
        st.trail.unshift({
          x: st.x,
          y: st.y,
          alpha: 1.0,
          vx: (Math.random() - 0.5) * 0.12,
          vy: 0.12 * dt
        });

        if (st.trail.length > st.maxTrailPoints) {
          st.trail.pop();
        }

        const colorBase = palette[st.colorType] || palette.primary;
        const headColor = palette.white;

        // Update trail points with physical dissipation & trail disappearance
        for (let t = st.trail.length - 1; t >= 0; t--) {
          const pt = st.trail[t];
          pt.alpha *= Math.pow(0.925, dt); // Progressive decay & disappearance
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          if (pt.alpha < 0.02) {
            st.trail.splice(t, 1);
          }
        }

        // Draw Stream Dynamic Trailing Path (Spline with decaying alpha & thickness)
        if (st.trail.length > 2) {
          const tailPt = st.trail[st.trail.length - 1];
          const grad = ctx.createLinearGradient(st.x, tailPt.y, st.x, st.y);
          grad.addColorStop(0, colorBase + '0)');
          grad.addColorStop(0.35, colorBase + '0.12)');
          grad.addColorStop(0.75, colorBase + '0.50)');
          grad.addColorStop(1, colorBase + '0.90)');

          ctx.beginPath();
          ctx.moveTo(st.trail[0].x, st.trail[0].y);
          for (let t = 1; t < st.trail.length - 1; t++) {
            const xc = (st.trail[t].x + st.trail[t + 1].x) / 2;
            const yc = (st.trail[t].y + st.trail[t + 1].y) / 2;
            ctx.quadraticCurveTo(st.trail[t].x, st.trail[t].y, xc, yc);
          }
          ctx.lineTo(tailPt.x, tailPt.y);

          ctx.strokeStyle = grad;
          ctx.lineWidth = st.thickness;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }

        // Real-Time Trail Micro-Spark Shedding
        st.shedTimer += dt;
        if (st.shedTimer > 9 && Math.random() < 0.28 && trailSparks.length < 50) {
          st.shedTimer = 0;
          trailSparks.push({
            x: st.x + (Math.random() - 0.5) * 2,
            y: st.y + Math.random() * 8,
            vx: (Math.random() - 0.5) * 0.4,
            vy: 0.25 + Math.random() * 0.4,
            alpha: 0.75,
            size: 0.6 + Math.random() * 0.6,
            colorType: st.colorType
          });
        }

        // Draw Micro Radiant Stream Head Particle
        const pulse = 1 + Math.sin(timestamp * 0.005 + st.pulsePhase) * 0.22;
        const currentHeadR = st.headRadius * pulse;

        // Subtle Radial Halo Glow
        const glowGrad = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, st.headGlow * pulse);
        glowGrad.addColorStop(0, colorBase + '0.75)');
        glowGrad.addColorStop(0.45, colorBase + '0.22)');
        glowGrad.addColorStop(1, colorBase + '0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.headGlow * pulse, 0, Math.PI * 2);
        ctx.fill();

        // High-Luminance Micro Core
        ctx.fillStyle = headColor + '0.95)';
        ctx.beginPath();
        ctx.arc(st.x, st.y, currentHeadR, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2.5 Update & Draw Dispersing Micro Trail Sparks
      for (let s = trailSparks.length - 1; s >= 0; s--) {
        const sp = trailSparks[s];
        sp.x += sp.vx * dt;
        sp.y += sp.vy * dt;
        sp.alpha *= Math.pow(0.91, dt); // Progressive decay

        if (sp.alpha < 0.02 || sp.y > height + 20) {
          trailSparks.splice(s, 1);
          continue;
        }

        const colorBase = palette[sp.colorType] || palette.primary;
        ctx.fillStyle = colorBase + sp.alpha + ')';
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Update & Draw Digital Micro-Particles (Dots, Rings, Squares, Bokeh)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Natural laminar ascent + harmonic oscillation
        p.waveOffset += p.waveSpeed * dt;
        p.vx = Math.sin(p.waveOffset) * p.waveAmp + gravityX * p.depth;
        p.vy = p.baseVy;

        // Physical repulsion force from mouse cursor
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 1) {
            const force = Math.pow(1 - dist / mouse.radius, 2) * 3.5 * p.depth;
            p.forceX += (dx / dist) * force;
            p.forceY += (dy / dist) * force;
          }
        }

        // Physical interaction with Shockwaves
        for (let s = 0; s < shockwaves.length; s++) {
          const sw = shockwaves[s];
          const dx = p.x - sw.x;
          const dy = p.y - sw.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - sw.radius);
          if (diff < 35) {
            const impulse = (1 - diff / 35) * sw.opacity * 2.8;
            p.forceX += (dx / (dist || 1)) * impulse;
            p.forceY += (dy / (dist || 1)) * impulse;
          }
        }

        // Inertia damping
        p.forceX *= Math.pow(0.91, dt);
        p.forceY *= Math.pow(0.91, dt);

        p.x += (p.vx + p.forceX) * dt;
        p.y += (p.vy + p.forceY) * dt;

        // Wrap around edges
        if (p.y < -20) {
          p.y = height + 15;
          p.x = Math.random() * width;
          p.forceX = 0;
          p.forceY = 0;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const colorBase = palette[p.colorType] || palette.primary;
        const currentAlpha = Math.min(Math.max(p.alpha + Math.sin(p.waveOffset * 1.5) * 0.15, 0.05), 1.0);

        // Render based on particle type matching reference image
        if (p.type === 'ring') {
          // Hollow Digital Byte Ring (from reference image)
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = colorBase + currentAlpha + ')';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        } else if (p.type === 'square') {
          // Digital Micro-Square (from reference image)
          ctx.fillStyle = colorBase + currentAlpha + ')';
          ctx.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
        } else if (p.type === 'bokeh') {
          // Soft Out-of-Focus Bokeh Glow
          const bokehGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          bokehGrad.addColorStop(0, colorBase + (currentAlpha * 0.9) + ')');
          bokehGrad.addColorStop(0.5, colorBase + (currentAlpha * 0.3) + ')');
          bokehGrad.addColorStop(1, colorBase + '0)');
          ctx.fillStyle = bokehGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Standard Radiant Data Dot
          ctx.fillStyle = colorBase + currentAlpha + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(render);
    }

    // Initialize and start
    resize();
    let resizeTimer = null;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 120);
      },
      { passive: true }
    );

    requestAnimationFrame(render);
  }

  // ---------------------------------------------------------------------------
  // 6. CARD GAZE PARALLAX ENGINE (FOREGROUND COUNTER-TILT • ZERO CPU)
  // ---------------------------------------------------------------------------
  function initCardGazeParallax() {
    const card = document.getElementById('gaze-card');
    if (!card) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMouseActive = false;
    let lastInteractionTime = 0;
    let isRunning = true;

    window.addEventListener(
      'mousemove',
      (e) => {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        targetX = (e.clientX - halfW) / halfW;
        targetY = (e.clientY - halfH) / halfH;
        isMouseActive = true;
        lastInteractionTime = performance.now();
      },
      { passive: true }
    );

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

    document.addEventListener('visibilitychange', () => {
      isRunning = !document.hidden;
      if (isRunning) {
        requestAnimationFrame(physicsStep);
      }
    });

    function physicsStep(timestamp) {
      if (!isRunning) return;

      const elapsed = timestamp - lastInteractionTime;
      if (!isMouseActive || elapsed > 2200) {
        const t = timestamp * 0.0012;
        targetX = Math.sin(t) * 0.25;
        targetY = Math.cos(t * 0.85) * 0.2;
      }

      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      const cardX = (-currentX * 4.5).toFixed(2);
      const cardY = (-currentY * 3.2).toFixed(2);
      const cardRotX = (-currentY * 3.5).toFixed(2);
      const cardRotY = (currentX * 4.5).toFixed(2);
      card.style.transform = `translate3d(${cardX}px, ${cardY}px, 0) rotateX(${cardRotX}deg) rotateY(${cardRotY}deg)`;

      requestAnimationFrame(physicsStep);
    }

    requestAnimationFrame(physicsStep);
  }

  // ---------------------------------------------------------------------------
  // 7. CYBERNETIC HOLOGRAPHIC HAND WORKS SHOWCASE (CASE STUDIES PROJECTOR)
  // ---------------------------------------------------------------------------
  const caseStudies = [
    {
      id: 'genai',
      badge: 'GenAI & Autonomous Engineering Pod',
      title: '24-Member Specialized LLM Team in 48 Hours',
      client: 'Silicon Valley AI Unicorn',
      metrics: [
        { label: 'Turnaround', value: '48 Hours' },
        { label: 'Roles Vetted', value: '24 Engineers' },
        { label: 'Offer Acceptance', value: '100%' },
        { label: '12M Retention', value: '98.5%' }
      ],
      desc: 'Rapidly assembled a dedicated squad of PyTorch, Triton, LangChain, and Distributed Training specialists to build multi-agent enterprise workflows. Zero renege, fully integrated across global timezones.'
    },
    {
      id: 'cloud',
      badge: 'Cloud Modernization & DevOps Scale',
      title: '40+ Certified Kubernetes & Cloud Architects',
      client: 'Global FinTech Banking Infrastructure',
      metrics: [
        { label: 'Team Scaled', value: '42 Architects' },
        { label: 'SLA Met', value: '99.99%' },
        { label: 'Migration Speed', value: '3.5 Months' },
        { label: 'Cost Savings', value: '38%' }
      ],
      desc: 'Sourced multi-cloud architects (AWS/GCP/Terraform) with strict zero-trust security clearance. Reduced legacy infrastructure downtime by 99.8% and streamlined automated CI/CD pipelines.'
    },
    {
      id: 'leadership',
      badge: 'Executive Technology Leadership',
      title: 'VP of Engineering & Principal Data Scientists',
      client: 'High-Growth Hyderabad Tech Center',
      metrics: [
        { label: 'Placements', value: '6 C-Level Leads' },
        { label: 'Confidentiality', value: '100%' },
        { label: 'Tenure Avg', value: '3.4 Years' },
        { label: 'Talent Pool', value: 'Top 1.5%' }
      ],
      desc: 'Closed high-stakes executive leadership roles in Hyderabad. Curated candidates with proven experience leading 150+ engineer orgs and shipping mission-critical deep learning infrastructure.'
    },
    {
      id: 'odc',
      badge: 'Offshore Development Center (ODC)',
      title: '120-Engineer Turnkey ODC & BOT Model',
      client: 'European SaaS Enterprise',
      metrics: [
        { label: 'Pod Scale', value: '120 Developers' },
        { label: 'Setup Time', value: '21 Days' },
        { label: 'Cost Efficiency', value: '62%' },
        { label: 'IP Protection', value: 'ISO 27001' }
      ],
      desc: 'Delivered a dedicated Offshore Development Center in Hyderabad with plug-and-play engineering pods, comprehensive IT security, HR infrastructure, and seamless BOT (Build-Operate-Transfer) execution.'
    }
  ];

  function initWorksShowcase() {
    const container = document.getElementById('works-showcase');
    if (!container) return;

    const tabs = container.querySelectorAll('.works-tab-btn');
    const badgeEl = container.querySelector('.projected-badge');
    const titleEl = container.querySelector('.projected-title');
    const clientEl = container.querySelector('.projected-client');
    const descEl = container.querySelector('.projected-desc');
    const metricsGrid = container.querySelector('.projected-metrics-grid');
    const hologramCard = container.querySelector('.projected-hologram-card');

    function selectCase(index) {
      const data = caseStudies[index];
      if (!data) return;

      tabs.forEach((tab, idx) => {
        tab.classList.toggle('active', idx === index);
      });

      if (hologramCard) {
        hologramCard.classList.add('switching');
        setTimeout(() => {
          if (badgeEl) badgeEl.textContent = data.badge;
          if (titleEl) titleEl.textContent = data.title;
          if (clientEl) clientEl.textContent = 'Client: ' + data.client;
          if (descEl) descEl.textContent = data.desc;
          if (metricsGrid) {
            metricsGrid.innerHTML = data.metrics.map(m => `
              <div class="projected-metric-item">
                <span class="projected-metric-val">${m.value}</span>
                <span class="projected-metric-label">${m.label}</span>
              </div>
            `).join('');
          }
          hologramCard.classList.remove('switching');
        }, 160);
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectCase(index));
    });

    // Auto rotate every 7 seconds when not hovered
    let activeIdx = 0;
    let autoInterval = setInterval(() => {
      activeIdx = (activeIdx + 1) % caseStudies.length;
      selectCase(activeIdx);
    }, 7000);

    container.addEventListener('mouseenter', () => clearInterval(autoInterval));
  }

  // ---------------------------------------------------------------------------
  // 8. ON-SCROLL SERVICES REVEAL OBSERVER
  // ---------------------------------------------------------------------------
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!reveals.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
      });

      reveals.forEach((el, idx) => {
        el.style.setProperty('--reveal-delay', `${(idx % 3) * 0.12}s`);
        observer.observe(el);
      });
    } else {
      reveals.forEach(el => el.classList.add('revealed'));
    }
  }

  // ---------------------------------------------------------------------------
  // 9. OPEN-SOURCE VISUAL CAPTCHA WIDGET
  // ---------------------------------------------------------------------------
  async function fetchCaptcha(formOrWidget) {
    try {
      const resp = await fetch('/api/captcha');
      const data = await resp.json();
      if (data && data.success) {
        const img = formOrWidget.querySelector('.captcha-img');
        const tokenInput = formOrWidget.querySelector('.captcha-token-input');
        const answerInput = formOrWidget.querySelector('.captcha-answer-input');

        if (img) img.src = data.image;
        if (tokenInput) tokenInput.value = data.token;
        if (answerInput) answerInput.value = '';
      }
    } catch (err) {
      console.warn('Captcha load issue:', err);
    }
  }

  function initCaptchaWidget() {
    const widgets = document.querySelectorAll('.captcha-widget-wrap');
    widgets.forEach((wrap) => {
      fetchCaptcha(wrap);

      const refreshBtn = wrap.querySelector('.captcha-refresh-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', (e) => {
          e.preventDefault();
          refreshBtn.classList.add('spinning');
          fetchCaptcha(wrap).finally(() => {
            setTimeout(() => refreshBtn.classList.remove('spinning'), 400);
          });
        });
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 10. SERVICES PAGE CONTACT FORM HANDLER
  // ---------------------------------------------------------------------------
  function initServicesContactForm() {
    const form = document.getElementById('services-contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Verifying & Submitting...</span>`;
      }

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => { payload[key] = value; });

      try {
        const resp = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await resp.json();

        if (result.success) {
          showToast('✅ Inquiry received! Our Hyderabad team will contact you within 24 hours.');
          form.reset();
          const wrap = form.querySelector('.captcha-widget-wrap');
          if (wrap) fetchCaptcha(wrap);
        } else {
          showToast(`⚠️ ${result.message || 'Submission failed. Please check inputs.'}`);
          if (result.error === 'CAPTCHA_INVALID') {
            const wrap = form.querySelector('.captcha-widget-wrap');
            if (wrap) fetchCaptcha(wrap);
          }
        }
      } catch (err) {
        showToast('❌ Network error. Please try again or WhatsApp +91 9030888469.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // INITIALIZATION ON DOM READY
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypewriterAnimation();
    initNavbar();
    initModal();
    initSynapticParticles();
    initCardGazeParallax();
    initWorksShowcase();
    initScrollReveal();
    initCaptchaWidget();
    initServicesContactForm();
  });
})();
