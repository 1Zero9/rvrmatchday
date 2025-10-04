/**
 * API endpoint to add cancellation fields to matches table
 * Run once to update database schema
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔧 Starting database migration for cancellation fields...');

    // Add cancellation_reason column
    const { error: reasonError } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE matches 
        ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
      `
    });

    if (reasonError) {
      console.error('Error adding cancellation_reason column:', reasonError);
      // Try alternative approach
      const { error: altReasonError } = await supabase
        .from('matches')
        .select('cancellation_reason')
        .limit(1);

      if (altReasonError && altReasonError.message.includes('column "cancellation_reason" does not exist')) {
        return res.status(500).json({ 
          error: 'Failed to add cancellation_reason column. Please run SQL manually.',
          sql: 'ALTER TABLE matches ADD COLUMN cancellation_reason TEXT;'
        });
      }
    }

    // Add postponed_to_date column
    const { error: dateError } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE matches 
        ADD COLUMN IF NOT EXISTS postponed_to_date TIMESTAMPTZ;
      `
    });

    if (dateError) {
      console.error('Error adding postponed_to_date column:', dateError);
      // Try alternative approach
      const { error: altDateError } = await supabase
        .from('matches')
        .select('postponed_to_date')
        .limit(1);

      if (altDateError && altDateError.message.includes('column "postponed_to_date" does not exist')) {
        return res.status(500).json({ 
          error: 'Failed to add postponed_to_date column. Please run SQL manually.',
          sql: 'ALTER TABLE matches ADD COLUMN postponed_to_date TIMESTAMPTZ;'
        });
      }
    }

    // Verify columns exist by trying to select them
    const { data: testData, error: testError } = await supabase
      .from('matches')
      .select('id, cancellation_reason, postponed_to_date')
      .limit(1);

    if (testError) {
      console.error('Error verifying columns:', testError);
      return res.status(500).json({ 
        error: 'Migration may have failed. Please check database.',
        details: testError.message
      });
    }

    console.log('✅ Migration completed successfully');

    res.status(200).json({ 
      success: true, 
      message: 'Database migration completed successfully',
      columnsAdded: ['cancellation_reason', 'postponed_to_date'],
      testQuery: testData ? 'Columns verified' : 'No data to test with'
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      error: 'Migration failed', 
      details: error.message,
      manualSQL: `
        -- Run this SQL manually in Supabase:
        ALTER TABLE matches ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
        ALTER TABLE matches ADD COLUMN IF NOT EXISTS postponed_to_date TIMESTAMPTZ;
      `
    });
  }
}