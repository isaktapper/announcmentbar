-- Drop existing constraints
ALTER TABLE announcements DROP CONSTRAINT IF EXISTS announcements_cta_border_radius_check;
ALTER TABLE announcements DROP CONSTRAINT IF EXISTS announcements_cta_size_check;

-- Add constraints back
ALTER TABLE announcements ADD CONSTRAINT announcements_cta_border_radius_check 
  CHECK (cta_border_radius IN ('sharp', 'soft', 'pill'));

ALTER TABLE announcements ADD CONSTRAINT announcements_cta_size_check
  CHECK (cta_size IN ('small', 'medium', 'large'));

-- Update any null or invalid values to defaults
UPDATE announcements SET cta_border_radius = 'soft' WHERE cta_border_radius IS NULL;
UPDATE announcements SET cta_size = 'medium' WHERE cta_size IS NULL; 