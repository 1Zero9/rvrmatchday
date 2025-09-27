/**
 * Cards Table Setup API
 * Creates the cards table if it doesn't exist
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if cards table exists by trying a simple query
    const { data, error: checkError } = await supabase
      .from('cards')
      .select('id')
      .limit(1);

    if (checkError) {
      console.log('Cards table does not exist or has error:', checkError);
      
      // Try to create the table using raw SQL
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.cards (
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
      `;

      const { data: createData, error: createError } = await supabase.rpc('exec_sql', { 
        sql: createTableSQL 
      });

      if (createError) {
        console.error('Failed to create cards table:', createError);
        return res.status(500).json({ 
          error: 'Failed to create cards table',
          details: createError 
        });
      }

      return res.status(200).json({ 
        message: 'Cards table created successfully',
        tableExists: false,
        created: true
      });
    }

    // Table exists
    return res.status(200).json({ 
      message: 'Cards table already exists',
      tableExists: true,
      created: false,
      sampleData: data
    });

  } catch (error) {
    console.error('Error in cards setup:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error 
    });
  }
}