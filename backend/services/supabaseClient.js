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
      const initialData = [
        {
          id: crypto.randomUUID(),
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          first_name: "Kavitha",
          last_name: "Reddy",
          email: "kavitha.reddy@techcorp.in",
          phone: "+91 98480 12345",
          service: "recruitment",
          target_role: "Senior Cloud Architect (AWS/GCP)",
          message: "We need 3 senior cloud architects for our migration project starting next month. Looking forward to discussing shortlist.",
          status: "new",
          priority: "high",
          assigned_recruiter: "Senior Tech Recruiter",
          internal_notes: "High priority client inquiry. Hyderabad based.",
          is_starred: true,
          ip_address: "103.211.54.12",
          source: "website_landing"
        },
        {
          id: crypto.randomUUID(),
          created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
          updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          first_name: "Siddharth",
          last_name: "Varma",
          email: "siddharth@innovatesoft.com",
          phone: "+91 99887 66554",
          service: "talent-management",
          target_role: "Full-Stack Development Team (5 Engineers)",
          message: "Looking for complete talent management and upskilling for our React & Node.js teams.",
          status: "contacted",
          priority: "medium",
          assigned_recruiter: "HR Consultant Lead",
          internal_notes: "Initial consultation call completed. Proposal shared.",
          is_starred: false,
          ip_address: "49.205.112.44",
          source: "consultation_modal"
        }
      ];
      fs.writeFileSync(this.localFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
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

  // --- CRUD: CREATE ---
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
      priority: payload.priority || 'medium',
      assigned_recruiter: null,
      internal_notes: '',
      is_starred: false,
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

  // --- CRUD: READ (ALL WITH FILTERS & SEARCH) ---
  async getSubmissions(query = {}) {
    const { status, search, priority, page = 1, limit = 50 } = query;

    if (this.isSupabaseConfigured) {
      try {
        let q = this.supabase
          .from('contact_submissions')
          .select('*', { count: 'exact' });

        if (status && status !== 'all') {
          q = q.eq('status', status);
        }
        if (priority && priority !== 'all') {
          q = q.eq('priority', priority);
        }
        if (search) {
          q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,target_role.ilike.%${search}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;
        q = q.order('created_at', { ascending: false }).range(from, to);

        const { data, count, error } = await q;
        if (error) throw error;
        return { items: data || [], total: count || 0, page: Number(page), limit: Number(limit) };
      } catch (err) {
        console.error('[DB-Supabase] Query error, using local data:', err.message);
      }
    }

    // Local Query
    let list = this.readLocal();
    if (status && status !== 'all') {
      list = list.filter(item => item.status === status);
    }
    if (priority && priority !== 'all') {
      list = list.filter(item => item.priority === priority);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(item => 
        (item.first_name && item.first_name.toLowerCase().includes(s)) ||
        (item.last_name && item.last_name.toLowerCase().includes(s)) ||
        (item.email && item.email.toLowerCase().includes(s)) ||
        (item.phone && item.phone.includes(s)) ||
        (item.target_role && item.target_role.toLowerCase().includes(s))
      );
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + Number(limit));

    return { items: paginated, total, page: Number(page), limit: Number(limit) };
  }

  // --- CRUD: READ SINGLE ---
  async getSubmissionById(id) {
    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase
          .from('contact_submissions')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[DB-Supabase] Get single error:', err.message);
      }
    }

    const list = this.readLocal();
    return list.find(item => item.id === id) || null;
  }

  // --- CRUD: UPDATE ---
  async updateSubmission(id, updates) {
    const validFields = ['status', 'priority', 'assigned_recruiter', 'internal_notes', 'is_starred'];
    const filteredUpdates = {};
    for (const key of validFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }
    filteredUpdates.updated_at = new Date().toISOString();

    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase
          .from('contact_submissions')
          .update(filteredUpdates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[DB-Supabase] Update error:', err.message);
      }
    }

    const list = this.readLocal();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...filteredUpdates };
    this.writeLocal(list);
    return list[index];
  }

  // --- CRUD: DELETE ---
  async deleteSubmission(id) {
    if (this.isSupabaseConfigured) {
      try {
        const { error } = await this.supabase
          .from('contact_submissions')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('[DB-Supabase] Delete error:', err.message);
      }
    }

    const list = this.readLocal();
    const filtered = list.filter(item => item.id !== id);
    if (filtered.length === list.length) return false;
    this.writeLocal(filtered);
    return true;
  }

  // --- STATS OVERVIEW ---
  async getStats() {
    let list = [];
    if (this.isSupabaseConfigured) {
      try {
        const { data, error } = await this.supabase.from('contact_submissions').select('status, created_at');
        if (!error && data) list = data;
      } catch (err) {
        list = this.readLocal();
      }
    } else {
      list = this.readLocal();
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 3600000);

    return {
      total: list.length,
      new: list.filter(i => i.status === 'new').length,
      contacted: list.filter(i => i.status === 'contacted').length,
      converted: list.filter(i => i.status === 'converted').length,
      in_review: list.filter(i => i.status === 'in_review').length,
      archived: list.filter(i => i.status === 'archived').length,
      receivedToday: list.filter(i => new Date(i.created_at) >= oneDayAgo).length,
      storageMode: this.isSupabaseConfigured ? 'Supabase Live' : 'Local Resilient DB'
    };
  }
}

module.exports = new SubmissionsDatabase();
