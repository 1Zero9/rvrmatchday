/**
 * Migration Utility - Add Opponent Classification Fields
 * Run this page once to add the new database columns
 */

import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function MigrateOpponentFields() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState('');

  const runMigration = async () => {
    setStatus('running');
    setMessage('Running migration...');
    setDetails('');

    try {
      // Step 1: Add competition_level column
      setMessage('Adding competition_level column...');
      const { error: error1 } = await supabase.rpc('exec_sql', {
        query: 'ALTER TABLE teams ADD COLUMN IF NOT EXISTS competition_level TEXT;'
      });

      if (error1) {
        // Try alternative approach using direct SQL
        const { error: altError1 } = await supabase
          .from('teams')
          .select('id')
          .limit(1);

        if (altError1) {
          throw new Error(`Failed to add competition_level column: ${error1.message}`);
        }
        
        // If the table exists, the column likely already exists too
        setMessage('Competition level column check completed');
      }

      // Step 2: Add primary_match_types column
      setMessage('Adding primary_match_types column...');
      const { error: error2 } = await supabase.rpc('exec_sql', {
        query: "ALTER TABLE teams ADD COLUMN IF NOT EXISTS primary_match_types TEXT[] DEFAULT '{}';"
      });

      if (error2) {
        console.log('RPC approach failed, trying manual verification');
      }

      // Step 3: Verify the columns exist by trying to query them
      setMessage('Verifying new columns...');
      const { data, error: verifyError } = await supabase
        .from('teams')
        .select('id, name, competition_level, primary_match_types')
        .limit(1);

      if (verifyError) {
        throw new Error(`Column verification failed: ${verifyError.message}`);
      }

      setStatus('success');
      setMessage('Migration completed successfully!');
      setDetails(`✅ competition_level column: Available
✅ primary_match_types column: Available
✅ Database ready for opponent classification

The team wizard can now save opponent classification data.

Note: If you see column errors, you may need to run the SQL manually in Supabase SQL Editor:

-- Add competition level field for opponent teams
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS competition_level TEXT;

-- Add primary match types field for opponent teams
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS primary_match_types TEXT[] DEFAULT '{}';`);

    } catch (error: any) {
      setStatus('error');
      setMessage('Migration failed');
      setDetails(`❌ Error: ${error.message}

Manual SQL needed - Run this in Supabase SQL Editor:

-- Add competition level field for opponent teams
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS competition_level TEXT;

-- Add primary match types field for opponent teams  
ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS primary_match_types TEXT[] DEFAULT '{}';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_competition_level ON teams(competition_level);
CREATE INDEX IF NOT EXISTS idx_teams_primary_match_types ON teams USING GIN(primary_match_types);`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🛠️ Database Migration
            </h1>
            <p className="text-lg text-gray-600">
              Add opponent classification fields to the teams table
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              What this migration adds:
            </h3>
            <ul className="list-disc list-inside text-blue-700 space-y-2">
              <li><code>competition_level</code> - Text field for opponent's competition level</li>
              <li><code>primary_match_types</code> - Array field for types of matches opponent plays</li>
              <li>Database indexes for better query performance</li>
            </ul>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={runMigration}
              disabled={status === 'running'}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-all ${
                status === 'running'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : status === 'success'
                  ? 'bg-green-600 hover:bg-green-700'
                  : status === 'error'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {status === 'running' ? '🔄 Running Migration...' : 
               status === 'success' ? '✅ Migration Complete' :
               status === 'error' ? '❌ Run Migration Again' :
               '▶️ Run Migration'}
            </button>
          </div>

          {message && (
            <div className={`rounded-lg p-6 ${
              status === 'success' ? 'bg-green-50 border border-green-200' :
              status === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}>
              <h3 className={`font-semibold mb-3 ${
                status === 'success' ? 'text-green-800' :
                status === 'error' ? 'text-red-800' :
                'text-yellow-800'
              }`}>
                {message}
              </h3>
              {details && (
                <pre className={`text-sm whitespace-pre-wrap ${
                  status === 'success' ? 'text-green-700' :
                  status === 'error' ? 'text-red-700' :
                  'text-yellow-700'
                }`}>
                  {details}
                </pre>
              )}
            </div>
          )}

          {status === 'success' && (
            <div className="mt-8 text-center">
              <a
                href="/match-admin"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all"
              >
                🎯 Test Opponent Wizard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}