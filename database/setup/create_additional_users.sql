-- Create Additional User Accounts for Rivervalley Rangers Match Tracker
-- Run this in Supabase SQL Editor after creating auth users

-- ================================================
-- STEP 1: CREATE AUTH USERS FIRST (via Supabase Dashboard)
-- ================================================
-- Go to Supabase Dashboard > Authentication > Users
-- Click "Add User" and create the following accounts:
--
-- 1. coach@rvr.ie          (Password: coach2025rvr)
-- 2. manager@rvr.ie        (Password: manager2025rvr)  
-- 3. editor@rvr.ie         (Password: editor2025rvr)
-- 4. parent@rvr.ie         (Password: parent2025rvr)
-- 5. volunteer@rvr.ie      (Password: volunteer2025rvr)


-- ================================================
-- STEP 2: CREATE USER PROFILES (run this SQL)
-- ================================================

-- Coach User Profile
INSERT INTO tracker_users (
    id, 
    email, 
    username, 
    full_name, 
    role, 
    teams, 
    permissions, 
    is_active,
    created_at,
    updated_at
) 
SELECT 
    auth.uid(),
    'coach@rvr.ie',
    'coach_main',
    'Head Coach',
    'coach',
    ARRAY['U10 Boys', 'U12 Boys'],
    ARRAY['view_teams', 'edit_matches', 'view_players'],
    true,
    now(),
    now()
FROM auth.users 
WHERE email = 'coach@rvr.ie'
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    teams = EXCLUDED.teams,
    permissions = EXCLUDED.permissions,
    updated_at = now();

-- Manager User Profile  
INSERT INTO tracker_users (
    id, 
    email, 
    username, 
    full_name, 
    role, 
    teams, 
    permissions, 
    is_active,
    created_at,
    updated_at
) 
SELECT 
    auth.uid(),
    'manager@rvr.ie',
    'manager_main',
    'Team Manager',
    'manager',
    ARRAY['U14 Boys', 'U16 Boys'],
    ARRAY['view_teams', 'edit_matches', 'view_players', 'manage_team'],
    true,
    now(),
    now()
FROM auth.users 
WHERE email = 'manager@rvr.ie'
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    teams = EXCLUDED.teams,
    permissions = EXCLUDED.permissions,
    updated_at = now();

-- Editor User Profile
INSERT INTO tracker_users (
    id, 
    email, 
    username, 
    full_name, 
    role, 
    teams, 
    permissions, 
    is_active,
    created_at,
    updated_at
) 
SELECT 
    auth.uid(),
    'editor@rvr.ie',
    'editor_main',
    'Content Editor',
    'editor',
    ARRAY[],
    ARRAY['view_all', 'edit_content', 'publish_news'],
    true,
    now(),
    now()
FROM auth.users 
WHERE email = 'editor@rvr.ie'
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    teams = EXCLUDED.teams,
    permissions = EXCLUDED.permissions,
    updated_at = now();

-- Parent User Profile
INSERT INTO tracker_users (
    id, 
    email, 
    username, 
    full_name, 
    role, 
    teams, 
    permissions, 
    is_active,
    created_at,
    updated_at
) 
SELECT 
    auth.uid(),
    'parent@rvr.ie',
    'parent_main',
    'Parent Guardian',
    'parent',
    ARRAY['U10 Boys'],
    ARRAY['view_child_team', 'view_matches'],
    true,
    now(),
    now()
FROM auth.users 
WHERE email = 'parent@rvr.ie'
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    teams = EXCLUDED.teams,
    permissions = EXCLUDED.permissions,
    updated_at = now();

-- Volunteer User Profile
INSERT INTO tracker_users (
    id, 
    email, 
    username, 
    full_name, 
    role, 
    teams, 
    permissions, 
    is_active,
    created_at,
    updated_at
) 
SELECT 
    auth.uid(),
    'volunteer@rvr.ie',
    'volunteer_main',
    'Club Volunteer',
    'volunteer',
    ARRAY[],
    ARRAY['view_events', 'help_matchday'],
    true,
    now(),
    now()
FROM auth.users 
WHERE email = 'volunteer@rvr.ie'
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    teams = EXCLUDED.teams,
    permissions = EXCLUDED.permissions,
    updated_at = now();

-- ================================================
-- STEP 3: VERIFY USER CREATION
-- ================================================

-- Check all users were created successfully
SELECT 
    tu.email,
    tu.full_name,
    tu.role,
    tu.teams,
    tu.permissions,
    tu.is_active,
    au.email_confirmed_at
FROM tracker_users tu
JOIN auth.users au ON tu.id = au.id
ORDER BY tu.role, tu.email;

-- ================================================
-- OPTIONAL: CREATE DEMO MATCH DATA FOR TESTING
-- ================================================

-- Create some sample matches for testing role-based access
INSERT INTO matches (
    id,
    home_team,
    away_team,
    match_date,
    match_type,
    league_division,
    venue,
    created_by
) VALUES
(
    gen_random_uuid(),
    'RVR U10 Boys',
    'Swords Celtic U10',
    '2025-09-25 10:00:00',
    'league',
    'DDSL Division 5',
    'Rivervalley Park',
    (SELECT id FROM tracker_users WHERE email = 'coach@rvr.ie')
),
(
    gen_random_uuid(),
    'RVR U14 Boys', 
    'St. Josephs Boys U14',
    '2025-09-25 14:00:00',
    'league',
    'DDSL Division 3',
    'Rivervalley Park',
    (SELECT id FROM tracker_users WHERE email = 'manager@rvr.ie')
);

-- ================================================
-- SUCCESS MESSAGE
-- ================================================
SELECT 'Additional user accounts created successfully!' as result;