-- Add bar_name column to announcements table
ALTER TABLE announcements
ADD COLUMN bar_name VARCHAR(255);

-- Update existing rows to use content.title as bar_name if available
UPDATE announcements
SET bar_name = COALESCE(
  content->>'title',
  'Untitled Bar'
)
WHERE bar_name IS NULL; 