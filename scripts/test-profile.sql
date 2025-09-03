-- Test script to check profile functionality
-- Run this in your Supabase SQL Editor to debug profile issues

-- 1. Check if profiles table exists
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_name = 'profiles';

-- 2. Check table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 3. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 4. Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- 5. Check current profiles (replace 'your-user-id' with actual user ID)
-- SELECT * FROM profiles WHERE id = 'your-user-id';

-- 6. Test profile creation manually (replace with actual values)
-- INSERT INTO profiles (id, email, full_name, phone, location, bio)
-- VALUES (
--   'your-user-id',
--   'your-email@example.com',
--   'Test User',
--   '+1234567890',
--   'Test City',
--   'Test bio'
-- )
-- ON CONFLICT (id) DO UPDATE SET
--   email = EXCLUDED.email,
--   full_name = EXCLUDED.full_name,
--   phone = EXCLUDED.phone,
--   location = EXCLUDED.location,
--   bio = EXCLUDED.bio,
--   updated_at = NOW();

-- 7. Check for any errors in the logs
-- This will show recent errors in your Supabase project
