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
    const { requestId, decision, reviewNotes, permissions, currentUserId } = req.body;

    if (!requestId || !decision || !currentUserId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify current user is admin
    const { data: currentUser, error: authError } = await supabaseAdmin
      .from('tracker_users')
      .select('role')
      .eq('id', currentUserId)
      .single();

    if (authError || currentUser?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Get the account request
    const { data: request, error: requestError } = await supabaseAdmin
      .from('account_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError) {
      return res.status(404).json({ error: 'Account request not found' });
    }

    // Update request status
    const { error: updateError } = await supabaseAdmin
      .from('account_requests')
      .update({
        status: decision,
        reviewed_at: new Date().toISOString(),
        reviewer_notes: reviewNotes
      })
      .eq('id', requestId);

    if (updateError) throw updateError;

    let result = { success: true, tempPassword: null };

    // If approved, create user account
    if (decision === 'approved') {
      // Generate temporary password
      const tempPassword = `RVR${Math.random().toString(36).substring(2, 8).toUpperCase()}!`;
      
      // Create auth account using admin client
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: request.email,
        password: tempPassword,
        email_confirm: true
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        return res.status(500).json({ error: 'Failed to create auth account: ' + authError.message });
      }

      // Determine final role and permissions
      const finalRole = permissions?.admin ? 'admin' : 
                       permissions?.editor ? 'editor' : 
                       request.requested_role;

      const finalPermissions = convertPermissionsToArray(permissions || {});

      // Create user profile
      const { error: profileError } = await supabaseAdmin
        .from('tracker_users')
        .insert({
          id: authData.user.id,
          email: request.email,
          username: request.email.split('@')[0],
          full_name: `${request.first_name} ${request.last_name}`,
          role: finalRole,
          teams: request.team_interest || [],
          permissions: finalPermissions,
          is_active: true
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Try to clean up auth user if profile creation failed
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return res.status(500).json({ error: 'Failed to create user profile: ' + profileError.message });
      }

      result.tempPassword = tempPassword;
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Account approval error:', error);
    res.status(500).json({ error: 'Internal server error: ' + (error as Error).message });
  }
}

function convertPermissionsToArray(permissions: any): string[] {
  const permArray: string[] = [];
  
  if (permissions.admin) {
    return ['all']; // Admin gets everything
  }
  
  if (permissions.editor) {
    permArray.push('view_all', 'edit_content', 'publish_news', 'manage_news');
  }
  
  if (permissions.match_central) {
    permArray.push('view_teams', 'edit_matches', 'view_players', 'record_matches', 'view_match_central');
  }
  
  // Default basic permissions
  if (permArray.length === 0) {
    permArray.push('view_basic');
  }
  
  return permArray;
}

function getPermissionsForRole(role: string): string[] {
  const permissions = {
    admin: ['all'],
    editor: ['view_all', 'edit_content', 'publish_news'],
    coach: ['view_teams', 'edit_matches', 'view_players'],
    manager: ['view_teams', 'edit_matches', 'view_players', 'manage_team']
  };
  
  return permissions[role as keyof typeof permissions] || ['view_basic'];
}