/**
 * Email Notifications Utility
 * For sending email alerts to admins about new volunteer signups
 */

interface VolunteerSignup {
  volunteer_name: string;
  volunteer_email: string;
  volunteer_phone?: string;
  opportunity_title?: string;
  motivation?: string;
  signed_up_at: string;
}

export const sendVolunteerSignupNotification = async (signup: VolunteerSignup) => {
  try {
    // This is a basic implementation - in production, you'd use a service like:
    // - SendGrid, Mailgun, AWS SES, or Supabase Edge Functions
    // - For now, we'll log to console and could use a webhook service
    
    const emailContent = {
      to: ['admin@rvrafc.ie', 'volunteers@rvrafc.ie'], // Admin emails
      subject: `New Volunteer Signup - ${signup.volunteer_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #6366F1); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🤝 New Volunteer Signup</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">River Valley Rangers FC</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-top: 0;">Volunteer Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${signup.volunteer_name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Email:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${signup.volunteer_email}</td>
                </tr>
                ${signup.volunteer_phone ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Phone:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${signup.volunteer_phone}</td>
                </tr>
                ` : ''}
                ${signup.opportunity_title ? `
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Opportunity:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${signup.opportunity_title}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #475569;">Signed up:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${new Date(signup.signed_up_at).toLocaleString()}</td>
                </tr>
              </table>
              
              ${signup.motivation ? `
              <div style="margin-top: 20px;">
                <h3 style="color: #1e293b; margin-bottom: 10px;">Motivation</h3>
                <p style="color: #475569; background: #f1f5f9; padding: 15px; border-radius: 6px; border-left: 4px solid #3B82F6; margin: 0;">
                  "${signup.motivation}"
                </p>
              </div>
              ` : ''}
              
              <div style="margin-top: 25px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/volunteers" 
                   style="display: inline-block; background: linear-gradient(135deg, #3B82F6, #6366F1); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                  Review Signup →
                </a>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #64748b; font-size: 14px; margin: 0;">
                This is an automated notification from your volunteer management system.
              </p>
            </div>
          </div>
        </div>
      `
    };

    // Log the email content (in production, this would send actual email)
    console.log('📧 Volunteer Signup Email Notification:', emailContent);

    // For demo purposes, you could integrate with:
    // 1. A webhook service like Zapier or Make.com
    // 2. Send to a Slack channel
    // 3. Use a serverless function for actual email sending
    
    // Example webhook call (uncomment and configure for production):
    /*
    const webhookUrl = process.env.VOLUNTEER_NOTIFICATION_WEBHOOK;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `New volunteer signup: ${signup.volunteer_name} for ${signup.opportunity_title}`,
          email: emailContent
        })
      });
    }
    */

    return { success: true, message: 'Notification sent successfully' };
    
  } catch (error) {
    console.error('Error sending volunteer notification:', error);
    return { success: false, error: error.message };
  }
};

export const sendVolunteerStatusUpdate = async (
  volunteerEmail: string, 
  volunteerName: string, 
  opportunityTitle: string, 
  status: 'approved' | 'rejected',
  adminNotes?: string
) => {
  try {
    const isApproved = status === 'approved';
    
    const emailContent = {
      to: [volunteerEmail],
      subject: `Volunteer Application ${isApproved ? 'Approved' : 'Update'} - ${opportunityTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, ${isApproved ? '#10B981, #059669' : '#EF4444, #DC2626'}); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">${isApproved ? '✅' : '📋'} Volunteer Application Update</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">River Valley Rangers FC</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <h2 style="color: #1e293b; margin-top: 0;">Hi ${volunteerName},</h2>
              
              <p style="color: #475569; line-height: 1.6;">
                Thank you for your interest in volunteering with River Valley Rangers FC. 
                We have reviewed your application for <strong>${opportunityTitle}</strong>.
              </p>
              
              ${isApproved ? `
                <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="color: #15803d; margin: 0; font-weight: bold;">
                    🎉 Great news! Your volunteer application has been approved.
                  </p>
                </div>
                
                <p style="color: #475569; line-height: 1.6;">
                  We're excited to have you join our volunteer team! You'll receive further details about 
                  next steps and any required training sessions shortly.
                </p>
              ` : `
                <div style="background: #fef2f2; border: 1px solid #ef4444; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="color: #dc2626; margin: 0; font-weight: bold;">
                    We appreciate your interest, but we're unable to proceed with your application at this time.
                  </p>
                </div>
              `}
              
              ${adminNotes ? `
                <div style="margin: 20px 0;">
                  <h3 style="color: #1e293b; margin-bottom: 10px;">Additional Information</h3>
                  <p style="color: #475569; background: #f1f5f9; padding: 15px; border-radius: 6px; border-left: 4px solid #3B82F6; margin: 0;">
                    ${adminNotes}
                  </p>
                </div>
              ` : ''}
              
              <p style="color: #475569; line-height: 1.6; margin-top: 20px;">
                ${isApproved ? 
                  'If you have any questions, please don\'t hesitate to contact us at volunteers@rvrafc.ie.' :
                  'Thank you again for your interest. Please feel free to apply for other volunteer opportunities in the future.'
                }
              </p>
              
              <div style="margin-top: 25px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/volunteering" 
                   style="display: inline-block; background: linear-gradient(135deg, #3B82F6, #6366F1); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                  View More Opportunities →
                </a>
              </div>
            </div>
          </div>
        </div>
      `
    };

    console.log('📧 Volunteer Status Email:', emailContent);
    
    return { success: true, message: 'Status notification sent successfully' };
    
  } catch (error) {
    console.error('Error sending volunteer status notification:', error);
    return { success: false, error: error.message };
  }
};