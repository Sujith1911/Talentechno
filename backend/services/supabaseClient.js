const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

class SubmissionsDatabase {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    this.isSupabaseConfigured = Boolean(this.supabaseUrl && this.supabaseKey && this.supabaseUrl.includes('supabase.co'));
    
    this.localFilePath = path.join(__dirname, '..', '..', 'data', 'submissions.json');
    this.ensureLocalFile();

    if (this.isSupabaseConfigured) {
      console.log('⚡ [DB] Initializing Supabase client at:', this.supabaseUrl);
      this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
        auth: { persistSession: false }
      });
    } else {
      console.log('ℹ️  [DB] Supabase credentials not set in .env. Running on local resilient JSON storage (data/submissions.json)');
    }
  }

  ensureLocalFile() {
    if (!fs.existsSync(this.localFilePath)) {
      fs.writeFileSync(this.localFilePath, JSON.stringify([], null, 2), 'utf-8');
    }
  }

  readLocal() {
    this.ensureLocalFile();
    try {
      const data = fs.readFileSync(this.localFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('[DB] Error reading local submissions:', err);
      return [];
    }
  }

  writeLocal(data) {
    try {
      fs.writeFileSync(this.localFilePath, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err) {
      console.error('[DB] Error writing local submissions:', err);
      return false;
    }
  }

  // Save new contact inquiry (Public Form)
  async createSubmission(payload) {
    const item = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      first_name: payload.first_name || '',
      last_name: payload.last_name || '',
      email: payload.email || '',
      phone: payload.phone || '',
      service: payload.service || 'recruitment',
      target_role: payload.target_role || '',
      message: payload.message || '',
      status: 'new',
      ip_address: payload.ip_address || 'unknown',
      user_agent: payload.user_agent || '',
      source: payload.source || 'website'
    };

    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase
          .from('contact_submissions')
          .insert([item])
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[DB-Supabase] Insert error, saving to local backup:', err.message);
      }
    }

    // Local storage fallback
    const list = this.readLocal();
    list.unshift(item);
    this.writeLocal(list);
    return item;
  }
}

module.exports = new SubmissionsDatabase();
