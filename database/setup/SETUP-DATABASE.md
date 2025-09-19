# 🗄️ Database Setup Instructions

## Missing Tables Setup

You need to run these SQL commands in your **Supabase SQL Editor** to create the missing auth tables:

### 1. Create `tracker_users` Table

```sql
-- Create tracker_users table for Match Central auth
CREATE TABLE IF NOT EXISTS tracker_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'coach', 'manager', 'parent', 'volunteer')),
  teams TEXT[] DEFAULT '{}',
  permissions TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tracker_users_email ON tracker_users(email);
CREATE INDEX IF NOT EXISTS idx_tracker_users_role ON tracker_users(role);

-- Enable RLS
ALTER TABLE tracker_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON tracker_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON tracker_users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON tracker_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all profiles" ON tracker_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated trigger
CREATE OR REPLACE FUNCTION update_tracker_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tracker_users_updated_at 
  BEFORE UPDATE ON tracker_users 
  FOR EACH ROW EXECUTE FUNCTION update_tracker_users_updated_at();
```

### 2. Create `account_requests` Table

```sql
-- Account Requests Table for user registration workflow
CREATE TABLE IF NOT EXISTS account_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  requested_role TEXT NOT NULL CHECK (requested_role IN ('coach', 'manager', 'parent', 'volunteer')),
  team_interest TEXT[] DEFAULT '{}',
  experience TEXT,
  reason TEXT NOT NULL,
  garda_vetting BOOLEAN DEFAULT false,
  safeguarding_course BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT,
  reviewer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_account_requests_status ON account_requests(status);
CREATE INDEX IF NOT EXISTS idx_account_requests_email ON account_requests(email);
CREATE INDEX IF NOT EXISTS idx_account_requests_requested_at ON account_requests(requested_at);

-- Enable RLS
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit account requests" ON account_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all requests" ON account_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update requests" ON account_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tracker_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view own requests" ON account_requests
  FOR SELECT USING (email = auth.email());

-- Updated trigger
CREATE OR REPLACE FUNCTION update_account_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_account_requests_updated_at 
  BEFORE UPDATE ON account_requests 
  FOR EACH ROW EXECUTE FUNCTION update_account_requests_updated_at();
```

### 3. Create Initial Admin User

```sql
-- Insert initial admin user (replace with your email)
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
```

## ✅ After Running SQL

1. Visit **http://localhost:3000/test-auth-setup** to verify tables exist
2. All checks should show green ✅ with row counts
3. Remove the test page: `rm src/pages/test-auth-setup.tsx`

## 🔐 Access Points

- **Auth Login**: http://localhost:3000/auth-login
- **Request Account**: http://localhost:3000/account-request  
- **Admin Review**: http://localhost:3000/account-admin
- **Setup Checker**: http://localhost:3000/test-auth-setup

## 🎯 Testing Workflow

1. **Submit Request** → Use account-request form
2. **Admin Review** → Check account-admin for pending requests
3. **Test Login** → Try auth-login with new credentials
4. **Fallback** → Use `rvrfc2025` code during transition