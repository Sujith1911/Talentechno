import re

with open('assets/images/hand_vector_path.txt', 'r', encoding='utf-8') as f:
    vector_path_d = f.read().strip()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add progress bar under hud-stepper-row if not present
if 'hud-progress-track' not in html:
    stepper_target = '''            <!-- Manual Stepper Navigation Arrows -->
            <div class="hud-stepper-row">
              <button type="button" class="hud-step-btn btn-prev" aria-label="Previous Projected Card" title="Previous Card">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                <span>Previous</span>
              </button>
              <div class="hud-step-counter"><span id="hud-current-step">1</span> of 7</div>
              <button type="button" class="hud-step-btn btn-next" aria-label="Next Projected Card" title="Next Card">
                <span>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>'''
    stepper_replacement = stepper_target + '''\n            <!-- Continuous Dynamic Holographic Progress Track -->
            <div class="hud-progress-track" aria-hidden="true">
              <div class="hud-progress-fill" id="hud-progress-bar"></div>
            </div>'''
    html = html.replace(stepper_target, stepper_replacement)

# 2. Replace the SVG inside procedural-8k-hand-container
svg_replacement = f'''          <!-- Bottom Stage: 8K PROCEDURAL VECTOR CYBERNETIC HAND SVG (Mathematically Sharp & Perfectly Proportioned) -->
          <div class="procedural-8k-hand-container" aria-hidden="true">
            <svg class="cyber-hand-8k-svg" viewBox="0 0 1000 480" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- 8K Crisp Neon Filter -->
                <filter id="handNeonGlow8k" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur1" />
                  <feGaussianBlur stdDeviation="7" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="verticalProjectorBeam" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stop-color="var(--accent-glow)" stop-opacity="0.85" />
                  <stop offset="35%" stop-color="var(--accent-primary)" stop-opacity="0.4" />
                  <stop offset="85%" stop-color="var(--accent-primary)" stop-opacity="0.06" />
                  <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0" />
                </linearGradient>
                <radialGradient id="emitterCoreRadial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
                  <stop offset="30%" stop-color="var(--accent-glow)" stop-opacity="0.9" />
                  <stop offset="70%" stop-color="var(--accent-primary)" stop-opacity="0.4" />
                  <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0" />
                </radialGradient>
              </defs>

              <!-- Layer 1: Holographic Projector Emitter Beams (Rising from Palm at x=500, y=230 up to bottom of card) -->
              <g class="hologram-emitter-rays">
                <!-- Light Cone Fan Shroud -->
                <polygon points="500,230 320,0 680,0" fill="url(#verticalProjectorBeam)" opacity="0.16" />
                <polygon points="500,230 410,0 590,0" fill="url(#verticalProjectorBeam)" opacity="0.25" />
                <!-- High-Luminance Central Beams -->
                <line x1="500" y1="230" x2="500" y2="0" stroke="url(#verticalProjectorBeam)" stroke-width="3" filter="url(#handNeonGlow8k)" />
                <line x1="500" y1="230" x2="430" y2="0" stroke="url(#verticalProjectorBeam)" stroke-width="1.6" stroke-dasharray="7 5" opacity="0.7" />
                <line x1="500" y1="230" x2="570" y2="0" stroke="url(#verticalProjectorBeam)" stroke-width="1.6" stroke-dasharray="7 5" opacity="0.7" />
                <line x1="500" y1="230" x2="360" y2="0" stroke="url(#verticalProjectorBeam)" stroke-width="1.2" stroke-dasharray="5 5" opacity="0.5" />
                <line x1="500" y1="230" x2="640" y2="0" stroke="url(#verticalProjectorBeam)" stroke-width="1.2" stroke-dasharray="5 5" opacity="0.5" />
              </g>

              <!-- Layer 2: 8K Exact Cybernetic Vector Hand (Mathematically Smooth Catmull-Rom Bezier Splines) -->
              <path class="hand-vector-neon" d="{vector_path_d}" fill-rule="evenodd" />

              <!-- Layer 3: Central Palm Holographic Emitter Core (Pulsing at x=500, y=230) -->
              <g class="palm-central-emitter">
                <circle cx="500" cy="230" r="44" stroke="var(--accent-primary)" stroke-width="1.2" stroke-dasharray="12 6" opacity="0.6" class="gyro-ring-1" />
                <circle cx="500" cy="230" r="28" stroke="var(--accent-glow)" stroke-width="1.6" stroke-dasharray="6 3" opacity="0.85" class="gyro-ring-2" />
                <circle cx="500" cy="230" r="18" fill="url(#emitterCoreRadial)" />
                <circle cx="500" cy="230" r="10" fill="#FFFFFF" opacity="0.95" filter="url(#handNeonGlow8k)" />
                <circle cx="500" cy="230" r="4" fill="var(--accent-glow)" />
              </g>
            </svg>
          </div>'''

# Regex replace the procedural-8k-hand-container
old_container_pattern = r'<!-- Bottom Stage: 8K PROCEDURAL VECTOR CYBERNETIC HAND SVG.*?<div class="procedural-8k-hand-container".*?</svg>\s*</div>'
html = re.sub(old_container_pattern, svg_replacement, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html successfully with the smooth 8K Catmull-Rom Bezier cybernetic hand!")
