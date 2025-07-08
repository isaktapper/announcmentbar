-- Add use_gradient column to announcements table
-- This tracks whether the announcement uses a gradient background

ALTER TABLE announcements 
ADD COLUMN use_gradient BOOLEAN DEFAULT false;

-- Update existing records to set use_gradient based on whether background_gradient exists
UPDATE announcements 
SET use_gradient = (background_gradient IS NOT NULL AND background_gradient != '');

-- Add comment for documentation
COMMENT ON COLUMN announcements.use_gradient IS 'Whether the announcement uses a gradient background (true) or solid color (false)'; 