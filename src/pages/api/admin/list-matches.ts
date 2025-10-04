/**
 * API endpoint to list recent matches for debugging
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📋 Fetching recent matches...');

    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching matches:', error);
      return res.status(500).json({ error: error.message });
    }

    // Transform data for easier reading
    const transformedMatches = matches?.map(match => ({
      id: match.id,
      opponent: match.opponent,
      status: match.status,
      scheduledDate: match.scheduled_date,
      isHomeMatch: match.is_home_match,
      venue: match.venue,
      homeScore: match.home_score,
      awayScore: match.away_score,
      notes: match.notes,
      createdAt: match.created_at
    })) || [];

    console.log('✅ Found matches:', transformedMatches.length);

    res.status(200).json({ 
      success: true, 
      matches: transformedMatches,
      count: transformedMatches.length
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message });
  }
}