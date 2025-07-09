-- Add display_name column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Update existing profiles to set display_name from user metadata if available
UPDATE profiles
SET display_name = (
  SELECT COALESCE(
    raw_user_meta_data->>'display_name',
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'full_name',
    email
  )
  FROM auth.users
  WHERE auth.users.id = profiles.id
);

-- Create policy to allow users to update their own display_name
CREATE POLICY "Users can update their own display_name" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id); 