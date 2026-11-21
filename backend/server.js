require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const db = require('./services/supabaseClient');
const r2 = require('./services/cloudflareR2Client');
const realtime = require('./services/realtimeManager');
const auth = require('./services/adminAuth');
const scannerShield = require('./middleware/scannerShield');
const videos = require('./services/videoManager');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_SECRET_ROUTE = process.env.ADMIN_SECRET_ROUTE || '/_tg_gate_7a92b';

// 1. Basic Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Anti-Gobuster Scanner Shield & Honeypot Middleware
app.use((req, res, next) => scannerShield.handle(req, res, next));

// 3. Static Assets Serving
app.use('/assets/uploads', express.static(path.join(__dirname, '..', 'assets', 'uploads')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));

// Multer memory upload for Cloudflare R2
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPG, WEBP, SVG, GIF, AVIF) are permitted.'), false);
    }
  }
});

// ==============================================================================
// PUBLIC API: CONTACT FORM & RECRUITMENT INQUIRY SUBMISSIONS
// ==============================================================================
app.post('/api/submissions', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, service, target_role, message } = req.body;

    if (!first_name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'First Name, Email, and Phone number are required fields.'
      });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    // Save to Supabase (with automatic local resilient fallback)
    const newSubmission = await db.createSubmission({
      first_name,
      last_name,
      email,
      phone,
      service,
      target_role,
      message,
      ip_address: clientIp,
      user_agent: userAgent,
      source: req.body.source || 'website_portal'
    });

    console.log(`📩 [LEAD] New inquiry from ${first_name} (${email}) for ${service || 'General'}`);

    // Real-Time Broadcast to Connected Admin Panels via SSE
    realtime.notifyNewSubmission(newSubmission);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your hiring inquiry has been received by Talentechno.',
      submissionId: newSubmission.id
    });
  } catch (err) {
    console.error('Error handling submission:', err);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to process inquiry. Please try again or WhatsApp us at +91 9030888469.'
    });
  }
});

// ==============================================================================
// REAL-TIME SERVER-SENT EVENTS (SSE) STREAM FOR ADMIN
// ==============================================================================
app.get('/api/realtime/stream', (req, res) => {
  // Validate token from query or header
  const token = req.query.token || req.headers['authorization'];
  const session = auth.validateToken(token);

  if (!session) {
    return res.status(401).send('Unauthorized real-time stream access.');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  realtime.addClient(res);
});

// ==============================================================================
// SEPARATE ADMIN EMAIL AUTHENTICATION
// ==============================================================================

// 1. Request OTP to separate admin email
app.post('/api/auth/request-otp', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Admin email address required.' });
  }

  const result = auth.requestOTP(email);
  return res.json(result);
});

// 2. Verify OTP & issue session
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email and 6-digit code are required.' });
  }

  const result = auth.verifyOTP(email, code);
  if (!result.success) {
    return res.status(401).json(result);
  }
  return res.json(result);
});

// 3. Direct login with separate admin email + password
app.post('/api/auth/login-password', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and passphrase required.' });
  }

  const result = auth.loginWithPassword(email, password);
  if (!result.success) {
    return res.status(401).json(result);
  }
  return res.json(result);
});

// 4. Verify Session
app.get('/api/auth/me', auth.requireAuth(), (req, res) => {
  return res.json({
    authenticated: true,
    adminEmail: req.admin.email,
    expiresAt: req.admin.expiresAt
  });
});

// 5. Logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers['authorization'];
  if (token) auth.revokeToken(token);
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ==============================================================================
// PROTECTED ADMIN CRUD API: CONTACT SUBMISSIONS (SUPABASE / DB)
// ==============================================================================

// List submissions with filter, search, pagination
app.get('/api/admin/submissions', auth.requireAuth(), async (req, res) => {
  try {
    const result = await db.getSubmissions(req.query);
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get single submission
app.get('/api/admin/submissions/:id', auth.requireAuth(), async (req, res) => {
  try {
    const item = await db.getSubmissionById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    return res.json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Manual create submission by Admin
app.post('/api/admin/submissions', auth.requireAuth(), async (req, res) => {
  try {
    const item = await db.createSubmission(req.body);
    realtime.notifyNewSubmission(item);
    return res.status(201).json({ success: true, item });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Update submission (status, priority, recruiter, internal notes)
app.patch('/api/admin/submissions/:id', auth.requireAuth(), async (req, res) => {
  try {
    const updated = await db.updateSubmission(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }
    realtime.notifyUpdateSubmission(updated);
    return res.json({ success: true, item: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Delete submission
app.delete('/api/admin/submissions/:id', auth.requireAuth(), async (req, res) => {
  try {
    const success = await db.deleteSubmission(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Submission not found or already deleted' });
    }
    realtime.notifyDeleteSubmission(req.params.id);
    return res.json({ success: true, message: 'Submission deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin KPIs Overview
app.get('/api/admin/stats', auth.requireAuth(), async (req, res) => {
  try {
    const stats = await db.getStats();
    return res.json({ success: true, stats });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ==============================================================================
// PROTECTED ADMIN CRUD API: CLOUDFLARE R2 MEDIA VAULT
// ==============================================================================

// Upload image to Cloudflare R2
app.post('/api/admin/r2/upload', auth.requireAuth(), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const result = await r2.uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    return res.status(201).json(result);
  } catch (err) {
    console.error('[R2 API Upload Error]:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// List images in Cloudflare R2
app.get('/api/admin/r2/files', auth.requireAuth(), async (req, res) => {
  try {
    const result = await r2.listImages();
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Delete image from Cloudflare R2
app.delete('/api/admin/r2/files/:key', auth.requireAuth(), async (req, res) => {
  try {
    const result = await r2.deleteImage(req.params.key);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ==============================================================================
// SECURITY RADAR: VIEW BLOCKED SCANNER & GOBUSTER PROBES
// ==============================================================================
app.get('/api/admin/security/scanners', auth.requireAuth(), (req, res) => {
  const probes = scannerShield.getRecentProbes();
  return res.json({
    success: true,
    totalBlocked: probes.length,
    activeHoneypotRoutes: [
      '/admin', '/administrator', '/wp-admin', '/wp-login.php', '/login', '/dashboard', '/cpanel'
    ],
    probes
  });
});

// ==============================================================================
// VIDEO REVIEWS & YOUTUBE SHOWCASE API (CRUD)
// ==============================================================================
// Public: List review videos
app.get('/api/videos', (req, res) => {
  const list = videos.getVideos();
  return res.json({ success: true, count: list.length, videos: list });
});

// Admin: Add new review video
app.post('/api/admin/videos', auth.requireAuth(), (req, res) => {
  try {
    const video = videos.addVideo(req.body);
    realtime.broadcast('NEW_VIDEO', video);
    return res.status(201).json({ success: true, video });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Update review video
app.patch('/api/admin/videos/:id', auth.requireAuth(), (req, res) => {
  try {
    const updated = videos.updateVideo(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Video not found' });
    realtime.broadcast('UPDATE_VIDEO', updated);
    return res.json({ success: true, video: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: Delete review video
app.delete('/api/admin/videos/:id', auth.requireAuth(), (req, res) => {
  try {
    const success = videos.deleteVideo(req.params.id);
    if (!success) return res.status(404).json({ success: false, message: 'Video not found' });
    realtime.broadcast('DELETE_VIDEO', { id: req.params.id });
    return res.json({ success: true, message: 'Video deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ==============================================================================
// DYNAMIC MEDIA SHOWCASE API (Public read for frontend image holders)
// ==============================================================================
app.get('/api/media/showcase', async (req, res) => {
  try {
    const r2Result = await r2.listImages();
    return res.json({ success: true, files: r2Result.files || [] });
  } catch (err) {
    return res.status(500).json({ success: false, files: [] });
  }
});

// ==============================================================================
// SECRET ADMIN PANEL ENTRYPOINT (HIDDEN FROM GOBUSTER / SCANNERS)
// ==============================================================================
app.get(ADMIN_SECRET_ROUTE, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin-ui', 'index.html'));
});

// Public Website Multi-Page Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'about.html'));
});
app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'services.html'));
});
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'contact.html'));
});

// 4. Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================================`);
  console.log(`⚡ TALENTECHNO BACKEND API & ADMIN PORTAL ACTIVE`);
  console.log(`==================================================================`);
  console.log(`🌐 Public Website:      http://localhost:${PORT}/`);
  console.log(`📩 Contact Form API:    POST http://localhost:${PORT}/api/submissions`);
  console.log(`🕵️‍♂️ Scanner Honeypot:   Active (Decoys: /admin, /wp-admin, /login)`);
  console.log(`🔒 Secret Admin Gate:   http://localhost:${PORT}${ADMIN_SECRET_ROUTE}`);
  console.log(`🔑 Separate Admin Mail: ${process.env.ADMIN_EMAIL || 'security.admin@talentechno.com'}`);
  console.log(`💾 Database Mode:       ${process.env.SUPABASE_URL ? 'Supabase (' + process.env.SUPABASE_URL + ')' : 'Local Resilient DB (data/submissions.json)'}`);
  console.log(`☁️ Storage Mode:        ${process.env.CLOUDFLARE_R2_ACCOUNT_ID ? 'Cloudflare R2 (' + process.env.CLOUDFLARE_R2_BUCKET_NAME + ')' : 'Local Media (assets/uploads)'}`);
  console.log(`==================================================================\n`);
});
