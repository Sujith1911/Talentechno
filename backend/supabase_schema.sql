-- ============================================================================
-- TALENTECHNO SUPABASE DATABASE SCHEMA
-- Table: contact_submissions
-- Real-time enabled IT Recruiter lead & contact management
-- ============================================================================

-- 1. Create table for Contact & Lead submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Inquirer Details
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    
    -- Hiring & Service Details
    service TEXT DEFAULT 'recruitment',
    target_role TEXT,
    message TEXT,
    
    -- Lead Management & Recruiter Workflow
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'contacted', 'converted', 'archived')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_recruiter TEXT,
    internal_notes TEXT,
    is_starred BOOLEAN DEFAULT false,
    
    -- Metadata
    ip_address TEXT,
    user_agent TEXT,
    source TEXT DEFAULT 'website_landing'
);

-- 2. Indexes for high-performance querying & filtering
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON public.contact_submissions(email);

-- 3. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.contact_submissions;
CREATE TRIGGER trigger_set_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow insert from public (website forms)
CREATE POLICY "Allow public insert into submissions"
    ON public.contact_submissions
    FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

-- Allow full access to service_role (Admin API backend)
CREATE POLICY "Allow full access to service_role"
    ON public.contact_submissions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. Enable Supabase Realtime for this table
-- Note: In Supabase dashboard, ensure Realtime is turned ON for contact_submissions
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_submissions;
