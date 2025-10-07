-- Simple User Management Event Log Table
-- Minimal version without RLS for easier setup

CREATE TABLE IF NOT EXISTS user_management_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID,
    target_user_id UUID,
    action VARCHAR(50) NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints if the referenced table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tracker_users') THEN
        ALTER TABLE user_management_log 
        DROP CONSTRAINT IF EXISTS fk_admin_user,
        ADD CONSTRAINT fk_admin_user FOREIGN KEY (admin_user_id) REFERENCES tracker_users(id) ON DELETE SET NULL;
        
        ALTER TABLE user_management_log 
        DROP CONSTRAINT IF EXISTS fk_target_user,
        ADD CONSTRAINT fk_target_user FOREIGN KEY (target_user_id) REFERENCES tracker_users(id) ON DELETE SET NULL;
    END IF;
END
$$;

-- Add check constraint for action types
ALTER TABLE user_management_log 
DROP CONSTRAINT IF EXISTS valid_actions,
ADD CONSTRAINT valid_actions CHECK (action IN (
    'create_user',
    'update_user', 
    'delete_user',
    'reset_password',
    'activate_user',
    'deactivate_user',
    'approve_request',
    'deny_request',
    'setup_system'
));

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_admin_user ON user_management_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_target_user ON user_management_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_action ON user_management_log(action);
CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_created_at ON user_management_log(created_at DESC);

-- Comment on table
COMMENT ON TABLE user_management_log IS 'Audit trail for all user management actions performed by administrators';

-- Insert sample data for testing
INSERT INTO user_management_log (admin_user_id, target_user_id, action, details, created_at) 
SELECT 
    admin.id,
    target.id,
    'setup_system',
    '{"message": "Event logging system initialized", "setup_date": "' || NOW()::text || '"}',
    NOW()
FROM 
    (SELECT id FROM tracker_users WHERE role = 'admin' ORDER BY created_at LIMIT 1) admin,
    (SELECT id FROM tracker_users WHERE role != 'admin' ORDER BY created_at LIMIT 1) target
ON CONFLICT DO NOTHING;