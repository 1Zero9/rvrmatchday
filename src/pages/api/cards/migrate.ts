/**
 * Cards Table Migration API
 * Simple endpoint to create the cards table
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test if cards table exists
    const { data: testData, error: testError } = await supabase
      .from('cards')
      .select('count', { count: 'exact', head: true });

    if (!testError) {
      return res.status(200).json({ 
        message: 'Cards table already exists',
        tableExists: true,
        recordCount: testData || 0
      });
    }

    // Table doesn't exist, provide setup instructions
    const setupSQL = `
-- Run this SQL in your Supabase SQL Editor:

CREATE TABLE public.cards (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  match_id uuid NULL,
  minute integer NULL,
  player_id uuid NULL,
  player_name text NULL,
  team_side text NOT NULL,
  card text NOT NULL,
  reason text NULL,
  is_automatic_red boolean DEFAULT false,
  is_straight_red boolean DEFAULT false,
  submitted_to_authority boolean DEFAULT false,
  submission_date timestamp NULL,
  ban_games integer NULL,
  created_at timestamp DEFAULT NOW(),
  CONSTRAINT cards_pkey PRIMARY KEY (id),
  CONSTRAINT cards_card_check CHECK ((card = ANY (ARRAY['yellow'::text, 'red'::text]))),
  CONSTRAINT cards_team_side_check CHECK ((team_side = ANY (ARRAY['ours'::text, 'theirs'::text])))
);

-- Optional: Add some sample data for testing
INSERT INTO public.cards (match_id, minute, player_name, team_side, card, reason) VALUES
  ('00000000-0000-0000-0000-000000000000', 25, 'Test Player', 'ours', 'yellow', 'Unsporting behaviour');
`;

    return res.status(200).json({
      message: 'Cards table does not exist',
      tableExists: false,
      setupInstructions: 'Go to your Supabase dashboard > SQL Editor and run the provided SQL',
      sql: setupSQL,
      steps: [
        '1. Open your Supabase dashboard',
        '2. Go to SQL Editor',
        '3. Copy and paste the SQL provided in the "sql" field',
        '4. Click "Run" to execute',
        '5. Refresh this page to verify the table was created'
      ]
    });

  } catch (error) {
    console.error('Error checking cards table:', error);
    return res.status(500).json({ 
      error: 'Failed to check cards table',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}