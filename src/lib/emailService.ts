/**
 * Email Service - Comprehensive Email Management
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Handles all email notifications for user management workflow
 */

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface AccountRequestNotification {
  adminEmail: string;
  requestId: string;
  applicantName: string;
  applicantEmail: string;
  requestedRole: string;
  teamInterest: string[];
}

export interface ApprovalNotification {
  applicantEmail: string;
  applicantName: string;
  approvedRole: string;
  assignedTeams: string[];
  tempPassword?: string;
  loginUrl: string;
}

export interface RejectionNotification {
  applicantEmail: string;
  applicantName: string;
  requestedRole: string;
  rejectionReason?: string;
}

/**
 * Email Templates
 */
export const emailTemplates = {
  
  // New account request notification to admins
  accountRequestAdmin: (data: AccountRequestNotification): EmailTemplate => ({
    to: data.adminEmail,
    subject: `🆕 New Account Request - ${data.applicantName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">⚽ Rivervalley Rangers AFC</h1>
            <h2 style="color: #374151; margin: 10px 0;">New Account Request</h2>
          </div>
          
          <div style="background: #f3f4f6; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Request Details</h3>
            <p><strong>Name:</strong> ${data.applicantName}</p>
            <p><strong>Email:</strong> ${data.applicantEmail}</p>
            <p><strong>Requested Role:</strong> ${data.requestedRole}</p>
            <p><strong>Team Interest:</strong> ${data.teamInterest.join(', ') || 'None specified'}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/account-admin" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Review Request
            </a>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            <p>Login to the admin panel to approve or deny this request</p>
          </div>
        </div>
      </div>
    `,
    text: `
      New Account Request - Rivervalley Rangers AFC
      
      Name: ${data.applicantName}
      Email: ${data.applicantEmail}
      Requested Role: ${data.requestedRole}
      Team Interest: ${data.teamInterest.join(', ') || 'None specified'}
      
      Review this request at: ${process.env.NEXT_PUBLIC_SITE_URL}/account-admin
    `
  }),

  // Account approval notification to applicant
  accountApproved: (data: ApprovalNotification): EmailTemplate => ({
    to: data.applicantEmail,
    subject: `🎉 Welcome to Rivervalley Rangers AFC!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin: 0;">⚽ Rivervalley Rangers AFC</h1>
            <h2 style="color: #374151; margin: 10px 0;">Account Approved!</h2>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Hi ${data.applicantName},</p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Great news! Your account request has been approved. Welcome to the Rivervalley Rangers AFC family!
          </p>
          
          <div style="background: #f3f4f6; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Account Details</h3>
            <p><strong>Role:</strong> ${data.approvedRole}</p>
            <p><strong>Assigned Teams:</strong> ${data.assignedTeams.join(', ') || 'None assigned yet'}</p>
            ${data.tempPassword ? `<p><strong>Temporary Password:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px;">${data.tempPassword}</code></p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" 
               style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Login to Your Account
            </a>
          </div>
          
          ${data.tempPassword ? `
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;"><strong>Security Note:</strong> Please change your password after your first login.</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            <p>If you have any questions, please contact the club administrator.</p>
          </div>
        </div>
      </div>
    `,
    text: `
      Welcome to Rivervalley Rangers AFC!
      
      Hi ${data.applicantName},
      
      Your account request has been approved!
      
      Role: ${data.approvedRole}
      Assigned Teams: ${data.assignedTeams.join(', ') || 'None assigned yet'}
      ${data.tempPassword ? `Temporary Password: ${data.tempPassword}` : ''}
      
      Login at: ${data.loginUrl}
      
      ${data.tempPassword ? 'Please change your password after your first login.' : ''}
    `
  }),

  // Account rejection notification to applicant
  accountRejected: (data: RejectionNotification): EmailTemplate => ({
    to: data.applicantEmail,
    subject: `📝 Update on Your Account Request`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
        <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">⚽ Rivervalley Rangers AFC</h1>
            <h2 style="color: #374151; margin: 10px 0;">Account Request Update</h2>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">Hi ${data.applicantName},</p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Thank you for your interest in joining Rivervalley Rangers AFC. After reviewing your application for the ${data.requestedRole} role, we are unable to approve your account at this time.
          </p>
          
          ${data.rejectionReason ? `
          <div style="background: #f3f4f6; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Additional Information</h3>
            <p style="margin: 0;">${data.rejectionReason}</p>
          </div>
          ` : ''}
          
          <p style="font-size: 16px; line-height: 1.6;">
            If you have any questions or would like to discuss your application further, please don't hesitate to contact us.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Contact Us
            </a>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
            <p>Thank you for your interest in Rivervalley Rangers AFC</p>
          </div>
        </div>
      </div>
    `,
    text: `
      Account Request Update - Rivervalley Rangers AFC
      
      Hi ${data.applicantName},
      
      Thank you for your interest in joining Rivervalley Rangers AFC. We are unable to approve your account request for the ${data.requestedRole} role at this time.
      
      ${data.rejectionReason ? `Additional Information: ${data.rejectionReason}` : ''}
      
      If you have questions, please contact us at: ${process.env.NEXT_PUBLIC_SITE_URL}/contact
    `
  })
};

/**
 * Send Email Function
 * Uses environment variables to determine email service
 */
export async function sendEmail(template: EmailTemplate): Promise<boolean> {
  try {
    // Use SMTP if configured
    if (process.env.SMTP_HOST) {
      return await sendSMTPEmail(template);
    }
    
    // Use SendGrid if configured
    if (process.env.SENDGRID_API_KEY) {
      return await sendSendGridEmail(template);
    }
    
    // Development mode - log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 EMAIL NOTIFICATION (Development Mode)');
      console.log('To:', template.to);
      console.log('Subject:', template.subject);
      console.log('Content:', template.text);
      console.log('---');
      return true;
    }
    
    console.warn('No email service configured. Set SMTP_HOST or SENDGRID_API_KEY environment variables.');
    return false;
    
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

/**
 * SMTP Email Sending
 */
async function sendSMTPEmail(template: EmailTemplate): Promise<boolean> {
  // Implement SMTP sending using nodemailer
  // This would require: npm install nodemailer @types/nodemailer
  console.log('SMTP email sending not implemented yet. Configure SendGrid or implement SMTP.');
  return false;
}

/**
 * SendGrid Email Sending  
 */
async function sendSendGridEmail(template: EmailTemplate): Promise<boolean> {
  // Implement SendGrid sending
  // This would require: npm install @sendgrid/mail
  console.log('SendGrid email sending not implemented yet. Add @sendgrid/mail package.');
  return false;
}

/**
 * Generate Secure Temporary Password
 */
export function generateTempPassword(length: number = 12): string {
  const charset = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Get Admin Emails for Notifications
 */
export async function getAdminEmails(): Promise<string[]> {
  // This would query the database for admin users
  // For now, use environment variable
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@rvrfc.com';
  return [adminEmail];
}