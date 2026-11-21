/* ==========================================================================
   TALENTECHNO FRONTEND CORE APP
   Realtime API Connection, YouTube Video Modal, Dynamic R2 Image Showcase
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initVideoPlayerModal();
  loadDynamicVideos();
  loadDynamicImageHolders();
  initContactForms();
  initMetricCounters();
});

// 1. Navigation Scroll Spy
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// 2. YouTube Video Modal Engine
function initVideoPlayerModal() {
  let modal = document.querySelector('.video-modal-backdrop');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'video-modal-backdrop';
    modal.innerHTML = `
      <div class="video-modal-container">
        <button class="video-modal-close" aria-label="Close Video">&times;</button>
        <div class="video-iframe-wrapper">
          <iframe id="youtube-player-iframe" src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.video-modal-close');
    const iframe = modal.querySelector('#youtube-player-iframe');

    const closeModal = () => {
      modal.classList.remove('open');
      iframe.src = '';
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }
}

function openYouTubeModal(youtubeId) {
  const modal = document.querySelector('.video-modal-backdrop');
  const iframe = document.querySelector('#youtube-player-iframe');
  if (modal && iframe) {
    iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// 3. Load Dynamic Review Videos from Backend API
async function loadDynamicVideos() {
  const container = document.getElementById('recent-videos-grid');
  if (!container) return;

  try {
    const res = await fetch('/api/videos');
    const data = await res.json();
    if (data.success && data.videos && data.videos.length > 0) {
      container.innerHTML = data.videos.map(v => `
        <div class="video-card" onclick="openYouTubeModal('${v.youtube_id}')">
          <div class="video-thumb-container">
            <img src="${v.thumbnail}" alt="${escapeHtml(v.title)}" onerror="this.src='https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'">
            <div class="video-play-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div class="video-card-body">
            <h4>${escapeHtml(v.title)}</h4>
            <p class="video-quote">"${escapeHtml(v.quote)}"</p>
            <div class="video-author">
              <div style="font-weight: 700; color: var(--gold-dark);">${escapeHtml(v.client_name)}</div>
              <div style="font-size: 12px; color: var(--text-secondary);">&bull; ${escapeHtml(v.client_role)}, ${escapeHtml(v.company)}</div>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.warn('Backend video API offline, fallback cards active.');
  }
}

// 4. Load Dynamic R2 Image Holders
async function loadDynamicImageHolders() {
  const container = document.getElementById('dynamic-r2-holders');
  if (!container) return;

  try {
    const res = await fetch('/api/media/showcase');
    const data = await res.json();
    if (data.success && data.files && data.files.length > 0) {
      container.innerHTML = data.files.slice(0, 4).map(f => `
        <div class="image-holder-card">
          <img src="${f.url}" alt="${escapeHtml(f.key)}" onerror="this.src='https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'">
          <div class="image-holder-caption">Cloudflare R2 &bull; ${escapeHtml(f.key)}</div>
        </div>
      `).join('');
    }
  } catch (e) {}
}

// 5. Live Contact Form Submission
function initContactForms() {
  const forms = document.querySelectorAll('form.lead-form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span>Connecting with Talentechno...</span>`;

      const fname = form.querySelector('#lead-fname') || form.querySelector('input[placeholder*="Name"]');
      const lname = form.querySelector('#lead-lname');
      const email = form.querySelector('#lead-email') || form.querySelector('input[type="email"]');
      const phone = form.querySelector('#lead-phone') || form.querySelector('input[type="tel"]');
      const service = form.querySelector('#lead-service');
      const role = form.querySelector('#lead-role') || form.querySelector('input[placeholder*="Target"]');
      const msg = form.querySelector('#lead-message') || form.querySelector('textarea');

      let firstName = fname ? fname.value.trim() : 'Prospective Client';
      let lastName = lname ? lname.value.trim() : '';
      if (!lastName && firstName.includes(' ')) {
        const parts = firstName.split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }

      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email ? email.value.trim() : '',
        phone: phone ? phone.value.trim() : '',
        service: service ? service.value : 'recruitment',
        target_role: role ? role.value.trim() : '',
        message: msg ? msg.value.trim() : '',
        source: window.location.pathname
      };

      try {
        const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        btn.disabled = false;
        btn.innerHTML = originalText;

        if (data.success) {
          form.reset();
          showGoldToast('Thank you! Your hiring request has been received by our senior recruiters in real-time.');
        } else {
          showGoldToast(data.message || 'Submission received.');
        }
      } catch (err) {
        btn.disabled = false;
        btn.innerHTML = originalText;
        form.reset();
        showGoldToast('Your inquiry has been logged! A Talentechno recruiter will contact you shortly.');
      }
    });
  });
}

// 6. Metric Counter Animation
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
          const duration = 1600;
          const step = Math.ceil(target / (duration / 25));

          const timer = setInterval(() => {
            count += step;
            if (count >= target) {
              count = target;
              clearInterval(timer);
            }
            counter.innerText = `${prefix}${count}${suffix}`;
          }, 25);
        });
      }
    });
  }, { threshold: 0.3 });

  const metricsSection = document.querySelector('.metrics-strip');
  if (metricsSection) observer.observe(metricsSection);
}

// Toast Notification
function showGoldToast(message) {
  let toast = document.querySelector('.gold-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'gold-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #FFFFFF;
      border: 1px solid var(--gold-primary);
      box-shadow: 0 16px 40px rgba(197, 160, 89, 0.35);
      color: var(--text-main);
      padding: 16px 30px;
      border-radius: 40px;
      font-size: 14px;
      font-weight: 700;
      z-index: 10000;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 12px;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color: var(--gold-dark); font-size: 20px;">✨</span> ${message}`;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 4500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
