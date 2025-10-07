-- Fix permissions for coaches table

-- 1. Drop any restrictive policies on coaches table
DROP POLICY IF EXISTS "Enable read access for all users" ON coaches;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON coaches;
DROP POLICY IF EXISTS "Enable update for users based on email" ON coaches;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON coaches;
DROP POLICY IF EXISTS "coaches_select_policy" ON coaches;
DROP POLICY IF EXISTS "coaches_insert_policy" ON coaches;
DROP POLICY IF EXISTS "coaches_update_policy" ON coaches;
DROP POLICY IF EXISTS "coaches_delete_policy" ON coaches;

-- 2. Create permissive policy for coaches
CREATE POLICY "Allow all for coaches" ON coaches FOR ALL USING (true) WITH CHECK (true);