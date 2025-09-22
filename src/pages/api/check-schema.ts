/**
 * API endpoint to check database schema
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check teams table structure
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .limit(1);
    
    console.log('Teams table sample:', teams);
    
    // Check matches table structure
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .limit(1);
    
    console.log('Matches table sample:', matches);
    
    if (teamsError) console.log('Teams error:', teamsError);
    if (matchesError) console.log('Matches error:', matchesError);
    
    res.status(200).json({ 
      teams: teams?.[0] || 'no data',
      matches: matches?.[0] || 'no data',
      teamsError,
      matchesError
    });
  } catch (error) {
    console.error('Schema check error:', error);
    res.status(500).json({ error: 'Failed to check schema' });
  }
}