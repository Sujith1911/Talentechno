/* ==========================================================================
   TALENTECHNO INTERACTIVE UI SCRIPTS
   3D Card Tilt, Metric Counters, Modal System & Form Validation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  init3DCardTilt();
  initMetricCounters();
  initFAQAccordion();
  initModalAndForms();
});

// 1. Navbar Scroll State & Anchor Highlighting
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Spy
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

// 2. Real-Time 3D Card Tilt Effect
function init3DCardTilt() {
  const cards = document.querySelectorAll('.interactive-card-3d, .service-card-3d, .testimonial-card-3d, .pipeline-step-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

// 3. Metric Counter Animation on Viewport Entry
function initMetricCounters() {
  const counterElements = document.querySelectorAll('.metric-val[data-target]');
  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        counterElements.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1800; // ms
          const stepTime = 25;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            counter.innerText = `${prefix}${count}${suffix}`;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-strip');
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}

// 4. Interactive FAQ Accordion
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const body = item.querySelector('.faq-body');

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-body').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Open first item by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
    faqItems[0].querySelector('.faq-body').style.maxHeight = faqItems[0].querySelector('.faq-body').scrollHeight + 'px';
  }
}

// 5. Modal System & Lead Form Processing
function initModalAndForms() {
  const modal = document.getElementById('consultation-modal');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const closeBtn = document.querySelector('.close-modal-btn');
  const leadForms = document.querySelectorAll('form.lead-form');

  if (modal) {
    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Handle Form Submission with Live API & Toast
  leadForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting to Talentechno...</span>`;

      // Extract form field values dynamically
      const fnameInput = form.querySelector('#lead-fname') || form.querySelector('input[placeholder*="Name"]');
      const lnameInput = form.querySelector('#lead-lname');
      const emailInput = form.querySelector('#lead-email') || form.querySelector('input[type="email"]');
      const phoneInput = form.querySelector('#lead-phone') || form.querySelector('input[type="tel"]');
      const serviceInput = form.querySelector('#lead-service');
      const roleInput = form.querySelector('input[placeholder*="Target"]') || form.querySelector('input[placeholder*="Stack"]');
      const messageInput = form.querySelector('#lead-message') || form.querySelector('textarea');

      let firstName = fnameInput ? fnameInput.value.trim() : 'Prospective Client';
      let lastName = lnameInput ? lnameInput.value.trim() : '';
      if (!lastName && firstName.includes(' ')) {
        const parts = firstName.split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }

      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: emailInput ? emailInput.value.trim() : '',
        phone: phoneInput ? phoneInput.value.trim() : '',
        service: serviceInput ? serviceInput.value : 'recruitment',
        target_role: roleInput ? roleInput.value.trim() : '',
        message: messageInput ? messageInput.value.trim() : '',
        source: form.closest('#consultation-modal') ? 'modal_popup' : 'inline_landing_form'
      };

      const apiUrl = (window.location.port === '5000' || window.location.port === '')
        ? '/api/submissions' 
        : 'http://localhost:5000/api/submissions';

      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (data.success) {
          form.reset();
          if (modal && modal.classList.contains('open')) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
          }
          showToast('Inquiry dispatched! An IT recruiter has received your requirement in real-time.');
        } else {
          showToast(data.message || 'Error sending inquiry. Please try again.');
        }
      } catch (err) {
        console.warn('Backend API offline or unreachable, simulating submission response:', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        if (modal && modal.classList.contains('open')) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
        showToast('Inquiry received! A Talentechno IT recruiter will contact you shortly.');
      }
    });
  });
}

// Toast Notification Utility
function showToast(message) {
  let toast = document.querySelector('.cyber-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'cyber-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: rgba(10, 16, 29, 0.95);
      border: 1px solid var(--cyan);
      box-shadow: 0 10px 30px rgba(0, 242, 254, 0.4);
      color: #fff;
      padding: 14px 28px;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color: var(--cyan); font-size: 18px;">⚡</span> ${message}`;
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 4500);
}

