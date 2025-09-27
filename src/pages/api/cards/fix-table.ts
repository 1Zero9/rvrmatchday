/**
 * Cards Table Fix API
 * Adds missing columns to the existing cards table
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // SQL to add all missing columns to make the table compatible
    const alterTableSQL = `
      -- Add missing columns to cards table
      DO $$ 
      BEGIN
        -- Add player_name column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='player_name') THEN
          ALTER TABLE public.cards ADD COLUMN player_name text NULL;
        END IF;
        
        -- Add is_automatic_red column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='is_automatic_red') THEN
          ALTER TABLE public.cards ADD COLUMN is_automatic_red boolean DEFAULT false;
        END IF;
        
        -- Add is_straight_red column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='is_straight_red') THEN
          ALTER TABLE public.cards ADD COLUMN is_straight_red boolean DEFAULT false;
        END IF;
        
        -- Add submitted_to_authority column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='submitted_to_authority') THEN
          ALTER TABLE public.cards ADD COLUMN submitted_to_authority boolean DEFAULT false;
        END IF;
        
        -- Add submission_date column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='submission_date') THEN
          ALTER TABLE public.cards ADD COLUMN submission_date timestamp NULL;
        END IF;
        
        -- Add ban_games column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cards' AND column_name='ban_games') THEN
          ALTER TABLE public.cards ADD COLUMN ban_games integer NULL;
        END IF;
      END $$;
    `;

    // Execute the SQL using a raw SQL query
    const { data, error } = await supabase.rpc('exec_sql', { sql: alterTableSQL });

    if (error) {
      console.error('Failed to alter cards table:', error);
      
      // Provide manual SQL for user to run
      const manualSQL = `
-- Run this SQL in your Supabase SQL Editor to fix the cards table:

-- Add missing columns
ALTER TABLE public.cards 
  ADD COLUMN IF NOT EXISTS player_name text NULL,
  ADD COLUMN IF NOT EXISTS is_automatic_red boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_straight_red boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS submitted_to_authority boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS submission_date timestamp NULL,
  ADD COLUMN IF NOT EXISTS ban_games integer NULL;
      `;
      
      return res.status(200).json({ 
        success: false,
        error: 'Could not automatically fix table',
        details: error,
        manualSQL,
        instructions: [
          '1. Copy the SQL above',
          '2. Go to your Supabase dashboard > SQL Editor',
          '3. Paste and run the SQL',
          '4. Try adding cards again'
        ]
      });
    }

    // Test if the table now works
    const testCard = {
      match_id: '00000000-0000-0000-0000-000000000000',
      minute: 1,
      player_name: 'Test Player',
      team_side: 'ours',
      card: 'yellow',
      reason: 'Test',
      is_automatic_red: false,
      is_straight_red: false,
      submitted_to_authority: false
    };

    const { data: testData, error: testError } = await supabase
      .from('cards')
      .insert([testCard])
      .select()
      .single();

    if (testError) {
      return res.status(200).json({ 
        success: false,
        tableFixed: true,
        testError,
        message: 'Table was updated but test insert still failed'
      });
    }

    // Clean up test data
    if (testData) {
      await supabase.from('cards').delete().eq('id', testData.id);
    }

    return res.status(200).json({ 
      success: true,
      message: 'Cards table fixed successfully',
      tableFixed: true,
      testPassed: true
    });

  } catch (error) {
    console.error('Error fixing cards table:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fix cards table',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}