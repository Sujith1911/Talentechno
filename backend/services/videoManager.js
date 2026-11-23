const fs = require('fs');
const path = require('path');

class VideoReviewManager {
  constructor() {
    this.filePath = path.join(__dirname, '..', '..', 'data', 'videos.json');
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  getVideos() {
    try {
      this.ensureFile();
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('[VideoManager] Error reading videos:', e.message);
      return [];
    }
  }
}

module.exports = new VideoReviewManager();
