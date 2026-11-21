const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

  saveVideos(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('[VideoManager] Error saving videos:', e.message);
      return false;
    }
  }

  extractYouTubeId(url) {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  }

  addVideo(payload) {
    const list = this.getVideos();
    const ytId = this.extractYouTubeId(payload.youtube_url || payload.youtube_id);
    const video = {
      id: 'vid-' + crypto.randomUUID().slice(0, 8),
      title: payload.title || 'Client Success Story',
      client_name: payload.client_name || 'Anonymous Leader',
      client_role: payload.client_role || 'Executive',
      company: payload.company || 'Tech Enterprise',
      youtube_id: ytId,
      youtube_url: payload.youtube_url || `https://www.youtube.com/watch?v=${ytId}`,
      thumbnail: payload.thumbnail || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'),
      quote: payload.quote || 'Outstanding technical recruitment partnership.',
      rating: parseInt(payload.rating || 5, 10),
      created_at: new Date().toISOString()
    };
    list.unshift(video);
    this.saveVideos(list);
    return video;
  }

  updateVideo(id, updates) {
    const list = this.getVideos();
    const index = list.findIndex(v => v.id === id);
    if (index === -1) return null;

    if (updates.youtube_url) {
      updates.youtube_id = this.extractYouTubeId(updates.youtube_url);
    }

    list[index] = { ...list[index], ...updates, updated_at: new Date().toISOString() };
    this.saveVideos(list);
    return list[index];
  }

  deleteVideo(id) {
    const list = this.getVideos();
    const filtered = list.filter(v => v.id !== id);
    if (filtered.length === list.length) return false;
    this.saveVideos(filtered);
    return true;
  }
}

module.exports = new VideoReviewManager();
