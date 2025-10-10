/**
 * Special Events API - Placeholder for missing table
 * Returns empty array to prevent 400 errors
 */

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Return empty array for now - table doesn't exist yet
    return res.status(200).json({
      success: true,
      data: [],
      count: 0,
      message: 'Special events table not yet implemented'
    });
  } catch (error) {
    console.error('Special events API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: (error as Error).message
    });
  }
}