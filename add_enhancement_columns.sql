-- Add advanced announcement bar features
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS title_font_size INTEGER NOT NULL DEFAULT 16;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS message_font_size INTEGER NOT NULL DEFAULT 14;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS title_url TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS message_url TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS text_alignment TEXT NOT NULL DEFAULT 'center';
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS icon_alignment TEXT NOT NULL DEFAULT 'left';
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS is_closable BOOLEAN NOT NULL DEFAULT false;
