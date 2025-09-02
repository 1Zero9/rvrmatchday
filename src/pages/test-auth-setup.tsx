/**
 * Test Auth Setup - Check Supabase Tables and Configuration
 * Temporary page to verify auth system setup
 */

import React, { useState, useEffect } from 'react';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';

interface TableCheck {
  name: string;
  exists: boolean;
  rowCount?: number;
  error?: string;
}

export default function TestAuthSetup() {
  const [checks, setChecks] = useState<TableCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthSetup();
  }, []);

  const checkAuthSetup = async () => {
    const results: TableCheck[] = [];

    // Check tracker_users table
    try {
      const { data, error, count } = await supabase
        .from('tracker_users')
        .select('id', { count: 'exact' })
        .limit(1);
      
      results.push({
        name: 'tracker_users',
        exists: !error,
        rowCount: count || 0,
        error: error?.message
      });
    } catch (err) {
      results.push({
        name: 'tracker_users',
        exists: false,
        error: 'Table does not exist'
      });
    }

    // Check account_requests table
    try {
      const { data, error, count } = await supabase
        .from('account_requests')
        .select('id', { count: 'exact' })
        .limit(1);
      
      results.push({
        name: 'account_requests',
        exists: !error,
        rowCount: count || 0,
        error: error?.message
      });
    } catch (err) {
      results.push({
        name: 'account_requests',
        exists: false,
        error: 'Table does not exist'
      });
    }

    // Check profiles table (if exists)
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .limit(1);
      
      results.push({
        name: 'profiles',
        exists: !error,
        rowCount: count || 0,
        error: error?.message
      });
    } catch (err) {
      results.push({
        name: 'profiles',
        exists: false,
        error: 'Table does not exist'
      });
    }

    // Check auth.users (should always exist)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      results.push({
        name: 'auth.users (connection)',
        exists: true,
        rowCount: user ? 1 : 0
      });
    } catch (err) {
      results.push({
        name: 'auth.users (connection)',
        exists: false,
        error: 'Auth connection failed'
      });
    }

    setChecks(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Checking Auth Setup...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Auth System Setup Check</h1>
            <p className="text-gray-600">Verifying Supabase authentication configuration</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Database Tables Status</h2>
            
            <div className="space-y-4">
              {checks.map((check) => (
                <div key={check.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{check.name}</h3>
                    {check.error && (
                      <p className="text-sm text-red-600 mt-1">{check.error}</p>
                    )}
                  </div>
                  <div className="text-right">
                    {check.exists ? (
                      <div>
                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          ✅ Exists
                        </span>
                        {check.rowCount !== undefined && (
                          <p className="text-sm text-gray-600 mt-1">{check.rowCount} rows</p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                        ❌ Missing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Setup Instructions */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Setup Instructions</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p><strong>Missing Tables?</strong> Run the SQL migration files in your Supabase SQL editor:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code>sql/create_account_requests.sql</code> - Account request system</li>
                  <li>See <code>src/lib/supabase-auth.ts</code> for tracker_users table SQL</li>
                </ul>
                <p><strong>Environment:</strong> Supabase URL and keys are configured in .env.local</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={checkAuthSetup}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔄 Recheck Setup
              </button>
              <a
                href="/auth-login"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                🔐 Test Login
              </a>
              <a
                href="/account-request"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                📝 Test Request Form
              </a>
            </div>
          </div>

        </div>
      </div>
    </StandardLayout>
  );
}