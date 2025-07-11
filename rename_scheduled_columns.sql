-- Rename scheduled visibility columns to match TypeScript interface
ALTER TABLE announcements
RENAME COLUMN scheduled_start TO "scheduledStart";
 
ALTER TABLE announcements
RENAME COLUMN scheduled_end TO "scheduledEnd"; 