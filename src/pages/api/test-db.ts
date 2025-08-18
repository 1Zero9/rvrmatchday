import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test if our specific tables exist
    const requiredTables = ['profiles', 'teams', 'matches', 'opponents', 'venues'];
    const tableChecks = await Promise.all(
      requiredTables.map(async (tableName) => {
        try {
          const { error } = await supabase
            .from(tableName)
            .select('id')
            .limit(1);
          
          return {
            table: tableName,
            exists: !error || (error.code !== 'PGRST116' && error.code !== '42P01')
          };
        } catch {
          return {
            table: tableName,
            exists: false
          };
        }
      })
    );

    const missingTables = tableChecks.filter(check => !check.exists);
    const existingTables = tableChecks.filter(check => check.exists);

    if (missingTables.length === requiredTables.length) {
      // No tables exist - fresh setup needed
      return res.status(200).json({
        status: 'connected',
        message: 'Supabase connected but no football club tables found',
        needsSchema: true,
        details: {
          existing: existingTables.map(t => t.table),
          missing: missingTables.map(t => t.table)
        }
      });
    } else if (missingTables.length > 0) {
      // Some tables exist but not all - partial setup
      return res.status(200).json({
        status: 'partial',
        message: `${existingTables.length}/${requiredTables.length} required tables exist. Schema update recommended.`,
        needsSchema: true,
        details: {
          existing: existingTables.map(t => t.table),
          missing: missingTables.map(t => t.table)
        }
      });
    } else {
      // All required tables exist
      return res.status(200).json({
        status: 'ready',
        message: 'All football club tables are present and ready!',
        needsSchema: false,
        details: {
          existing: existingTables.map(t => t.table),
          missing: []
        }
      });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: errorMessage,
      needsSchema: true,
      details: {
        existing: [],
        missing: []
      }
    });
  }
}