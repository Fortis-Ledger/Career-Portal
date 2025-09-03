-- Portal Settings Table Setup
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS portal_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    portal_name TEXT DEFAULT 'FortisLedger Career Portal',
    portal_description TEXT DEFAULT 'Join our team and build the future of financial technology',
    company_website TEXT DEFAULT 'https://career.fortisledger.io',
    contact_email TEXT DEFAULT 'admin@fortisledger.io',
    primary_color TEXT DEFAULT '#0ea5e9',
    secondary_color TEXT DEFAULT '#8b5cf6',
    logo_url TEXT DEFAULT '',
    dark_mode BOOLEAN DEFAULT true,
    smtp_host TEXT DEFAULT '',
    smtp_port TEXT DEFAULT '587',
    smtp_username TEXT DEFAULT '',
    smtp_password TEXT DEFAULT '',
    email_notifications BOOLEAN DEFAULT true,
    require_email_verification BOOLEAN DEFAULT true,
    enable_2fa BOOLEAN DEFAULT false,
    public_registration BOOLEAN DEFAULT true,
    session_timeout INTEGER DEFAULT 60,
    max_file_size INTEGER DEFAULT 10,
    auto_application_confirmation BOOLEAN DEFAULT true,
    allow_multiple_applications BOOLEAN DEFAULT false,
    application_deadline INTEGER DEFAULT 30,
    required_fields TEXT DEFAULT 'Full Name, Email, Phone, Resume, Cover Letter',
    notify_new_applications BOOLEAN DEFAULT true,
    notify_new_registrations BOOLEAN DEFAULT true,
    daily_summary BOOLEAN DEFAULT false,
    notification_email TEXT DEFAULT 'admin@fortisledger.io',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id),
    CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE portal_settings ENABLE ROW LEVEL SECURITY;

-- Admin access policy
CREATE POLICY "Admin can manage portal settings" ON portal_settings
    FOR ALL USING (
        auth.email() IN (
            'admin@fortisledger.io',
            'admin@fortisarena.io', 
            'ahmedfaraz.sa.48@gmail.com'
        )
    );

-- Insert default settings
INSERT INTO portal_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
