/* ==========================================================================
   TALENTECHNO - 3D CAREER DECISION COIN & INTERACTIVE PATH NAVIGATOR
   Real-Time WebGL 3D Gold Coin • Dynamic Rotation • Mouse Tilt • Scroll Morph
   ========================================================================== */

(function () {
  'use strict';

  // 1. Career Paths Definition
  const CAREER_PATHS = [
    {
      id: 'cloud-architecture',
      title: 'Cloud & Distributed Architecture',
      tag: 'High Velocity Scale',
      icon: '☁️',
      color: '#D4AF37',
      glow: 'rgba(212, 175, 55, 0.45)',
      demand: '98% Market Demand',
      package: '₹28L – ₹75L / $140K – $220K',
      description: 'Architecting resilient, multi-region distributed backends, Kubernetes mesh networks, and microservice topologies for high-concurrency enterprise workloads.',
      stack: ['Kubernetes', 'Go / Rust', 'AWS / GCP', 'Terraform', 'Kafka', 'gRPC'],
      roleInquiry: 'Cloud & Distributed Systems Architect'
    },
    {
      id: 'ai-data-intelligence',
      title: 'AI, LLMs & Data Intelligence',
      tag: 'Hyper-Growth Frontier',
      icon: '🤖',
      color: '#00D2FF',
      glow: 'rgba(0, 210, 255, 0.4)',
      demand: '99% Unprecedented Surge',
      package: '₹32L – ₹85L / $160K – $250K',
      description: 'Fine-tuning foundation LLMs, implementing low-latency vector databases, agentic pipelines, and autonomous decision systems for modern software suites.',
      stack: ['PyTorch', 'LangChain', 'vLLM', 'Vector DBs', 'Python', 'MLOps'],
      roleInquiry: 'Lead AI & Machine Learning Engineer'
    },
    {
      id: 'fullstack-systems',
      title: 'Full-Stack & High-Scale Systems',
      tag: 'Core Product Engine',
      icon: '⚡',
      color: '#E5A93C',
      glow: 'rgba(229, 169, 60, 0.45)',
      demand: '95% Continuous Need',
      package: '₹24L – ₹65L / $120K – $190K',
      description: 'Crafting ultra-responsive UI applications backed by concurrent asynchronous APIs, edge-rendering architectures, and robust type-safe codebases.',
      stack: ['Next.js / React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'GraphQL'],
      roleInquiry: 'Staff Full-Stack Software Engineer'
    },
    {
      id: 'cybersecurity-devsecops',
      title: 'Cybersecurity & DevSecOps',
      tag: 'Mission Critical Guard',
      icon: '🛡️',
      color: '#10B981',
      glow: 'rgba(16, 185, 129, 0.4)',
      demand: '96% Premium Defense',
      package: '₹26L – ₹70L / $130K – $210K',
      description: 'Hardening cloud perimeters, embedding continuous automated vulnerability scanning in CI/CD, Zero-Trust network policy, and threat modeling.',
      stack: ['Zero Trust', 'Cloud Security', 'Kubernetes RBAC', 'SIEM', 'Compliance', 'Vault'],
      roleInquiry: 'Principal Cybersecurity & DevSecOps Architect'
    }
  ];

  let currentPathIndex = 0;
  let scene, camera, renderer, coinMesh, particleSystem;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let currentRotationX = 0;
  let currentRotationY = 0;
  let isFlipping = false;
  let flipVelocity = 0;
  let flipProgress = 0;
  let idleTime = 0;
  let scrollProgress = 0;

  // DOM Elements
  let container, canvas, dossierEl, optionsContainer, flipBtn, auraEl;

  document.addEventListener('DOMContentLoaded', () => {
    initDOMReferences();
    if (!container || !canvas) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not yet loaded, retrying...');
      setTimeout(() => initThreeScene(), 300);
    } else {
      initThreeScene();
    }

    renderCareerOptions();
    updateDossierCard(CAREER_PATHS[0]);
    initScrollAndInteraction();
  });

  function initDOMReferences() {
    container = document.getElementById('career-coin-viewport');
    canvas = document.getElementById('career-coin-canvas');
    dossierEl = document.getElementById('career-dossier-container');
    optionsContainer = document.getElementById('career-options-selector');
    flipBtn = document.getElementById('coin-flip-trigger');
    auraEl = document.getElementById('coin-ambient-aura');
  }

  // 2. Procedural High-Resolution Texture Generators for 3D Coin
  function createFrontFaceTexture() {
    const size = 1024;
    const cvs = document.createElement('canvas');
    cvs.width = size;
    cvs.height = size;
    const ctx = cvs.getContext('2d');

    // Metallic Radial Gold Background
    const grad = ctx.createRadialGradient(size / 2, size / 2, 40, size / 2, size / 2, size / 2);
    grad.addColorStop(0, '#FFF5D6');
    grad.addColorStop(0.35, '#E8C568');
    grad.addColorStop(0.7, '#D4AF37');
    grad.addColorStop(0.9, '#A67C1E');
    grad.addColorStop(1, '#6F500C');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
    ctx.fill();

    // Outer Beaded Coin Rim Studs
    ctx.save();
    ctx.translate(size / 2, size / 2);
    const numBeads = 48;
    for (let i = 0; i < numBeads; i++) {
      const angle = (i * Math.PI * 2) / numBeads;
      const x = Math.cos(angle) * (size / 2 - 32);
      const y = Math.sin(angle) * (size / 2 - 32);
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#8C6514';
      ctx.shadowColor = 'rgba(0,0,0,0.4)';
      ctx.shadowBlur = 4;
      ctx.fill();
    }
    ctx.restore();

    // Double Inner Rings
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 60, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#8C6514';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 70, 0, Math.PI * 2);
    ctx.stroke();

    // Curved Text: "TALENTECHNO • ARCHITECT OF CAREERS •"
    ctx.save();
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#4A3405';
    ctx.textAlign = 'center';
    drawCurvedText(ctx, 'TALENTECHNO  •  ARCHITECT OF CAREERS  •', size / 2, size / 2, size / 2 - 110, Math.PI * 0.7);
    ctx.restore();

    // Center Sunburst / Diamond Guilloche Pattern
    ctx.save();
    ctx.translate(size / 2, size / 2);
    for (let i = 0; i < 24; i++) {
      ctx.rotate((Math.PI * 2) / 24);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 80);
      ctx.lineTo(0, size / 2 - 160);
      ctx.stroke();
    }
    ctx.restore();

    // Center Gold Medallion Inner Ring
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 190, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 245, 220, 0.4)';
    ctx.fill();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Embossed "T" Monogram Emblem
    ctx.font = '800 240px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#483307';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 8;
    ctx.fillText('T', size / 2, size / 2 + 10);

    // Golden Specular Overlay on "T"
    ctx.fillStyle = '#FFEAA7';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillText('T', size / 2 - 2, size / 2 + 6);

    // Stars on Bottom
    ctx.font = '32px sans-serif';
    ctx.fillStyle = '#8C6514';
    ctx.fillText('★   ★   ★', size / 2, size / 2 + 160);

    return new THREE.CanvasTexture(cvs);
  }

  function createBackFaceTexture() {
    const size = 1024;
    const cvs = document.createElement('canvas');
    cvs.width = size;
    cvs.height = size;
    const ctx = cvs.getContext('2d');

    // Metallic Radial Gold Base
    const grad = ctx.createRadialGradient(size / 2, size / 2, 30, size / 2, size / 2, size / 2);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#F7DC84');
    grad.addColorStop(0.65, '#D4AF37');
    grad.addColorStop(0.9, '#8C6514');
    grad.addColorStop(1, '#533B05');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
    ctx.fill();

    // Outer Decorative Ring
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 50, 0, Math.PI * 2);
    ctx.stroke();

    // Inscribed Text
    ctx.save();
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#4A3405';
    ctx.textAlign = 'center';
    drawCurvedText(ctx, 'CHOOSE RIGHT CAREER PATH  •  HYDERABAD', size / 2, size / 2, size / 2 - 95, Math.PI * 0.7);
    ctx.restore();

    // 8-Point Compass of Career Destiny
    ctx.save();
    ctx.translate(size / 2, size / 2);
    for (let i = 0; i < 8; i++) {
      ctx.rotate((Math.PI * 2) / 8);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-24, 60);
      ctx.lineTo(0, 220);
      ctx.fillStyle = i % 2 === 0 ? '#483307' : '#FFFFFF';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(24, 60);
      ctx.lineTo(0, 220);
      ctx.fillStyle = i % 2 === 0 ? '#997317' : '#E8C568';
      ctx.fill();
    }

    // Center Gold Gem Core
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#483307';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.font = '800 32px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#483307';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('2026', 0, 0);

    ctx.restore();

    return new THREE.CanvasTexture(cvs);
  }

  function createMilledRimTexture() {
    const width = 1024;
    const height = 128;
    const cvs = document.createElement('canvas');
    cvs.width = width;
    cvs.height = height;
    const ctx = cvs.getContext('2d');

    ctx.fillStyle = '#A67C1E';
    ctx.fillRect(0, 0, width, height);

    // Alternating dark & bright vertical ridges (coin milling)
    const stripeWidth = 8;
    for (let x = 0; x < width; x += stripeWidth * 2) {
      ctx.fillStyle = '#FFF2D7';
      ctx.fillRect(x, 0, stripeWidth, height);
      ctx.fillStyle = '#5A400B';
      ctx.fillRect(x + stripeWidth, 0, stripeWidth, height);
    }

    const tex = new THREE.CanvasTexture(cvs);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(4, 1);
    return tex;
  }

  function drawCurvedText(ctx, text, centerX, centerY, radius, startAngle) {
    const step = (Math.PI * 1.5) / text.length;
    let angle = startAngle;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      ctx.save();
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(char, 0, 0);
      ctx.restore();
      angle += step;
    }
  }

  // 3. Initialize Three.js Scene
  function initThreeScene() {
    const width = container.clientWidth || 440;
    const height = container.clientHeight || 440;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFBF0, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFF2D1, 2.2);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xC29B38, 1.6);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    const glintLight = new THREE.PointLight(0xFFFFFF, 1.8, 15);
    glintLight.position.set(0, 3, 5);
    scene.add(glintLight);

    // Coin Materials
    const frontTex = createFrontFaceTexture();
    const backTex = createBackFaceTexture();
    const rimTex = createMilledRimTexture();

    const rimMat = new THREE.MeshStandardMaterial({
      map: rimTex,
      metalness: 0.95,
      roughness: 0.35,
      color: 0xE8C86A
    });

    const frontMat = new THREE.MeshStandardMaterial({
      map: frontTex,
      metalness: 0.92,
      roughness: 0.22,
      bumpMap: frontTex,
      bumpScale: 0.04
    });

    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      metalness: 0.92,
      roughness: 0.22,
      bumpMap: backTex,
      bumpScale: 0.04
    });

    // Coin Cylinder: 3 Materials [Side, Top, Bottom]
    // radiusTop, radiusBottom, height, radialSegments
    const coinGeometry = new THREE.CylinderGeometry(3.3, 3.3, 0.44, 80);
    coinMesh = new THREE.Mesh(coinGeometry, [rimMat, frontMat, backMat]);

    // Initial orientation: Facing forward toward user
    coinMesh.rotation.x = Math.PI / 2;
    scene.add(coinMesh);

    // Add Sparkle Particles in the Coin's Orbit
    createParticleSparkles();

    // Start Animation Loop
    animate();

    // Window Resize Handler
    window.addEventListener('resize', onWindowResize);
  }

  function createParticleSparkles() {
    const particleCount = 45;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
      scales[i] = Math.random() * 0.8 + 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Particle Canvas Texture
    const pCvs = document.createElement('canvas');
    pCvs.width = 32;
    pCvs.height = 32;
    const pCtx = pCvs.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 248, 220, 1)');
    pGrad.addColorStop(0.4, 'rgba(212, 175, 55, 0.7)');
    pGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);

    const pTex = new THREE.CanvasTexture(pCvs);

    const pMat = new THREE.PointsMaterial({
      size: 0.28,
      map: pTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particleSystem = new THREE.Points(geometry, pMat);
    scene.add(particleSystem);
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth || 440;
    const height = container.clientHeight || 440;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // 4. Main Animation Loop with Scroll & Physics Morph
  function animate() {
    requestAnimationFrame(animate);

    idleTime += 0.015;

    if (coinMesh) {
      if (isFlipping) {
        // High-Speed 3D Vertical Toss Flip Physics
        flipProgress += 0.035;
        coinMesh.rotation.y += flipVelocity;
        coinMesh.rotation.x += flipVelocity * 0.35;
        coinMesh.position.y = Math.sin(flipProgress * Math.PI) * 1.8;
        flipVelocity *= 0.965;

        if (flipProgress >= 1 || flipVelocity < 0.01) {
          isFlipping = false;
          coinMesh.position.y = 0;
          // Land smoothly on the active path orientation
          targetRotationY = (currentPathIndex * Math.PI) + (Math.PI * 2);
        }
      } else {
        // Luxury Idle Floating Bob
        const floatBob = Math.sin(idleTime) * 0.12;
        coinMesh.position.y = floatBob;

        // Base Idle Spin + Mouse Gyro Parallax + Scroll Morph Rotation
        targetRotationY += 0.008;

        // Scroll morph: rotate the coin along X and Z as user scrolls
        const scrollTilt = (scrollProgress - 0.5) * 1.2;
        const scrollRoll = scrollProgress * Math.PI * 1.5;

        currentRotationX += (targetRotationX + (Math.PI / 2) + scrollTilt - currentRotationX) * 0.08;
        currentRotationY += (targetRotationY + scrollRoll - currentRotationY) * 0.08;

        coinMesh.rotation.x = currentRotationX;
        coinMesh.rotation.y = currentRotationY;
      }

      // Rotate particle aura
      if (particleSystem) {
        particleSystem.rotation.y += 0.003;
        particleSystem.rotation.x = Math.sin(idleTime * 0.5) * 0.1;
      }
    }

    renderer.render(scene, camera);
  }

  // 5. Flip Coin Action
  function flipCoin() {
    if (isFlipping) return;
    isFlipping = true;
    flipVelocity = 0.55 + Math.random() * 0.2;
    flipProgress = 0;

    // Pick a new career trajectory on flip!
    const nextIndex = (currentPathIndex + 1 + Math.floor(Math.random() * 2)) % CAREER_PATHS.length;
    selectCareerPath(nextIndex, true);
  }

  // 6. Interactive Career Options UI & Morphing Dossier
  function renderCareerOptions() {
    if (!optionsContainer) return;

    optionsContainer.innerHTML = CAREER_PATHS.map((path, idx) => `
      <div class="career-option-pill ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        <div class="option-icon-wrap">${path.icon}</div>
        <div class="option-text-wrap">
          <div class="option-title">${path.title}</div>
          <div class="option-sub">${path.tag} &bull; <strong style="color: var(--gold-dark);">${path.demand}</strong></div>
        </div>
        <div class="option-chevron">&rarr;</div>
      </div>
    `).join('');

    const pills = optionsContainer.querySelectorAll('.career-option-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const idx = parseInt(pill.getAttribute('data-index'), 10);
        selectCareerPath(idx, false);
      });
    });
  }

  function selectCareerPath(index, isFromFlip = false) {
    currentPathIndex = index;
    const path = CAREER_PATHS[index];

    // Update Active Option Pill
    const pills = optionsContainer.querySelectorAll('.career-option-pill');
    pills.forEach((p, idx) => {
      if (idx === index) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Morph Coin Orientation: Spin to Face This Path
    if (!isFromFlip) {
      targetRotationY += Math.PI * 2;
    }

    // Morph Ambient Stage Glow Color
    if (auraEl) {
      auraEl.style.background = `radial-gradient(circle, ${path.glow} 0%, transparent 70%)`;
    }

    // Morph Dynamic Dossier Card
    updateDossierCard(path);

    // Show Notification Toast
    showGoldToast(`Career Coin Oriented: ${path.title}`);
  }

  function updateDossierCard(path) {
    if (!dossierEl) return;

    dossierEl.style.opacity = '0';
    dossierEl.style.transform = 'translateY(12px) scale(0.98)';

    setTimeout(() => {
      dossierEl.innerHTML = `
        <div class="dossier-header">
          <div class="dossier-badge" style="background: rgba(212, 175, 55, 0.12); color: var(--gold-dark); border: 1px solid var(--border-gold);">
            ${path.icon} ${path.tag}
          </div>
          <span class="dossier-verified">⚡ LIVE MARKET TRAJECTORY</span>
        </div>

        <h3 class="dossier-title">${path.title}</h3>
        <p class="dossier-desc">${path.description}</p>

        <div class="dossier-metrics-grid">
          <div class="dossier-metric-item">
            <span class="dm-label">Compensation Bracket</span>
            <span class="dm-value text-gold-shine" style="font-size: 19px;">${path.package}</span>
          </div>
          <div class="dossier-metric-item">
            <span class="dm-label">Hiring Velocity</span>
            <span class="dm-value" style="color: #10B981; font-size: 16px;">${path.demand}</span>
          </div>
        </div>

        <div style="margin-bottom: 22px;">
          <div style="font-size: 12px; font-weight: 750; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); margin-bottom: 10px;">
            Target Tech Stack & Competencies
          </div>
          <div class="dossier-stack-wrap">
            ${path.stack.map(s => `<span class="stack-badge">${s}</span>`).join('')}
          </div>
        </div>

        <div class="dossier-action-buttons">
          <button class="btn-gold dossier-cta" data-action="candidate" data-role="${path.roleInquiry}">
            <span>Match My Career Profile</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button class="btn-gold-outline dossier-cta" data-action="employer" data-role="${path.roleInquiry}">
            <span>Hire in This Discipline</span>
          </button>
        </div>
      `;

      // Bind Fast Form Intake Links
      dossierEl.querySelectorAll('.dossier-cta').forEach(btn => {
        btn.addEventListener('click', () => {
          const role = btn.getAttribute('data-role');
          const roleInput = document.getElementById('lead-role');
          const messageInput = document.getElementById('lead-message');
          const form = document.querySelector('form.lead-form');

          if (roleInput) roleInput.value = role;
          if (messageInput) {
            messageInput.value = `Hi Talentechno Team, I am interested in connecting regarding the ${role} trajectory.`;
          }

          if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (roleInput) {
              roleInput.focus();
              roleInput.style.borderColor = 'var(--gold-accent)';
            }
          }
        });
      });

      dossierEl.style.opacity = '1';
      dossierEl.style.transform = 'translateY(0) scale(1)';
    }, 180);
  }

  // 7. Parallax Mouse Gyro & Scroll Tracking
  function initScrollAndInteraction() {
    if (container) {
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        targetRotationX = -y * 0.65;
        targetRotationY += x * 0.04;
      });

      container.addEventListener('mouseleave', () => {
        targetRotationX = 0;
      });

      // Click to Flip directly on canvas
      canvas.addEventListener('click', flipCoin);
    }

    if (flipBtn) {
      flipBtn.addEventListener('click', flipCoin);
    }

    // Scroll Progress Calculation for Linking 3D Morph
    window.addEventListener('scroll', () => {
      const section = document.getElementById('career-coin-section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        scrollProgress = 1 - (rect.bottom / (windowHeight + rect.height));
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));
      }
    }, { passive: true });
  }

  function showGoldToast(message) {
    if (window.showGoldToast) {
      window.showGoldToast(message);
    }
  }

})();
