require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const db = require('./services/supabaseClient');
const r2 = require('./services/cloudflareR2Client');
const videos = require('./services/videoManager');
const captcha = require('./services/openCaptcha');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Basic Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Static Assets Serving
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use('/assets/uploads', express.static(path.join(__dirname, '..', 'assets', 'uploads')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));

// ==============================================================================
// PUBLIC API: OPEN-SOURCE VISUAL CAPTCHA GENERATION
// ==============================================================================
app.get('/api/captcha', (req, res) => {
  try {
    const challenge = captcha.generateCaptcha();
    return res.json({
      success: true,
      token: challenge.token,
      image: challenge.image
    });
  } catch (err) {
    console.error('Error generating captcha:', err);
    return res.status(500).json({ success: false, error: 'CAPTCHA_GENERATION_FAILED' });
  }
});

// ==============================================================================
// PUBLIC API: CONTACT FORM & RECRUITMENT INQUIRY SUBMISSIONS
// ==============================================================================
app.post('/api/submissions', async (req, res) => {
  try {
    let { first_name, last_name, name, email, phone, service, target_role, message, company, captcha_token, captcha_answer } = req.body;

    // Verify Open-Source CAPTCHA if provided
    if (captcha_token || captcha_answer) {
      const isValidCaptcha = captcha.verifyCaptcha(captcha_token, captcha_answer);
      if (!isValidCaptcha) {
        return res.status(400).json({
          success: false,
          error: 'CAPTCHA_INVALID',
          message: 'Security verification failed. Please enter the correct CAPTCHA code.'
        });
      }
    }

    if (!first_name && name) {
      const parts = String(name).trim().split(/\s+/);
      first_name = parts[0] || 'Client';
      last_name = parts.slice(1).join(' ') || '';
    }

    if (!first_name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Name, Email, and Phone number are required fields.'
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
// VIDEO REVIEWS & YOUTUBE SHOWCASE API (Public read)
// ==============================================================================
app.get('/api/videos', (req, res) => {
  const list = videos.getVideos();
  return res.json({ success: true, count: list.length, videos: list });
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
// PUBLIC MULTI-PAGE WEBSITE ROUTES
// ==============================================================================
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

// 3. Start Server
app.listen(PORT, () => {
  console.log(`\n==================================================================`);
  console.log(`⚡ TALENTECHNO WEB SERVER ACTIVE`);
  console.log(`==================================================================`);
  console.log(`🌐 Public Website:      http://localhost:${PORT}/`);
  console.log(`📩 Contact Form API:    POST http://localhost:${PORT}/api/submissions`);
  console.log(`🎥 Videos API:          GET http://localhost:${PORT}/api/videos`);
  console.log(`🖼️ Media Showcase API:  GET http://localhost:${PORT}/api/media/showcase`);
  console.log(`💾 Database Mode:       ${process.env.SUPABASE_URL ? 'Supabase (' + process.env.SUPABASE_URL + ')' : 'Local Resilient DB (data/submissions.json)'}`);
  console.log(`☁️ Storage Mode:        ${process.env.CLOUDFLARE_R2_ACCOUNT_ID ? 'Cloudflare R2 (' + process.env.CLOUDFLARE_R2_BUCKET_NAME + ')' : 'Local Media (assets/uploads)'}`);
  console.log(`==================================================================\n`);
});
