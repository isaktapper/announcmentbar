-- Add CTA (Call-to-Action) columns to announcements table
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS cta_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cta_text TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS cta_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS cta_size VARCHAR(10) DEFAULT 'medium'
  CHECK (cta_size IN ('small', 'medium', 'large')),
ADD COLUMN IF NOT EXISTS cta_border_radius VARCHAR(10) DEFAULT 'soft'
  CHECK (cta_border_radius IN ('sharp', 'soft', 'pill')),
ADD COLUMN IF NOT EXISTS cta_background_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS cta_text_color TEXT DEFAULT '#FFFFFF';

-- Add comments for documentation
COMMENT ON COLUMN announcements.cta_enabled IS 'Whether the CTA button is enabled';
COMMENT ON COLUMN announcements.cta_text IS 'Text to display on the CTA button';
COMMENT ON COLUMN announcements.cta_url IS 'URL to navigate to when CTA button is clicked';
COMMENT ON COLUMN announcements.cta_size IS 'Size of the CTA button: small, medium, or large';
COMMENT ON COLUMN announcements.cta_border_radius IS 'Border radius style of the CTA button: sharp, soft, or pill';
COMMENT ON COLUMN announcements.cta_background_color IS 'Background color of the CTA button';
COMMENT ON COLUMN announcements.cta_text_color IS 'Text color of the CTA button'; 