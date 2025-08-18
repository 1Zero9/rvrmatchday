import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Insert sample venues
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .insert([
        { name: 'Home Ground', address: 'RVR Stadium, Football Lane, City', field_type: 'grass' },
        { name: 'Training Pitch', address: 'Training Complex, City', field_type: 'astro' },
        { name: 'City Park', address: 'City Park, Main Street, City', field_type: 'grass' }
      ])
      .select();

    if (venuesError) throw venuesError;

    // Insert sample opponents
    const { data: opponents, error: opponentsError } = await supabase
      .from('opponents')
      .insert([
        { name: 'Riverside FC', location: 'Riverside' },
        { name: 'Valley United', location: 'Valley Town' },
        { name: 'City Rangers', location: 'City Center' },
        { name: 'Forest Hills FC', location: 'Forest Hills' },
        { name: 'Coastal Athletic', location: 'Coastal Bay' }
      ])
      .select();

    if (opponentsError) throw opponentsError;

    // Insert sample teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .insert([
        { 
          name: 'RVR Dragons U12', 
          age_group: 'U12', 
          season: '2024-25',
          description: 'Our competitive U12 boys team'
        },
        { 
          name: 'RVR Lightning U10', 
          age_group: 'U10', 
          season: '2024-25',
          description: 'Fast and fun U10 development team'
        },
        { 
          name: 'RVR Wildcats U14 Girls', 
          age_group: 'U14', 
          season: '2024-25',
          description: 'Our talented girls team'
        },
        { 
          name: 'RVR Seniors', 
          age_group: 'Senior', 
          season: '2024-25',
          description: 'First team senior squad'
        }
      ])
      .select();

    if (teamsError) throw teamsError;

    // Insert sample matches
    const upcomingMatches = [
      {
        team_id: teams[0].id,
        opponent_id: opponents[0].id,
        venue_id: venues[0].id,
        match_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next week
        status: 'scheduled',
        home_away: 'home'
      },
      {
        team_id: teams[1].id,
        opponent_id: opponents[1].id,
        venue_id: venues[2].id,
        match_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // Two weeks
        status: 'scheduled',
        home_away: 'away'
      },
      {
        team_id: teams[0].id,
        opponent_id: opponents[2].id,
        venue_id: venues[0].id,
        match_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last week
        status: 'finished',
        home_away: 'home',
        our_score: 3,
        their_score: 1,
        notes: 'Great team performance! Excellent passing and defending.'
      }
    ];

    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .insert(upcomingMatches)
      .select();

    if (matchesError) throw matchesError;

    // Insert sample news
    const { data: news, error: newsError } = await supabase
      .from('news')
      .insert([
        {
          title: 'Season Kickoff - Registration Now Open!',
          content: 'We\'re excited to announce that registration for the 2024-25 season is now open! Join RVR FC and be part of our football family.',
          excerpt: 'Registration for the new season is now open. Don\'t miss out!',
          published: true,
          tags: ['registration', 'season', 'announcement']
        },
        {
          title: 'U12 Dragons Win Big Against Riverside FC',
          content: 'Our U12 Dragons showed incredible teamwork and skill in their 3-1 victory over Riverside FC. Goals from Tommy, Sarah, and Alex secured the win!',
          excerpt: 'U12 Dragons secure impressive 3-1 victory with excellent team play.',
          published: true,
          tags: ['match-report', 'u12', 'victory']
        },
        {
          title: 'New Training Facilities Opening Soon',
          content: 'We\'re thrilled to announce that our new astro training pitch will be ready next month, giving our players even better facilities to develop their skills.',
          excerpt: 'New training facilities coming next month with improved astro pitch.',
          published: true,
          tags: ['facilities', 'training', 'development']
        }
      ])
      .select();

    if (newsError) throw newsError;

    // Insert sample events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .insert([
        {
          title: 'Family Fun Day',
          description: 'Join us for a day of football activities, BBQ, and family fun! All ages welcome.',
          event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // Three weeks
          location: 'RVR Stadium',
          event_type: 'social',
          registration_required: true,
          max_attendees: 100
        },
        {
          title: 'Goalkeeper Training Session',
          description: 'Specialized training for goalkeepers of all ages. Bring gloves!',
          event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days
          location: 'Training Pitch',
          event_type: 'training',
          registration_required: true,
          max_attendees: 12
        }
      ])
      .select();

    if (eventsError) throw eventsError;

    res.status(200).json({ 
      success: true,
      message: 'Sample data created successfully!',
      data: {
        venues: venues.length,
        opponents: opponents.length,
        teams: teams.length,
        matches: matches.length,
        news: news.length,
        events: events.length
      }
    });

  } catch (error: any) {
    console.error('Seed data error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
}