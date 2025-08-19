import { supabase } from './supabase';
import { ChangeLogger } from './changeLog';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

/**
 * Check if the current user has admin privileges
 * This is the core admin authentication function
 */
export async function checkAdminAccess(): Promise<{
  isAdmin: boolean;
  user?: AdminUser;
  error?: string;
}> {
  try {
    // TEMPORARY: Check for dev admin bypass
    if (typeof window !== 'undefined' && localStorage.getItem('temp_admin') === 'true') {
      return {
        isAdmin: true,
        user: {
          id: 'temp-admin',
          email: 'dev@admin.com',
          role: 'admin',
          first_name: 'Dev',
          last_name: 'Admin'
        }
      };
    }

    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { isAdmin: false, error: 'No authenticated user' };
    }

    // Check their profile role in the database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, first_name, last_name')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Profile lookup error:', profileError);
      return { isAdmin: false, error: 'Profile not found' };
    }

    if (!profile || profile.role !== 'admin') {
      // Log unauthorized access attempts
      await ChangeLogger.system(
        'UNAUTHORIZED_ADMIN_ACCESS',
        `User ${user.email} attempted admin access without privileges`,
        { user_id: user.id, user_email: user.email, user_role: profile?.role }
      );
      
      return { isAdmin: false, error: 'Insufficient privileges' };
    }

    // Log successful admin access
    await ChangeLogger.system(
      'ADMIN_ACCESS_GRANTED',
      `Admin ${profile.email} accessed admin area`,
      { 
        admin_id: profile.id,
        admin_email: profile.email,
        session_id: user.id
      }
    );

    return {
      isAdmin: true,
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        first_name: profile.first_name,
        last_name: profile.last_name
      }
    };

  } catch (error) {
    console.error('Admin access check failed:', error);
    return { isAdmin: false, error: 'Authentication system error' };
  }
}

/**
 * Admin middleware component for protecting routes
 * Use this to wrap admin pages
 */
export function useAdminAuth() {
  const [adminState, setAdminState] = useState<{
    loading: boolean;
    isAdmin: boolean;
    user?: AdminUser;
    error?: string;
  }>({
    loading: true,
    isAdmin: false
  });

  useEffect(() => {
    checkAdminAccess().then(result => {
      setAdminState({
        loading: false,
        isAdmin: result.isAdmin,
        user: result.user,
        error: result.error
      });
    });
  }, []);

  return adminState;
}

/**
 * Get all users with their roles for admin management
 */
export async function getAllUsers(limit = 50, offset = 0) {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      throw new Error('Admin access required');
    }

    const { data, error, count } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        role,
        first_name,
        last_name,
        created_at,
        updated_at
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { users: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, newRole: string) {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      throw new Error('Admin access required');
    }

    // Get old user data for logging
    const { data: oldUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Update the role
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    // Log the role change
    await ChangeLogger.updated(
      'profiles',
      userId,
      oldUser,
      data,
      `Role changed from '${oldUser?.role}' to '${newRole}' by admin ${adminCheck.user?.email}`
    );

    return data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

/**
 * Get pending coach approvals for admin review
 */
export async function getPendingCoachApprovals() {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      throw new Error('Admin access required');
    }

    const { data, error } = await supabase
      .from('coach_approvals')
      .select(`
        id,
        status,
        requested_at,
        reviewed_at,
        reviewer_notes,
        coaches!inner (
          id,
          first_name,
          last_name,
          email,
          experience_years,
          qualifications
        )
      `)
      .eq('status', 'pending')
      .order('requested_at', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    throw error;
  }
}

/**
 * Approve or deny a coach application
 */
export async function reviewCoachApproval(
  approvalId: string, 
  decision: 'approved' | 'denied', 
  reviewerNotes?: string
) {
  try {
    const adminCheck = await checkAdminAccess();
    if (!adminCheck.isAdmin) {
      throw new Error('Admin access required');
    }

    // Get the approval record
    const { data: approval, error: approvalError } = await supabase
      .from('coach_approvals')
      .select('*, coaches(*)')
      .eq('id', approvalId)
      .single();

    if (approvalError || !approval) {
      throw new Error('Approval record not found');
    }

    // Update the approval status
    const { error: updateError } = await supabase
      .from('coach_approvals')
      .update({
        status: decision,
        reviewed_at: new Date().toISOString(),
        reviewer_notes: reviewerNotes
      })
      .eq('id', approvalId);

    if (updateError) throw updateError;

    // If approved, update the coach's approved status
    if (decision === 'approved') {
      const { error: coachUpdateError } = await supabase
        .from('coaches')
        .update({ is_approved: true })
        .eq('id', approval.coach_id);

      if (coachUpdateError) throw coachUpdateError;
    }

    // Log the admin action
    await ChangeLogger.system(
      'COACH_APPROVAL_REVIEW',
      `Coach ${approval.coaches.email} ${decision} by admin ${adminCheck.user?.email}`,
      {
        coach_id: approval.coach_id,
        coach_email: approval.coaches.email,
        decision,
        reviewer_notes: reviewerNotes,
        admin_email: adminCheck.user?.email
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error reviewing coach approval:', error);
    throw error;
  }
}

// Re-export for convenience
import { useState, useEffect } from 'react';