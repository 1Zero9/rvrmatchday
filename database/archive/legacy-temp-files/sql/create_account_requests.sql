-- Account Requests Table
-- For managing user account requests and approval workflow

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_account_requests_status ON account_requests(status);
CREATE INDEX IF NOT EXISTS idx_account_requests_email ON account_requests(email);
CREATE INDEX IF NOT EXISTS idx_account_requests_requested_at ON account_requests(requested_at);

-- Enable RLS
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Public can insert requests (for account request form)
CREATE POLICY "Anyone can submit account requests" ON account_requests
  FOR INSERT WITH CHECK (true);

-- Admins can view all requests
CREATE POLICY "Admins can view all requests" ON account_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update requests (approve/deny)
CREATE POLICY "Admins can update requests" ON account_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Users can view their own requests
CREATE POLICY "Users can view own requests" ON account_requests
  FOR SELECT USING (email = auth.email());

-- Create updated_at trigger
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