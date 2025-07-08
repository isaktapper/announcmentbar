-- Migration: Add announcement types and enhanced features
-- Run this after the existing announcements table is created

-- Add new columns for enhanced functionality
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT 'single'
  CHECK (type IN ('single', 'carousel', 'marquee'));

ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS type_settings JSONB DEFAULT '{}';

-- Add content column for JSON storage (carousel support)
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT NULL;

-- Add bar height column
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS bar_height INTEGER DEFAULT 60;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_content ON announcements USING GIN(content);

-- Comments for documentation
COMMENT ON COLUMN announcements.type IS 'Type of announcement: single (default), carousel (multiple rotating), marquee (scrolling)';
COMMENT ON COLUMN announcements.type_settings IS 'Type-specific settings like carousel speed, marquee direction, etc.';
COMMENT ON COLUMN announcements.content IS 'JSON array for carousel items, single object for others. Format: [{"title":"", "message":"", "titleUrl":"", "messageUrl":""}]';
COMMENT ON COLUMN announcements.bar_height IS 'Height of the announcement bar in pixels (default: 60px)';

-- Example content structures:
-- Single/Marquee: {"title": "Title", "message": "Message", "titleUrl": "", "messageUrl": ""}
-- Carousel: [{"title": "Item 1", "message": "Message 1", "titleUrl": "", "messageUrl": ""}, {"title": "Item 2", "message": "Message 2", "titleUrl": "", "messageUrl": ""}] 