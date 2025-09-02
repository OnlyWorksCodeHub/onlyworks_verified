-- Add bio column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Create avatars storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
