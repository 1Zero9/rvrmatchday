/**
 * Match Notifications Utility
 * Handles email notifications for match recordings and status changes
 * Excludes cancelled/postponed matches from notifications
 */

import { Match, MatchStatus } from '@/types/match-tracker';

interface MatchNotificationData {
  match: Match;
  teamName?: string;
  notificationType: 'match_recorded' | 'match_updated' | 'match_cancelled' | 'match_postponed';
  adminNotes?: string;
}

// Check if match status should trigger notifications
export const shouldTriggerNotification = (status: MatchStatus): boolean => {
  // Do NOT send notifications for cancelled or postponed matches
  return status !== 'Cancelled' && status !== 'Postponed';
};

export const sendMatchRecordingNotification = async (data: MatchNotificationData) => {
  try {
    const { match, teamName, notificationType, adminNotes } = data;

    // Skip notifications for cancelled/postponed matches
    if (!shouldTriggerNotification(match.status)) {
      console.log(`🚫 Skipping notification for ${match.status} match:`, match.id);
      return { success: true, message: 'Notification skipped - match cancelled/postponed' };
    }

    const isHomeMatch = match.isHomeMatch;
    const opponent = match.opponent;
    const venue = match.venue;
    const matchDate = new Date(match.scheduledDate).toLocaleDateString();
    const score = match.homeScore !== undefined && match.awayScore !== undefined 
      ? `${match.homeScore} - ${match.awayScore}` 
      : 'In Progress';

    let subjectLine = '';
    let notificationIcon = '';
    let headerColor = '';
    
    switch (notificationType) {
      case 'match_recorded':
        subjectLine = `Match Recorded - ${teamName || 'Team'} vs ${opponent}`;
        notificationIcon = '⚽';
        headerColor = '#10B981, #059669'; // Green gradient
        break;
      case 'match_updated':
        subjectLine = `Match Updated - ${teamName || 'Team'} vs ${opponent}`;
        notificationIcon = '📝';
        headerColor = '#3B82F6, #6366F1'; // Blue gradient
        break;
      case 'match_cancelled':
        subjectLine = `Match Cancelled - ${teamName || 'Team'} vs ${opponent}`;
        notificationIcon = '❌';
        headerColor = '#EF4444, #DC2626'; // Red gradient
        break;
      case 'match_postponed':
        subjectLine = `Match Postponed - ${teamName || 'Team'} vs ${opponent}`;
        notificationIcon = '⏰';
        headerColor = '#F59E0B, #D97706'; // Amber gradient
        break;
    }

    const emailContent = {
      to: ['admin@rvrafc.ie', 'coaches@rvrafc.ie'], // Admin and coach emails
      subject: subjectLine,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, ${headerColor}); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">${notificationIcon} ${notificationType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">River Valley Rangers FC - Match Central</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-top: 0;">Match Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Teams:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">
                    ${teamName || 'RVR'} vs ${opponent}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Match Type:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${match.matchType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Date:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${matchDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Venue:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${venue} ${isHomeMatch ? '(Home)' : '(Away)'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Status:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${match.status}</td>
                </tr>
                ${match.status === 'Finished' ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Final Score:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: bold;">${score}</td>
                </tr>
                ` : ''}
                ${match.cancellationReason ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Reason:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${match.cancellationReason}</td>
                </tr>
                ` : ''}
                ${match.postponedToDate ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Postponed To:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${new Date(match.postponedToDate).toLocaleDateString()}</td>
                </tr>
                ` : ''}
              </table>
              
              ${match.notes ? `
              <div style="margin-top: 20px;">
                <h3 style="color: #1e293b; margin-bottom: 10px;">Match Notes</h3>
                <p style="color: #475569; background: #f1f5f9; padding: 15px; border-radius: 6px; border-left: 4px solid #3B82F6; margin: 0;">
                  "${match.notes}"
                </p>
              </div>
              ` : ''}
              
              ${adminNotes ? `
              <div style="margin-top: 20px;">
                <h3 style="color: #1e293b; margin-bottom: 10px;">Additional Information</h3>
                <p style="color: #475569; background: #f1f5f9; padding: 15px; border-radius: 6px; border-left: 4px solid #3B82F6; margin: 0;">
                  ${adminNotes}
                </p>
              </div>
              ` : ''}
              
              <div style="margin-top: 25px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/match-central" 
                   style="display: inline-block; background: linear-gradient(135deg, #3B82F6, #6366F1); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                  View in Match Central →
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                This is an automated notification from your Match Central system.
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Log the email content (in production, this would send actual email)
    console.log('📧 Match Recording Email Notification:', emailContent);

    return { success: true, message: 'Match notification sent successfully' };
    
  } catch (error) {
    console.error('Error sending match notification:', error);
    return { success: false, error: error.message };
  }
};

// Specific helper functions for different notification types
export const notifyMatchRecorded = (match: Match, teamName?: string) => {
  return sendMatchRecordingNotification({
    match,
    teamName,
    notificationType: 'match_recorded'
  });
};

export const notifyMatchCancelled = (match: Match, teamName?: string, reason?: string) => {
  return sendMatchRecordingNotification({
    match,
    teamName,
    notificationType: 'match_cancelled',
    adminNotes: reason
  });
};

export const notifyMatchPostponed = (match: Match, teamName?: string, reason?: string) => {
  return sendMatchRecordingNotification({
    match,
    teamName,
    notificationType: 'match_postponed',
    adminNotes: reason
  });
};