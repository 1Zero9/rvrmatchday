/**
 * Debug API to check actual match data structure
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get recent matches with full data
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'Finished')
      .order('scheduled_date', { ascending: false })
      .limit(3);

    if (matchError) {
      return res.status(500).json({ error: 'Error fetching matches', details: matchError });
    }

    const detailedMatches = [];

    for (const match of matches || []) {
      // Get events for this match
      const { data: events, error: eventsError } = await supabase
        .from('match_events')
        .select('*')
        .eq('match_id', match.id)
        .order('event_minute');

      // Get cards for this match
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .eq('match_id', match.id)
        .order('minute');

      detailedMatches.push({
        match: {
          id: match.id,
          opponent: match.opponent,
          homeScore: match.home_score,
          awayScore: match.away_score,
          venue: match.venue,
          scheduledDate: match.scheduled_date,
          matchType: match.match_type,
          playerOfTheMatch: match.player_of_match,
          referee: match.referee,
          weather: match.weather,
          notes: match.notes,
          selectedSquad: match.selected_squad
        },
        events: events || [],
        cards: cards || [],
        eventsError,
        cardsError
      });
    }

    return res.status(200).json({
      matches: detailedMatches,
      totalMatches: matches?.length || 0
    });

  } catch (error) {
    console.error('Error in debug match data:', error);
    return res.status(500).json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}