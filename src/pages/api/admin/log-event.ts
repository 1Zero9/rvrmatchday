/**
 * Admin API - Log Event
 * Server-side endpoint for logging admin events using the comprehensive event logger
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { AdminEventLogger } from '../../../lib/adminEventLogger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const eventData = req.body;

    // Validate required fields
    if (!eventData.admin_user_id || !eventData.event_type || !eventData.action) {
      return res.status(400).json({ 
        error: 'Missing required fields: admin_user_id, event_type, action' 
      });
    }

    // Capture additional context from request
    const clientIp = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.socket.remoteAddress;

    const userAgent = req.headers['user-agent'];

    // Prepare event data for logging
    const logData = {
      adminUserId: eventData.admin_user_id,
      eventType: eventData.event_type,
      action: eventData.action,
      targetType: eventData.target_type,
      targetId: eventData.target_id,
      targetIdentifier: eventData.target_identifier,
      description: eventData.description,
      details: eventData.details || {},
      ipAddress: clientIp as string,
      userAgent: userAgent,
      requestPath: eventData.request_path,
      status: eventData.status || 'success',
      errorMessage: eventData.error_message
    };

    // Log the event using the server-side logger
    const success = await AdminEventLogger.logEvent(logData);

    if (success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Event logged successfully' 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to log event' 
      });
    }

  } catch (error) {
    console.error('Error in log-event API:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}