-- Create initial admin user
-- IMPORTANT: Replace 'your-email@example.com' with your actual email address

INSERT INTO tracker_users (
  id,
  email,
  username,
  full_name,
  role,
  teams,
  permissions,
  is_active
) VALUES (
  gen_random_uuid(),
  'your-email@example.com',  -- REPLACE WITH YOUR EMAIL
  'admin',
  'Club Administrator',
  'admin',
  ARRAY['*'],
  ARRAY['*'],
  true
) ON CONFLICT (email) DO NOTHING;