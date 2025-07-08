-- Add scheduled visibility columns to announcements table
ALTER TABLE announcements
ADD COLUMN scheduled_start timestamp with time zone,
ADD COLUMN scheduled_end timestamp with time zone; 