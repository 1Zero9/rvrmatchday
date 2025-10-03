import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { authenticateAdmin, checkRateLimit } from '../../../lib/adminAuth';

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

interface AdminAction {
  adminUserId: string;
  targetUserId?: string;
  actionType: string;
  actionDescription: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

// Helper function to log admin actions
async function logAdminAction(action: AdminAction) {
  try {
    // TODO: Implement audit logging when database functions are available
    console.log('Admin action logged:', action);
    /*
    await supabase.rpc('log_admin_action', {
      p_admin_user_id: action.adminUserId,
      p_target_user_id: action.targetUserId || null,
      p_action_type: action.actionType,
      p_action_description: action.actionDescription,
      p_old_values: action.oldValues || null,
      p_new_values: action.newValues || null,
      p_ip_address: action.ipAddress || null,
      p_user_agent: action.userAgent || null,
      p_session_id: action.sessionId || null
    });
    */
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

// Helper function to get user IP address
function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]) : req.socket.remoteAddress;
  return ip || 'unknown';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // SECURITY: Rate limiting
  if (!checkRateLimit(req, 50, 15 * 60 * 1000)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // SECURITY: Authenticate all admin endpoints
  const authResult = await authenticateAdmin(req);
  if (!authResult.isValid) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: authResult.error 
    });
  }

  try {
    switch (method) {
      case 'GET':
        return await handleGetUsers(req, res);
      case 'POST':
        return await handleUserAction(req, res);
      case 'PUT':
        return await handleUpdateUser(req, res);
      case 'DELETE':
        return await handleDeleteUser(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/admin/user-management - Get all users with detailed information
async function handleGetUsers(req: NextApiRequest, res: NextApiResponse) {
  // Fetch users directly from tracker_users table using admin client
  const { data: users, error } = await supabaseAdmin
    .from('tracker_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }

  // Get user statistics
  const statistics = {
    totalUsers: users?.length || 0,
    activeUsers: users?.filter(u => u.is_active)?.length || 0,
    inactiveUsers: users?.filter(u => !u.is_active)?.length || 0,
    lockedUsers: users?.filter(u => u.account_status === 'locked')?.length || 0,
    adminUsers: users?.filter(u => u.role === 'admin')?.length || 0,
    recentLogins: users?.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))?.length || 0
  };

  return res.status(200).json({ users, statistics });
}

// POST /api/admin/user-management - Perform user actions
async function handleUserAction(req: NextApiRequest, res: NextApiResponse) {
  const { action, userId, adminUserId, data } = req.body;
  
  if (!action || !userId || !adminUserId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const clientIP = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  try {
    switch (action) {
      case 'activate':
        return await activateUser(userId, adminUserId, clientIP, userAgent, res);
      
      case 'deactivate':
        return await deactivateUser(userId, adminUserId, clientIP, userAgent, res);
      
      case 'lock':
        return res.status(400).json({ error: 'Lock feature requires enhanced database schema' });
      
      case 'unlock':
        return res.status(400).json({ error: 'Unlock feature requires enhanced database schema' });
      
      case 'reset_password':
        return await resetUserPassword(userId, adminUserId, clientIP, userAgent, res);
      
      case 'force_password_change':
        return await forcePasswordChange(userId, adminUserId, clientIP, userAgent, res);
      
      case 'clear_login_attempts':
        return await clearFailedLoginAttempts(userId, adminUserId, clientIP, userAgent, res);
      
      case 'terminate_sessions':
        return await terminateUserSessions(userId, adminUserId, clientIP, userAgent, res);
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('User action error:', error);
    return res.status(500).json({ error: 'Failed to perform action' });
  }
}

// PUT /api/admin/user-management - Update user details
async function handleUpdateUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId, adminUserId, updates } = req.body;
  
  if (!userId || !adminUserId || !updates) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Get current user data for audit log
  const { data: currentUser } = await supabase
    .from('tracker_users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!currentUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Update user
  const { data: updatedUser, error } = await supabase
    .from('tracker_users')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }

  // Log the action
  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'user_updated',
    actionDescription: `User ${currentUser.full_name} updated`,
    oldValues: currentUser,
    newValues: updatedUser,
    ipAddress: getClientIP(req),
    userAgent: req.headers['user-agent']
  });

  return res.status(200).json({ success: true, user: updatedUser });
}

// DELETE /api/admin/user-management - Delete user
async function handleDeleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { userId, adminUserId, reason } = req.body;
  
  if (!userId || !adminUserId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Get user data for audit log
  const { data: user } = await supabase
    .from('tracker_users')
    .select('*')
    .eq('id', userId)
    .single();

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Soft delete - set as inactive and add deletion marker
  const { error } = await supabase
    .from('tracker_users')
    .update({
      is_active: false,
      account_status: 'inactive',
      admin_notes: `${user.admin_notes || ''}\n[DELETED ${new Date().toISOString()}] ${reason || 'No reason provided'}`,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }

  // Log the action
  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'user_deleted',
    actionDescription: `User ${user.full_name} deleted. Reason: ${reason || 'No reason provided'}`,
    oldValues: user,
    ipAddress: getClientIP(req),
    userAgent: req.headers['user-agent']
  });

  return res.status(200).json({ success: true, message: 'User deleted successfully' });
}

// Helper functions for specific actions
async function activateUser(userId: string, adminUserId: string, ip: string, userAgent: string, res: NextApiResponse) {
  // First check if user exists
  const { data: existingUser, error: checkError } = await supabaseAdmin
    .from('tracker_users')
    .select('id, full_name, is_active')
    .eq('id', userId)
    .single();

  if (checkError || !existingUser) {
    throw new Error(`User not found: ${userId}`);
  }

  const { data: user, error } = await supabaseAdmin
    .from('tracker_users')
    .update({
      is_active: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'user_activated',
    actionDescription: `User ${user.full_name} activated`,
    newValues: { account_status: 'active', is_active: true },
    ipAddress: ip,
    userAgent
  });

  return res.status(200).json({ success: true, message: 'User activated successfully' });
}

async function deactivateUser(userId: string, adminUserId: string, ip: string, userAgent: string, res: NextApiResponse) {
  // First check if user exists
  const { data: existingUser, error: checkError } = await supabaseAdmin
    .from('tracker_users')
    .select('id, full_name, is_active')
    .eq('id', userId)
    .single();

  if (checkError || !existingUser) {
    throw new Error(`User not found: ${userId}`);
  }

  const { data: user, error } = await supabaseAdmin
    .from('tracker_users')
    .update({
      is_active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'user_suspended',
    actionDescription: `User ${user.full_name} deactivated`,
    newValues: { account_status: 'inactive', is_active: false },
    ipAddress: ip,
    userAgent
  });

  return res.status(200).json({ success: true, message: 'User deactivated successfully' });
}

async function lockUser(userId: string, adminUserId: string, reason: string, ip: string, userAgent: string, res: NextApiResponse) {
  const lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const { data: user, error } = await supabase
    .from('tracker_users')
    .update({
      account_status: 'locked',
      account_locked_until: lockUntil.toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'account_locked',
    actionDescription: `User ${user.full_name} locked until ${lockUntil.toLocaleString()}. Reason: ${reason || 'No reason provided'}`,
    newValues: { account_status: 'locked', account_locked_until: lockUntil.toISOString() },
    ipAddress: ip,
    userAgent
  });

  return res.status(200).json({ success: true, message: 'User account locked successfully' });
}

async function unlockUser(userId: string, adminUserId: string, ip: string, userAgent: string, res: NextApiResponse) {
  const { data: user, error } = await supabase
    .from('tracker_users')
    .update({
      account_status: 'active',
      account_locked_until: null,
      failed_login_attempts: 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'account_unlocked',
    actionDescription: `User ${user.full_name} unlocked`,
    newValues: { account_status: 'active', account_locked_until: null, failed_login_attempts: 0 },
    ipAddress: ip,
    userAgent
  });

  return res.status(200).json({ success: true, message: 'User account unlocked successfully' });
}

async function resetUserPassword(userId: string, adminUserId: string, ip: string, userAgent: string, res: NextApiResponse) {
  // Generate temporary password
  const tempPassword = generateSecurePassword();
  
  // Update password in Supabase Auth using admin client
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: tempPassword
  });

  if (authError) throw authError;

  // Update user record (basic fields only)
  const { data: user } = await supabaseAdmin
    .from('tracker_users')
    .update({
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'password_reset',
    actionDescription: `Password reset for user ${user.full_name}`,
    ipAddress: ip,
    userAgent
  });

  return res.status(200).json({ 
    success: true, 
    message: 'Password reset successfully',
    tempPassword: tempPassword
  });
}

async function forcePasswordChange(userId: string, adminUserId: string, ip: string, userAgent: string, res: NextApiResponse) {
  const { data: user, error } = await supabase
    .from('tracker_users')
    .update({
      password_reset_required: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'password_reset',
    actionDescription: `Force password change required for user ${user.full_name}`,
    ipAddress: ip,
    userAgent
  });

  return res.status(200).json({ success: true, message: 'User will be required to change password on next login' });
}

async function clearFailedLoginAttempts(userId: string, adminUserId: string, ip: string, userAgent: string, res: NextApiResponse) {
  const { data: user, error } = await supabase
    .from('tracker_users')
    .update({
      failed_login_attempts: 0,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'login_attempt_reset',
    actionDescription: `Failed login attempts cleared for user ${user.full_name}`,
    ipAddress: ip,
    userAgent
  });

  return res.status(200).json({ success: true, message: 'Failed login attempts cleared' });
}

async function terminateUserSessions(userId: string, adminUserId: string, ip: string, userAgent: string, res: NextApiResponse) {
  // Terminate all active sessions
  const { error } = await supabase
    .from('user_sessions')
    .update({
      is_active: false,
      terminated_by: adminUserId,
      terminated_at: new Date().toISOString(),
      termination_reason: 'Admin terminated'
    })
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) throw error;

  const { data: user } = await supabase
    .from('tracker_users')
    .select('full_name')
    .eq('id', userId)
    .single();

  await logAdminAction({
    adminUserId,
    targetUserId: userId,
    actionType: 'user_updated',
    actionDescription: `All sessions terminated for user ${user?.full_name}`,
    ipAddress: ip,
    userAgent
  });

  return res.status(200).json({ success: true, message: 'All user sessions terminated' });
}

function generateSecurePassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  let password = '';
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 4; i < 12; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
}