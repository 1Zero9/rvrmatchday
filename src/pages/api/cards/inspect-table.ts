/**
 * Cards Table Inspector API
 * Check the actual structure of the cards table
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to get any sample data and see what columns exist
    const { data: sampleData, error: sampleError } = await supabase
      .from('cards')
      .select('*')
      .limit(1);

    if (sampleError) {
      return res.status(500).json({ 
        error: 'Error querying cards table',
        details: sampleError
      });
    }

    // Try to insert a minimal record to see what columns are required/optional
    const testInsert = {
      match_id: '00000000-0000-0000-0000-000000000000',
      minute: 1,
      player_name: 'Test',
      team_side: 'ours',
      card: 'yellow'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('cards')
      .insert([testInsert])
      .select()
      .single();

    if (insertError) {
      return res.status(200).json({ 
        message: 'Table structure analysis',
        sampleData,
        testInsertError: insertError,
        missingColumns: extractMissingColumns(insertError.message),
        suggestedFix: generateAlterTableSQL(insertError.message)
      });
    }

    // If insert worked, clean it up
    if (insertData) {
      await supabase.from('cards').delete().eq('id', insertData.id);
    }

    return res.status(200).json({ 
      message: 'Table structure is compatible',
      sampleData,
      testInsertSucceeded: true,
      insertedData: insertData
    });

  } catch (error) {
    console.error('Error inspecting cards table:', error);
    return res.status(500).json({ 
      error: 'Failed to inspect cards table',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function extractMissingColumns(errorMessage: string): string[] {
  const missingColumns = [];
  if (errorMessage.includes('is_automatic_red')) missingColumns.push('is_automatic_red');
  if (errorMessage.includes('is_straight_red')) missingColumns.push('is_straight_red');
  if (errorMessage.includes('submitted_to_authority')) missingColumns.push('submitted_to_authority');
  if (errorMessage.includes('submission_date')) missingColumns.push('submission_date');
  if (errorMessage.includes('ban_games')) missingColumns.push('ban_games');
  return missingColumns;
}

function generateAlterTableSQL(errorMessage: string): string {
  const missingColumns = extractMissingColumns(errorMessage);
  
  if (missingColumns.length === 0) return '';
  
  const alterStatements = [];
  
  if (missingColumns.includes('is_automatic_red')) {
    alterStatements.push('ADD COLUMN is_automatic_red boolean DEFAULT false');
  }
  if (missingColumns.includes('is_straight_red')) {
    alterStatements.push('ADD COLUMN is_straight_red boolean DEFAULT false');
  }
  if (missingColumns.includes('submitted_to_authority')) {
    alterStatements.push('ADD COLUMN submitted_to_authority boolean DEFAULT false');
  }
  if (missingColumns.includes('submission_date')) {
    alterStatements.push('ADD COLUMN submission_date timestamp NULL');
  }
  if (missingColumns.includes('ban_games')) {
    alterStatements.push('ADD COLUMN ban_games integer NULL');
  }
  
  return `ALTER TABLE public.cards ${alterStatements.join(', ')};`;
}