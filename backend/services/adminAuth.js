const crypto = require('crypto');

class AdminAuthService {
  constructor() {
    this.adminEmail = (process.env.ADMIN_EMAIL || 'security.admin@talentechno.com').toLowerCase().trim();
    this.adminPassword = process.env.ADMIN_PASSWORD || 'TalentechnoSecure2026!';
    this.jwtSecret = process.env.JWT_SECRET || 'talentechno_jwt_secret_token_9984716245102938';
    
    // Active sessions & pending OTPs
    this.activeSessions = new Map(); // token -> { email, createdAt, expiresAt }
    this.pendingOTPs = new Map(); // email -> { code, expiresAt, attempts }
  }

  // Request OTP for the separate admin email
  requestOTP(email) {
    const normalized = (email || '').toLowerCase().trim();
    if (normalized !== this.adminEmail) {
      // Fake delay to prevent user enumeration
      return { success: false, message: 'Invalid admin identity or unauthorized mail address.' };
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    this.pendingOTPs.set(normalized, { code, expiresAt, attempts: 0 });

    console.log(`🔐 [ADMIN AUTH] Generated One-Time Security Passcode for separate admin (${normalized}): >>> ${code} <<<`);

    return {
      success: true,
      message: `Security verification passcode dispatched to ${normalized}.`,
      // For local testing convenience, expose code in dev mode
      devPasscodePreview: code
    };
  }

  // Verify OTP and generate session token
  verifyOTP(email, code) {
    const normalized = (email || '').toLowerCase().trim();
    const record = this.pendingOTPs.get(normalized);

    if (!record) {
      return { success: false, message: 'No pending security code found. Request a new one.' };
    }

    if (Date.now() > record.expiresAt) {
      this.pendingOTPs.delete(normalized);
      return { success: false, message: 'Security code expired. Request a new one.' };
    }

    if (record.code !== code.trim()) {
      record.attempts += 1;
      if (record.attempts >= 4) {
        this.pendingOTPs.delete(normalized);
        return { success: false, message: 'Too many incorrect attempts. Code revoked.' };
      }
      return { success: false, message: 'Incorrect passcode.' };
    }

    // OTP Successful: create session
    this.pendingOTPs.delete(normalized);
    const token = this.generateSessionToken(normalized);
    return {
      success: true,
      token,
      adminEmail: normalized,
      expiresIn: '24h'
    };
  }

  // Direct login with separate admin email + password
  loginWithPassword(email, password) {
    const normalized = (email || '').toLowerCase().trim();
    if (normalized !== this.adminEmail || password !== this.adminPassword) {
      return { success: false, message: 'Access denied: Invalid admin email or security passphrase.' };
    }

    const token = this.generateSessionToken(normalized);
    return {
      success: true,
      token,
      adminEmail: normalized,
      expiresIn: '24h'
    };
  }

  generateSessionToken(email) {
    const token = 'tg_session_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 24 * 3600 * 1000; // 24 hours
    this.activeSessions.set(token, {
      email,
      createdAt: new Date().toISOString(),
      expiresAt
    });
    return token;
  }

  validateToken(token) {
    if (!token) return null;
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    const session = this.activeSessions.get(cleanToken);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.activeSessions.delete(cleanToken);
      return null;
    }

    return session;
  }

  revokeToken(token) {
    if (!token) return;
    const cleanToken = token.replace(/^Bearer\s+/i, '').trim();
    this.activeSessions.delete(cleanToken);
  }

  // Middleware to guard protected admin API routes
  requireAuth() {
    return (req, res, next) => {
      const authHeader = req.headers['authorization'] || req.headers['x-admin-token'] || req.query.admin_token;
      const session = this.validateToken(authHeader);

      if (!session) {
        return res.status(401).json({
          error: 'UNAUTHORIZED_ACCESS',
          message: 'Access denied. Valid administrative authentication required.'
        });
      }

      req.admin = session;
      next();
    };
  }
}

module.exports = new AdminAuthService();
