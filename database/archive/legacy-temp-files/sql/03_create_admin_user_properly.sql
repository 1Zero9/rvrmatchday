-- Step 1: First create a Supabase auth user via the dashboard or this method
-- You need to either:
-- A) Sign up via your app's signup flow, OR
-- B) Create user via Supabase Auth dashboard, OR  
-- C) Use this SQL to create auth user first:

-- Option C: Create auth user and profile in one go
-- REPLACE 'your-email@example.com' with your actual email
-- REPLACE 'your-secure-password' with a strong password

DO $$
DECLARE
    user_id UUID;
    user_email TEXT := 'your-email@example.com';  -- REPLACE THIS
BEGIN
    -- Check if user already exists in auth.users
    SELECT id INTO user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        -- Create the auth user (this may not work without admin service key)
        RAISE NOTICE 'User % not found in auth.users. Please create via Supabase Auth dashboard first.', user_email;
    ELSE
        -- User exists, create tracker profile
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
            user_id,
            user_email,
            'admin',
            'Club Administrator', 
            'admin',
            ARRAY['*'],
            ARRAY['*'],
            true
        ) ON CONFLICT (id) DO UPDATE SET
            role = 'admin',
            teams = ARRAY['*'],
            permissions = ARRAY['*'],
            is_active = true,
            updated_at = NOW();
            
        RAISE NOTICE 'Admin user profile created/updated for %', user_email;
    END IF;
END $$;