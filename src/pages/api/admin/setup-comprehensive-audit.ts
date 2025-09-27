/**
 * Admin API - Setup Comprehensive Audit System
 * Creates the unified admin_event_log table for comprehensive system-wide event logging
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Setting up comprehensive admin event logging system...');

    // First, check if the new table already exists
    const { error: checkError } = await supabaseAdmin
      .from('admin_event_log')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      return res.status(200).json({
        success: true,
        message: 'Comprehensive admin event log table already exists',
        tableExists: true
      });
    }

    // Return SQL for manual creation since we can't execute DDL via API
    const createTableSQL = `
-- Comprehensive Admin Event Log Table
-- Unified system for tracking all admin operations across the platform
CREATE TABLE admin_event_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Who performed the action
    admin_user_id UUID NOT NULL,
    admin_username VARCHAR(100),
    admin_email VARCHAR(255),
    
    -- What was the action
    event_type VARCHAR(50) NOT NULL, -- 'user_management', 'content_management', 'system_management', 'match_management'
    action VARCHAR(100) NOT NULL,    -- 'create_user', 'update_match', 'delete_content', 'system_backup'
    
    -- What was affected
    target_type VARCHAR(50),         -- 'user', 'match', 'team', 'content', 'system', 'settings'
    target_id UUID,                  -- ID of the affected resource
    target_identifier VARCHAR(255), -- Name/title/identifier of the affected resource
    
    -- Action details
    description TEXT,                -- Human-readable description of the action
    details JSONB DEFAULT '{}',      -- Structured data about the action
    
    -- Context information
    ip_address INET,
    user_agent TEXT,
    request_path VARCHAR(500),       -- API endpoint or page that triggered the action
    
    -- Metadata
    status VARCHAR(20) DEFAULT 'success', -- 'success', 'failed', 'partial'
    error_message TEXT,              -- If status is failed
    
    -- Audit trail
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key to users table
    CONSTRAINT fk_admin_event_log_admin_user 
        FOREIGN KEY (admin_user_id) 
        REFERENCES tracker_users(id) 
        ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX idx_admin_event_log_admin_user ON admin_event_log(admin_user_id);
CREATE INDEX idx_admin_event_log_event_type ON admin_event_log(event_type);
CREATE INDEX idx_admin_event_log_action ON admin_event_log(action);
CREATE INDEX idx_admin_event_log_target_type ON admin_event_log(target_type);
CREATE INDEX idx_admin_event_log_target_id ON admin_event_log(target_id);
CREATE INDEX idx_admin_event_log_created_at ON admin_event_log(created_at DESC);
CREATE INDEX idx_admin_event_log_status ON admin_event_log(status);

-- Composite indexes for common queries
CREATE INDEX idx_admin_event_log_type_action ON admin_event_log(event_type, action);
CREATE INDEX idx_admin_event_log_admin_date ON admin_event_log(admin_user_id, created_at DESC);
CREATE INDEX idx_admin_event_log_target_date ON admin_event_log(target_type, target_id, created_at DESC);

-- Enable Row Level Security (for production)
ALTER TABLE admin_event_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can read audit logs
CREATE POLICY admin_event_log_read_policy ON admin_event_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tracker_users 
            WHERE tracker_users.id = auth.uid() 
            AND tracker_users.role = 'admin'
            AND tracker_users.is_active = true
        )
    );

-- RLS Policy: Only the system can insert audit logs (via service role)
CREATE POLICY admin_event_log_insert_policy ON admin_event_log
    FOR INSERT WITH CHECK (true); -- Service role bypasses RLS anyway

-- Grant permissions
GRANT SELECT ON admin_event_log TO authenticated;
GRANT INSERT ON admin_event_log TO service_role;

-- Create a view for easier querying with user details
CREATE OR REPLACE VIEW admin_event_log_with_users AS
SELECT 
    ael.*,
    admin_user.full_name as admin_full_name,
    admin_user.username as admin_username_lookup,
    admin_user.role as admin_role,
    target_user.full_name as target_user_name,
    target_user.email as target_user_email
FROM admin_event_log ael
LEFT JOIN tracker_users admin_user ON ael.admin_user_id = admin_user.id
LEFT JOIN tracker_users target_user ON ael.target_id = target_user.id AND ael.target_type = 'user';

GRANT SELECT ON admin_event_log_with_users TO authenticated;
`;

    // Test connection to existing admin_audit_log to see current structure
    const { data: existingLogs, error: existingError } = await supabaseAdmin
      .from('admin_audit_log')
      .select('*')
      .limit(5);

    return res.status(200).json({
      success: false,
      tableExists: false,
      message: 'Comprehensive admin event log table needs to be created',
      instruction: 'Please run this SQL in your Supabase SQL editor to create the comprehensive audit system:',
      sql: createTableSQL,
      migration: {
        existingAuditLogs: existingLogs?.length || 0,
        migrationNeeded: true,
        migrationSQL: `
-- Migration: Copy existing audit logs to new comprehensive table
INSERT INTO admin_event_log (
    admin_user_id,
    event_type,
    action,
    target_type,
    target_id,
    description,
    details,
    created_at
)
SELECT 
    admin_user_id,
    'user_management' as event_type,
    action,
    'user' as target_type,
    target_user_id,
    CONCAT('User management action: ', action) as description,
    details,
    timestamp as created_at
FROM admin_audit_log
WHERE admin_user_id IS NOT NULL;

-- Migration: Copy user management logs if they exist
INSERT INTO admin_event_log (
    admin_user_id,
    event_type,
    action,
    target_type,
    target_id,
    description,
    details,
    created_at
)
SELECT 
    admin_user_id,
    'user_management' as event_type,
    action,
    'user' as target_type,
    target_user_id,
    CONCAT('User management action: ', action) as description,
    details,
    created_at
FROM user_management_log
WHERE admin_user_id IS NOT NULL
ON CONFLICT DO NOTHING;
`
      }
    });

  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      error: 'Setup failed', 
      details: (error as Error).message 
    });
  }
}