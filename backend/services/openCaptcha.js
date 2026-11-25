const crypto = require('crypto');

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || 'talentechno_open_captcha_secret_2026';
const EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Open-Source Visual Anti-Bot CAPTCHA Service
 * Generates lightweight, accessible SVG challenges with cryptographic HMAC validation.
 * Zero external tracking, zero third-party dependencies, works offline.
 */

function generateCaptcha() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let text = '';
  for (let i = 0; i < 5; i++) {
    text += chars[Math.floor(Math.random() * chars.length)];
  }

  const timestamp = Date.now();
  const signature = crypto
    .createHmac('sha256', CAPTCHA_SECRET)
    .update(text.toUpperCase() + ':' + timestamp)
    .digest('hex');

  const token = `${signature}.${timestamp}`;

  // Build high-contrast, beautiful SVG challenge with subtle security noise
  let noiseLines = '';
  for (let i = 0; i < 4; i++) {
    const x1 = Math.floor(Math.random() * 150);
    const y1 = Math.floor(Math.random() * 44);
    const x2 = Math.floor(Math.random() * 150);
    const y2 = Math.floor(Math.random() * 44);
    noiseLines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(168,85,247,0.35)" stroke-width="1.2" />`;
  }

  let textNodes = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const x = 18 + i * 25;
    const y = 30 + (Math.random() * 5 - 2.5);
    const rot = (Math.random() * 20 - 10).toFixed(1);
    const color = i % 2 === 0 ? '#FFFFFF' : '#E9D5FF';
    textNodes += `<text x="${x}" y="${y.toFixed(1)}" font-family="'Space Grotesk', monospace" font-size="24" font-weight="800" letter-spacing="2" fill="${color}" transform="rotate(${rot} ${x} ${y.toFixed(1)})">${ch}</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="46" viewBox="0 0 160 46" style="background:rgba(15,8,25,0.85);border-radius:10px;border:1px solid rgba(255,255,255,0.18);">${noiseLines}${textNodes}</svg>`;
  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  return {
    token,
    image: svgDataUrl
  };
}

function verifyCaptcha(token, rawAnswer) {
  if (!token || !rawAnswer) return false;

  const parts = String(token).split('.');
  if (parts.length !== 2) return false;

  const [receivedSig, timestampStr] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check expiration (10 min)
  if (Date.now() - timestamp > EXPIRY_MS) {
    return false;
  }

  const cleanAnswer = String(rawAnswer).trim().toUpperCase();
  const expectedSig = crypto
    .createHmac('sha256', CAPTCHA_SECRET)
    .update(cleanAnswer + ':' + timestamp)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig));
  } catch (e) {
    return false;
  }
}

module.exports = {
  generateCaptcha,
  verifyCaptcha
};
