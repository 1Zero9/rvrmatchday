# 🚀 Simple Database Setup Steps

## Step 1: Create Tables
Run these **3 SQL files** in your Supabase SQL Editor (one at a time):

1. `sql/01_create_tracker_users_fixed.sql`
2. `sql/02_create_account_requests.sql` 
3. Skip step 3 for now (admin user creation)

## Step 2: Create Admin User (Easy Way)

**Option A: Via Supabase Dashboard**
1. Go to **Authentication → Users** in Supabase dashboard
2. Click **"Add User"**
3. Enter your email + password
4. After user created, run this SQL with your email:

```sql
INSERT INTO tracker_users (
    id,
    email, 
    username,
    full_name,
    role,
    teams,
    permissions,
    is_active
) 
SELECT 
    id,
    email,
    'admin',
    'Club Administrator',
    'admin',
    ARRAY['*'],
    ARRAY['*'], 
    true
FROM auth.users 
WHERE email = 'YOUR-EMAIL@EXAMPLE.COM'  -- REPLACE WITH YOUR EMAIL
ON CONFLICT (id) DO NOTHING;
```

## Step 3: Verify Setup
Visit: http://localhost:3000/test-auth-setup

You should see:
- ✅ tracker_users (1 row)
- ✅ account_requests (0 rows) 
- ✅ auth.users connection

## Step 4: Test Login
1. Visit: http://localhost:3000/auth-login
2. Use the email/password you created in Supabase
3. Should redirect to Match Central

## 🆘 If Still Having Issues
Just let me know and I can help debug the specific error!