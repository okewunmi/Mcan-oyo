-- =====================================================
-- MCAN OYO STATE — SUPABASE DATABASE SCHEMA
-- Run this in the Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- SITE SETTINGS (used by keep-alive + CMS globals)
-- =====================================================
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_settings (key, value) VALUES
  ('ameer_name', 'Br. Abdullah Adewale'),
  ('ameer_phone', '+2348012345678'),
  ('email', 'mcanoyo@gmail.com'),
  ('whatsapp', '+2348012345678'),
  ('instagram', '@mcan_oyo'),
  ('facebook', 'MCAN Oyo State'),
  ('twitter', '@mcan_oyo'),
  ('bank_name', 'First Bank Nigeria'),
  ('account_name', 'Muslim Corpers Association Oyo'),
  ('account_number', '1234567890'),
  ('donation_note', 'Your donation supports Da''wah activities, lodge maintenance, and community development across Oyo State.'),
  ('address', 'MCAN National HQ, Mabushi, Abuja');

-- =====================================================
-- EXECUTIVES
-- =====================================================
CREATE TABLE executives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  batch TEXT,
  phone TEXT,
  email TEXT,
  photo_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LGI & MCLO CONTACTS (33 LGAs of Oyo State)
-- =====================================================
CREATE TABLE lgi_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lga TEXT NOT NULL,
  lgi_name TEXT,
  lgi_phone TEXT,
  mclo_name TEXT,
  mclo_phone TEXT,
  zone TEXT, -- Ibadan Metro, Oyo, Ogbomosho, etc.
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO lgi_contacts (lga, zone, sort_order) VALUES
  ('Afijio', 'Oyo Zone', 1),
  ('Akinyele', 'Ibadan Metro', 2),
  ('Atiba', 'Oyo Zone', 3),
  ('Atisbo', 'Saki Zone', 4),
  ('Egbeda', 'Ibadan Metro', 5),
  ('Ibadan North 1', 'Ibadan Metro', 6),
('Ibadan North 2', 'Ibadan Metro', 7),
  ('Ibadan North-East',  'Ibadan Metro', 8),
('Ibadan North-West',  'Ibadan Metro', 9),
('Ibadan South-East',  'Ibadan Metro', 10),
('Ibadan South-West',  'Ibadan Metro', 11),
('Ibarapa Central',    'Ibarapa Zone', 12),
('Ibarapa East',       'Ibarapa Zone', 13),
('Ibarapa North',      'Ibarapa Zone', 14),
('Ido',                'Ibadan Metro', 15),
('Irepo',              'Oyo Zone',     16),
('Iseyin',             'Saki Zone',    17),
('Itesiwaju',          'Saki Zone',    18),
('Iwajowa',            'Saki Zone',    19),
('Kajola',             'Saki Zone',    20),
('Lagelu',             'Ibadan Metro', 21),
('Ogbomosho North',    'Ogbomosho Zone', 22),
('Ogbomosho South',    'Ogbomosho Zone', 23),
('Ogo Oluwa',          'Ogbomosho Zone', 24),
('Olorunsogo',         'Ogbomosho Zone', 25),
('Oluyole',            'Ibadan Metro', 26),
('Ona Ara',            'Ibadan Metro', 27),
('Orelope',            'Oyo Zone',     28),
('Ori Ire',            'Ogbomosho Zone', 29),
('Oyo East',           'Oyo Zone',     30),
('Oyo West',           'Oyo Zone',     31),
('Saki East',          'Saki Zone',    32),
('Saki West',          'Saki Zone',    33),
('Surulere',           'Ogbomosho Zone', 34);

-- =====================================================
-- LODGES
-- =====================================================
CREATE TABLE lodges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  lga TEXT NOT NULL,
  address TEXT,
  landmark TEXT,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  capacity INT,
  contact_name TEXT,
  contact_phone TEXT,
  google_maps_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EVENTS
-- =====================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  image_url TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  live_link TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DAILY CONTENT
-- =====================================================
CREATE TABLE daily_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  content_type TEXT NOT NULL, -- hadith, azkar, tawheed, fiqh, jumuah, prophet_story, quran_story
  title TEXT NOT NULL,
  arabic_text TEXT,
  english_text TEXT,
  transliteration TEXT,
  chain_of_narration TEXT, -- for hadith
  reported_by TEXT,        -- for hadith
  lesson TEXT,             -- for hadith
  benefits TEXT,           -- for azkar
  source TEXT,             -- book/scholar reference
  extra_notes TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  publish_date DATE,       -- if set, shows only on this date
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- REGISTRATIONS
-- =====================================================
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  state_code TEXT NOT NULL,
  state_of_origin TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  batch TEXT NOT NULL CHECK (batch IN ('A', 'B', 'C')),
  stream TEXT NOT NULL CHECK (stream IN ('1', '2')),
  service_year INT NOT NULL,
  ppa TEXT,            -- primary place of assignment
  lga_of_posting TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EMAIL CAMPAIGNS
-- =====================================================
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  target_batch TEXT, -- null = all; 'A', 'B', 'C' = specific batch
  target_gender TEXT, -- null = all; 'male' / 'female'
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'completed', 'failed')),
  total_recipients INT DEFAULT 0,
  sent_count INT DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE site_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE executives       ENABLE ROW LEVEL SECURITY;
ALTER TABLE lgi_contacts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE lodges           ENABLE ROW LEVEL SECURITY;
ALTER TABLE events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_content    ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns  ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_settings"    ON site_settings    FOR SELECT USING (TRUE);
CREATE POLICY "public_read_executives"  ON executives       FOR SELECT USING (TRUE);
CREATE POLICY "public_read_lgi"         ON lgi_contacts     FOR SELECT USING (TRUE);
CREATE POLICY "public_read_lodges"      ON lodges           FOR SELECT USING (TRUE);
CREATE POLICY "public_read_events"      ON events           FOR SELECT USING (is_published = TRUE);
CREATE POLICY "public_read_daily"       ON daily_content    FOR SELECT USING (is_published = TRUE);
CREATE POLICY "public_insert_reg"       ON registrations    FOR INSERT WITH CHECK (TRUE);

-- Authenticated (admin) full access policies
CREATE POLICY "admin_all_settings"     ON site_settings    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_executives"   ON executives       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_lgi"          ON lgi_contacts     FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_lodges"       ON lodges           FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_events"       ON events           FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_daily"        ON daily_content    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_reg"          ON registrations    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_campaigns"    ON email_campaigns  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- STORAGE BUCKETS (create in Supabase dashboard)
-- =====================================================
-- Create buckets:  'events'  and  'executives'  as PUBLIC buckets
-- This allows image uploads for events and executive photos

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_event_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_slug(NEW.title) || '-' || extract(epoch from NOW())::bigint;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_event_slug
  BEFORE INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION set_event_slug();
