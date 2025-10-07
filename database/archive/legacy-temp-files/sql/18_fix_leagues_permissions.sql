-- Fix permissions for existing leagues table

-- 1. Drop restrictive policies on leagues table
DROP POLICY IF EXISTS "Enable read access for all users" ON leagues;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON leagues;
DROP POLICY IF EXISTS "Enable update for users based on email" ON leagues;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON leagues;

-- 2. Create permissive policy for leagues
CREATE POLICY "Allow all for leagues" ON leagues FOR ALL USING (true) WITH CHECK (true);

-- 3. Do the same for venues if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'venues') THEN
    -- Drop existing venue policies
    DROP POLICY IF EXISTS "Enable read access for all users" ON venues;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON venues;
    DROP POLICY IF EXISTS "Enable update for users based on email" ON venues;
    DROP POLICY IF EXISTS "Enable delete for users based on email" ON venues;
    
    -- Create permissive policy
    CREATE POLICY "Allow all for venues" ON venues FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;