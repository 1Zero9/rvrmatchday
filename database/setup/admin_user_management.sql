-- Admin User Management System
-- Complete database schema for comprehensive user account management
-- © 2025 Rivervalley Rangers AFC

-- ============================
-- USER ACCOUNTS TABLE (Enhanced)
-- ============================

-- First, let's check if the table exists and enhance it
DO $$ 
BEGIN
    -- Add columns to existing tracker_users table if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'account_status') THEN
        ALTER TABLE tracker_users ADD COLUMN account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'inactive', 'suspended', 'locked', 'pending'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'failed_login_attempts') THEN
        ALTER TABLE tracker_users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'account_locked_until') THEN
        ALTER TABLE tracker_users ADD COLUMN account_locked_until TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'password_reset_required') THEN
        ALTER TABLE tracker_users ADD COLUMN password_reset_required BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'last_password_change') THEN
        ALTER TABLE tracker_users ADD COLUMN last_password_change TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'created_by') THEN
        ALTER TABLE tracker_users ADD COLUMN created_by UUID REFERENCES tracker_users(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'admin_notes') THEN
        ALTER TABLE tracker_users ADD COLUMN admin_notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tracker_users' AND column_name = 'last_activity') THEN
        ALTER TABLE tracker_users ADD COLUMN last_activity TIMESTAMP;
    END IF;
END $$;

-- ============================
-- ADMIN AUDIT LOG TABLE
-- ============================

CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID NOT NULL REFERENCES tracker_users(id),
    target_user_id UUID REFERENCES tracker_users(id),
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN (
        'user_created', 'user_updated', 'user_deleted', 'user_suspended', 'user_activated',
        'password_reset', 'permissions_changed', 'role_changed', 'account_locked', 'account_unlocked',
        'login_attempt_reset', 'notes_added', 'notes_updated'
    )),
    action_description TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_user ON admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action_type ON admin_audit_log(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_timestamp ON admin_audit_log(timestamp);

-- ============================
-- USER LOGIN LOG TABLE
-- ============================

CREATE TABLE IF NOT EXISTS user_login_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tracker_users(id),
    login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_status VARCHAR(20) NOT NULL CHECK (login_status IN ('success', 'failed', 'blocked', 'locked')),
    ip_address INET,
    user_agent TEXT,
    failure_reason TEXT,
    session_id TEXT,
    logout_timestamp TIMESTAMP
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_login_log_user_id ON user_login_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_log_timestamp ON user_login_log(login_timestamp);
CREATE INDEX IF NOT EXISTS idx_user_login_log_status ON user_login_log(login_status);

-- ============================
-- PASSWORD RESET TOKENS TABLE
-- ============================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tracker_users(id),
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_by UUID REFERENCES tracker_users(id), -- Admin who initiated reset
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- ============================
-- USER SESSIONS TABLE (For tracking active sessions)
-- ============================

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tracker_users(id),
    session_token TEXT NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    terminated_by UUID REFERENCES tracker_users(id), -- Admin who terminated session
    terminated_at TIMESTAMP,
    termination_reason TEXT
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);

-- ============================
-- ROLE PERMISSIONS TABLE
-- ============================

CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(50) NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_name, permission_name)
);

-- Insert default role permissions
INSERT INTO role_permissions (role_name, permission_name, description) VALUES
-- Admin permissions
('admin', 'user_management', 'Full user account management'),
('admin', 'system_admin', 'System administration access'),
('admin', 'audit_logs', 'View and manage audit logs'),
('admin', 'match_central_full', 'Full match central access'),
('admin', 'content_management', 'Full content management'),

-- Editor permissions  
('editor', 'content_management', 'Content creation and editing'),
('editor', 'match_central_limited', 'Limited match central access'),

-- Coach permissions
('coach', 'match_central_team', 'Team-specific match central access'),
('coach', 'player_management', 'Team player management'),

-- Manager permissions
('manager', 'match_central_team', 'Team-specific match central access'),
('manager', 'team_admin', 'Team administration'),

-- Parent permissions
('parent', 'match_central_view', 'View-only match central access'),

-- Volunteer permissions
('volunteer', 'basic_access', 'Basic volunteer access')

ON CONFLICT (role_name, permission_name) DO NOTHING;

-- ============================
-- FUNCTIONS FOR AUDIT LOGGING
-- ============================

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    p_admin_user_id UUID,
    p_target_user_id UUID,
    p_action_type VARCHAR(50),
    p_action_description TEXT,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO admin_audit_log (
        admin_user_id, target_user_id, action_type, action_description,
        old_values, new_values, ip_address, user_agent, session_id
    ) VALUES (
        p_admin_user_id, p_target_user_id, p_action_type, p_action_description,
        p_old_values, p_new_values, p_ip_address, p_user_agent, p_session_id
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log user login attempts
CREATE OR REPLACE FUNCTION log_user_login(
    p_user_id UUID,
    p_login_status VARCHAR(20),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_failure_reason TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO user_login_log (
        user_id, login_status, ip_address, user_agent, failure_reason, session_id
    ) VALUES (
        p_user_id, p_login_status, p_ip_address, p_user_agent, p_failure_reason, p_session_id
    ) RETURNING id INTO log_id;
    
    -- Update user's last activity if successful login
    IF p_login_status = 'success' THEN
        UPDATE tracker_users 
        SET last_activity = CURRENT_TIMESTAMP, failed_login_attempts = 0
        WHERE id = p_user_id;
    ELSIF p_login_status = 'failed' THEN
        -- Increment failed login attempts
        UPDATE tracker_users 
        SET failed_login_attempts = failed_login_attempts + 1
        WHERE id = p_user_id;
        
        -- Lock account after 5 failed attempts
        UPDATE tracker_users 
        SET account_status = 'locked', account_locked_until = CURRENT_TIMESTAMP + INTERVAL '30 minutes'
        WHERE id = p_user_id AND failed_login_attempts >= 5;
    END IF;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- VIEWS FOR ADMIN DASHBOARD
-- ============================

-- View for user overview with last login info
CREATE OR REPLACE VIEW admin_user_overview AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.username,
    u.role,
    u.teams,
    u.permissions,
    u.is_active,
    u.account_status,
    u.failed_login_attempts,
    u.account_locked_until,
    u.password_reset_required,
    u.last_password_change,
    u.admin_notes,
    u.created_at,
    u.updated_at,
    u.last_activity,
    ull.login_timestamp as last_login,
    ull.ip_address as last_login_ip,
    creator.full_name as created_by_name
FROM tracker_users u
LEFT JOIN tracker_users creator ON u.created_by = creator.id
LEFT JOIN (
    SELECT DISTINCT ON (user_id) user_id, login_timestamp, ip_address
    FROM user_login_log 
    WHERE login_status = 'success'
    ORDER BY user_id, login_timestamp DESC
) ull ON u.id = ull.user_id
ORDER BY u.created_at DESC;

-- View for recent admin actions
CREATE OR REPLACE VIEW admin_recent_actions AS
SELECT 
    aal.id,
    aal.action_type,
    aal.action_description,
    aal.timestamp,
    admin_user.full_name as admin_name,
    target_user.full_name as target_name,
    aal.ip_address
FROM admin_audit_log aal
JOIN tracker_users admin_user ON aal.admin_user_id = admin_user.id
LEFT JOIN tracker_users target_user ON aal.target_user_id = target_user.id
ORDER BY aal.timestamp DESC
LIMIT 100;

-- ============================
-- SAMPLE DATA (For Testing)
-- ============================

-- Insert sample admin user if not exists
INSERT INTO tracker_users (
    id, email, username, full_name, role, permissions, teams, is_active, account_status, created_at
) VALUES (
    gen_random_uuid(),
    'admin@rvrfc.com',
    'admin',
    'Site Administrator',
    'admin',
    ARRAY['*'],
    ARRAY['*'],
    TRUE,
    'active',
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Admin User Management System database setup completed successfully!';
    RAISE NOTICE 'Tables created: admin_audit_log, user_login_log, password_reset_tokens, user_sessions, role_permissions';
    RAISE NOTICE 'Views created: admin_user_overview, admin_recent_actions';
    RAISE NOTICE 'Functions created: log_admin_action(), log_user_login()';
END $$;