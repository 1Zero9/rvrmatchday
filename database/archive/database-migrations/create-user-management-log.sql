-- User Management Event Log Table
-- Creates a comprehensive audit trail for all user management actions

CREATE TABLE IF NOT EXISTS user_management_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES tracker_users(id) ON DELETE SET NULL,
    target_user_id UUID REFERENCES tracker_users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN (
        'create_user',
        'update_user', 
        'delete_user',
        'reset_password',
        'activate_user',
        'deactivate_user',
        'approve_request',
        'deny_request'
    )),
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_admin_user ON user_management_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_target_user ON user_management_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_action ON user_management_log(action);
CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_created_at ON user_management_log(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_management_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view event logs
CREATE POLICY "Admin can view all logs" ON user_management_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tracker_users 
            WHERE tracker_users.id = auth.uid() 
            AND tracker_users.role = 'admin'
            AND tracker_users.is_active = true
        )
    );

-- Policy: Only admins can insert event logs  
CREATE POLICY "Admin can insert logs" ON user_management_log
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM tracker_users 
            WHERE tracker_users.id = auth.uid() 
            AND tracker_users.role = 'admin'
            AND tracker_users.is_active = true
        )
    );

-- Comment on table
COMMENT ON TABLE user_management_log IS 'Audit trail for all user management actions performed by administrators';

-- Sample data for testing (optional - remove in production)
INSERT INTO user_management_log (admin_user_id, target_user_id, action, details, created_at) VALUES
(
    (SELECT id FROM tracker_users WHERE role = 'admin' LIMIT 1),
    (SELECT id FROM tracker_users WHERE role = 'parent' LIMIT 1),
    'create_user',
    '{"reason": "Initial system setup", "user_role": "parent"}',
    NOW() - INTERVAL '1 day'
),
(
    (SELECT id FROM tracker_users WHERE role = 'admin' LIMIT 1),
    (SELECT id FROM tracker_users WHERE role = 'parent' LIMIT 1),
    'update_user',
    '{"changed_fields": ["full_name"], "old_values": {"full_name": "Old Name"}, "new_values": {"full_name": "New Name"}}',
    NOW() - INTERVAL '2 hours'
);

-- Grant permissions to service role (for admin operations)
GRANT ALL ON user_management_log TO service_role;