/**
 * Email Notification API - Send User Management Emails
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  sendEmail, 
  emailTemplates, 
  generateTempPassword,
  getAdminEmails,
  type AccountRequestNotification,
  type ApprovalNotification,
  type RejectionNotification
} from '../../../lib/emailService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    switch (type) {
      case 'account_request_admin':
        return await handleAccountRequestAdmin(req, res, data);
      
      case 'account_approved':
        return await handleAccountApproved(req, res, data);
      
      case 'account_rejected':
        return await handleAccountRejected(req, res, data);
      
      default:
        return res.status(400).json({ error: 'Invalid notification type' });
    }

  } catch (error) {
    console.error('Email notification error:', error);
    return res.status(500).json({ error: 'Failed to send notification' });
  }
}

/**
 * Handle new account request notification to admins
 */
async function handleAccountRequestAdmin(req: NextApiRequest, res: NextApiResponse, data: any) {
  const { requestId, applicantName, applicantEmail, requestedRole, teamInterest } = data;

  if (!requestId || !applicantName || !applicantEmail || !requestedRole) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const adminEmails = await getAdminEmails();
  const results = [];

  for (const adminEmail of adminEmails) {
    const notificationData: AccountRequestNotification = {
      adminEmail,
      requestId,
      applicantName,
      applicantEmail,
      requestedRole,
      teamInterest: teamInterest || []
    };

    const template = emailTemplates.accountRequestAdmin(notificationData);
    const sent = await sendEmail(template);
    
    results.push({
      to: adminEmail,
      sent,
      type: 'account_request_admin'
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Admin notifications sent',
    results
  });
}

/**
 * Handle account approval notification to applicant
 */
async function handleAccountApproved(req: NextApiRequest, res: NextApiResponse, data: any) {
  const { 
    applicantEmail, 
    applicantName, 
    approvedRole, 
    assignedTeams, 
    generatePassword = true 
  } = data;

  if (!applicantEmail || !applicantName || !approvedRole) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const tempPassword = generatePassword ? generateTempPassword() : undefined;
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth-login`;

  const notificationData: ApprovalNotification = {
    applicantEmail,
    applicantName,
    approvedRole,
    assignedTeams: assignedTeams || [],
    tempPassword,
    loginUrl
  };

  const template = emailTemplates.accountApproved(notificationData);
  const sent = await sendEmail(template);

  return res.status(200).json({
    success: true,
    message: 'Approval notification sent',
    sent,
    tempPassword: tempPassword // Return for admin to set in user account
  });
}

/**
 * Handle account rejection notification to applicant
 */
async function handleAccountRejected(req: NextApiRequest, res: NextApiResponse, data: any) {
  const { applicantEmail, applicantName, requestedRole, rejectionReason } = data;

  if (!applicantEmail || !applicantName || !requestedRole) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const notificationData: RejectionNotification = {
    applicantEmail,
    applicantName,
    requestedRole,
    rejectionReason
  };

  const template = emailTemplates.accountRejected(notificationData);
  const sent = await sendEmail(template);

  return res.status(200).json({
    success: true,
    message: 'Rejection notification sent',
    sent
  });
}