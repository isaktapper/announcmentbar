-- Migration: Remove redundant title and message columns
-- These are now stored in the content JSONB column

-- First, ensure all data is migrated to content column
UPDATE announcements
SET content = jsonb_build_object('title', title, 'message', message)
WHERE content IS NULL AND type = 'single';

-- Remove redundant columns
ALTER TABLE announcements 
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS message; 