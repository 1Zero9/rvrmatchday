/**
 * API endpoint to test and create homepage data
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { createSampleData, checkTables } from '../../lib/test-data';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      console.log('Checking tables...');
      await checkTables();
      
      res.status(200).json({ 
        message: 'Check console for table information',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error checking tables:', error);
      res.status(500).json({ error: 'Failed to check tables' });
    }
  } else if (req.method === 'POST') {
    try {
      console.log('Creating sample data...');
      await createSampleData();
      
      res.status(200).json({ 
        message: 'Sample data created successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating sample data:', error);
      res.status(500).json({ error: 'Failed to create sample data' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}