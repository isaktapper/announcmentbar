-- Add font column to announcements table
-- This tracks the selected font family for each announcement

ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Work Sans';

-- Add comment for documentation
COMMENT ON COLUMN announcements.font_family IS 'Selected Google Font family name (e.g. Work Sans, Inter, Lato). Default is Work Sans for backward compatibility.'; 