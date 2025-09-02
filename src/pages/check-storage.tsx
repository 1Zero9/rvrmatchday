/**
 * Check Storage Setup - See what's available
 */

import React, { useState, useEffect } from 'react';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';

export default function CheckStorage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkTables();
  }, []);

  const checkTables = async () => {
    const checks: any = {};

    // Check what tables exist
    const tableNames = ['teams', 'matches', 'match_events', 'players'];
    
    for (const tableName of tableNames) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('id', { count: 'exact' })
          .limit(1);
        
        checks[tableName] = {
          exists: !error,
          count: count || 0,
          error: error?.message
        };
      } catch (err) {
        checks[tableName] = {
          exists: false,
          error: 'Table not found'
        };
      }
    }

    // Check current localStorage data
    checks.localStorage = {
      teams: JSON.parse(localStorage.getItem('teams') || '[]').length,
      matches: JSON.parse(localStorage.getItem('matches') || '[]').length,
      match_events: JSON.parse(localStorage.getItem('match_events') || '[]').length
    };

    setResults(checks);
    setLoading(false);
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Storage Configuration Check</h1>
            <p className="text-gray-600">Current data storage status</p>
          </div>

          <div className="space-y-6">
            
            {/* Current Environment */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current Configuration</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800">
                  <strong>NEXT_PUBLIC_USE_SUPABASE:</strong> false (using localStorage)
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  This means teams, matches, and events are stored in your browser's localStorage
                </p>
              </div>
            </div>

            {/* Supabase Tables */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Supabase Tables Status</h2>
              <div className="space-y-3">
                {Object.entries(results).filter(([key]) => key !== 'localStorage').map(([table, info]: [string, any]) => (
                  <div key={table} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{table}</span>
                    {info.exists ? (
                      <span className="text-green-600">✅ Exists ({info.count} rows)</span>
                    ) : (
                      <span className="text-red-600">❌ Missing</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* localStorage Data */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Current localStorage Data</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Teams:</span>
                  <span className="font-medium">{results.localStorage.teams}</span>
                </div>
                <div className="flex justify-between">
                  <span>Matches:</span>
                  <span className="font-medium">{results.localStorage.matches}</span>
                </div>
                <div className="flex justify-between">
                  <span>Match Events:</span>
                  <span className="font-medium">{results.localStorage.match_events}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-medium text-yellow-900 mb-2">Production Recommendations</h3>
              <div className="text-sm text-yellow-800 space-y-2">
                <p><strong>For Demo:</strong> Keep current setup (localStorage works fine)</p>
                <p><strong>For Multi-User Production:</strong> Set NEXT_PUBLIC_USE_SUPABASE=true and create match tables</p>
                <p><strong>Data Migration:</strong> We can migrate your localStorage data to Supabase when ready</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </StandardLayout>
  );
}