-- Test event log entry to verify the table works
INSERT INTO user_management_log (admin_user_id, target_user_id, action, details) 
SELECT 
    admin.id as admin_user_id,
    target.id as target_user_id,
    'test_system' as action,
    '{"message": "Testing event logging system", "timestamp": "' || NOW()::text || '"}' as details
FROM 
    (SELECT id FROM tracker_users WHERE role = 'admin' LIMIT 1) admin,
    (SELECT id FROM tracker_users WHERE role = 'parent' LIMIT 1) target;

-- Check if the insert worked
SELECT 
    uml.*,
    au.full_name as admin_name,
    tu.full_name as target_name
FROM user_management_log uml
LEFT JOIN tracker_users au ON uml.admin_user_id = au.id
LEFT JOIN tracker_users tu ON uml.target_user_id = tu.id
ORDER BY uml.created_at DESC
LIMIT 5;