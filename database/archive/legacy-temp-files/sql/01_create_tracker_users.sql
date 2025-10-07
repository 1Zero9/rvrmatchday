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