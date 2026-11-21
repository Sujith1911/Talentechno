const fs = require('fs');
const path = require('path');
const realtimeManager = require('../services/realtimeManager');

const DECOY_ROUTES = [
  '/admin',
  '/admin/login',
  '/admin/default',
  '/admin/index.php',
  '/administrator',
  '/administrator/index.php',
  '/wp-admin',
  '/wp-login.php',
  '/login',
  '/login.php',
  '/backend',
  '/dashboard',
  '/cpanel',
  '/panel',
  '/phpmyadmin',
  '/user/login'
];

class ScannerShield {
  constructor() {
    this.logFile = path.join(__dirname, '..', '..', 'data', 'scanner_probes.json');
    this.probes = this.loadProbes();
  }

  loadProbes() {
    if (fs.existsSync(this.logFile)) {
      try {
        return JSON.parse(fs.readFileSync(this.logFile, 'utf-8'));
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  saveProbe(probe) {
    this.probes.unshift(probe);
    if (this.probes.length > 200) {
      this.probes = this.probes.slice(0, 200);
    }
    try {
      fs.writeFileSync(this.logFile, JSON.stringify(this.probes, null, 2), 'utf-8');
    } catch (e) {
      console.error('[Shield] Failed to save probe log:', e.message);
    }
  }

  getRecentProbes() {
    return this.probes;
  }

  // Middleware handler
  handle(req, res, next) {
    // 1. Cloak Server Identification Headers
    res.removeHeader('X-Powered-By');
    res.setHeader('Server', 'nginx'); // Disguise as standard static web server

    const currentPath = req.path.toLowerCase();

    // 2. Detect Scanner Probing Decoys (excluding internal /api/ routes)
    const isDecoy = DECOY_ROUTES.some(decoy => (currentPath === decoy || currentPath.startsWith(decoy + '/')) && !currentPath.startsWith('/api/'));

    if (isDecoy) {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Unknown';
      
      const probeRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        path: req.path,
        ip: clientIp,
        userAgent: userAgent,
        actionTaken: 'TARPIT_DELAY_404',
        type: userAgent.toLowerCase().includes('gobuster') ? 'GOBUSTER_DETECTED' : 'DIRECTORY_BRUTEFORCE'
      };

      console.warn(`🛡️ [SCANNER SHIELD] Blocked scanner probe from ${clientIp} targeting "${req.path}" (${userAgent})`);

      this.saveProbe(probeRecord);
      realtimeManager.notifyScannerAlert(probeRecord);

      // Tarpit delay to throttle automated scanning tools like Gobuster
      const tarpitDelay = parseInt(process.env.TARPIT_DELAY_MS || '1200', 10);
      return setTimeout(() => {
        res.status(404).send(`<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>404 Not Found</title>
</head><body>
<h1>Not Found</h1>
<p>The requested URL was not found on this server.</p>
<hr>
<address>Apache/2.4.52 (Ubuntu) Server at localhost Port 80</address>
</body></html>`);
      }, tarpitDelay);
    }

    next();
  }
}

module.exports = new ScannerShield();
