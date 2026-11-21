// Server-Sent Events (SSE) Real-Time Manager for Talentechno Admin Panel

class RealtimeManager {
  constructor() {
    this.clients = new Set();
  }

  // Register an SSE client
  addClient(res) {
    this.clients.add(res);
    console.log(`📡 [Realtime] Admin client connected. Total live streams: ${this.clients.size}`);

    // Send initial handshake ping
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Realtime stream active', timestamp: new Date().toISOString() })}\n\n`);

    // Clean up when client disconnects
    res.on('close', () => {
      this.clients.delete(res);
      console.log(`📡 [Realtime] Admin client disconnected. Remaining streams: ${this.clients.size}`);
    });
  }

  // Broadcast event to all active admin panels
  broadcast(eventType, payload) {
    if (this.clients.size === 0) return;

    const message = JSON.stringify({
      type: eventType,
      payload,
      timestamp: new Date().toISOString()
    });

    for (const client of this.clients) {
      try {
        client.write(`data: ${message}\n\n`);
      } catch (err) {
        console.error('[Realtime] Failed to write to client:', err.message);
        this.clients.delete(client);
      }
    }
  }

  // Convenience methods
  notifyNewSubmission(submission) {
    this.broadcast('NEW_SUBMISSION', submission);
  }

  notifyUpdateSubmission(submission) {
    this.broadcast('UPDATE_SUBMISSION', submission);
  }

  notifyDeleteSubmission(id) {
    this.broadcast('DELETE_SUBMISSION', { id });
  }

  notifyScannerAlert(alert) {
    this.broadcast('SCANNER_ALERT', alert);
  }
}

module.exports = new RealtimeManager();
