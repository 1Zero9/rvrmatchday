/**
 * Test Card Addition API
 * Simple endpoint for testing card addition
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { cardManager } from '../../../lib/card-manager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cardData = req.body;
    console.log('🃏 Test API - Adding card with data:', cardData);
    
    const result = await cardManager.addCard(cardData);
    
    if (result) {
      return res.status(200).json({ 
        success: true,
        card: result,
        message: 'Card added successfully'
      });
    } else {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to add card - cardManager returned null'
      });
    }
  } catch (error) {
    console.error('Error in test-add API:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}