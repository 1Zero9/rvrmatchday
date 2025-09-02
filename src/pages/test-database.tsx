/**
 * Direct Database Test - Verify Supabase Connection
 */

import React, { useState, useEffect } from 'react';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';

export default function TestDatabase() {
  const [testResults, setTestResults] = useState<any>({});
  const [testName, setTestName] = useState('');
  const [testing, setTesting] = useState(false);

  // Test direct database write
  const testWrite = async () => {
    setTesting(true);
    try {
      const testTeam = {
        name: testName || `Test Team ${Date.now()}`,
        short_name: 'TEST',
        age_group: 'U12',
        gender: 'Mixed',
        league: 'Test League',
        is_opponent: false
      };

      console.log('Writing to database:', testTeam);
      
      const { data, error } = await supabase
        .from('teams')
        .insert(testTeam)
        .select();

      if (error) {
        throw error;
      }

      console.log('Database write successful:', data);
      setTestResults(prev => ({ ...prev, write: { success: true, data } }));
      
      // Now test read
      await testRead();
      
    } catch (error: any) {
      console.error('Database write failed:', error);
      setTestResults(prev => ({ ...prev, write: { success: false, error: error.message } }));
    } finally {
      setTesting(false);
    }
  };

  // Test direct database read
  const testRead = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .limit(5);

      if (error) {
        throw error;
      }

      console.log('Database read successful:', data);
      setTestResults(prev => ({ ...prev, read: { success: true, data } }));
      
    } catch (error: any) {
      console.error('Database read failed:', error);
      setTestResults(prev => ({ ...prev, read: { success: false, error: error.message } }));
    }
  };

  useEffect(() => {
    testRead(); // Test read on load
  }, []);

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Connection Test</h1>
            <p className="text-gray-600">Direct Supabase read/write test</p>
          </div>

          {/* Write Test */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Write Test</h2>
            
            <div className="flex space-x-4 mb-4">
              <input
                type="text"
                placeholder="Test team name (optional)"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <button
                onClick={testWrite}
                disabled={testing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
              >
                {testing ? 'Testing...' : 'Test Write'}
              </button>
            </div>

            {testResults.write && (
              <div className={`p-4 rounded-lg ${testResults.write.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`font-medium ${testResults.write.success ? 'text-green-900' : 'text-red-900'}`}>
                  {testResults.write.success ? '✅ Write Successful' : '❌ Write Failed'}
                </p>
                {testResults.write.error && (
                  <p className="text-red-600 text-sm mt-1">{testResults.write.error}</p>
                )}
                {testResults.write.data && (
                  <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(testResults.write.data, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Read Test */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Read Test</h2>
            
            <button
              onClick={testRead}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4"
            >
              Test Read
            </button>

            {testResults.read && (
              <div className={`p-4 rounded-lg ${testResults.read.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className={`font-medium ${testResults.read.success ? 'text-green-900' : 'text-red-900'}`}>
                  {testResults.read.success ? '✅ Read Successful' : '❌ Read Failed'}
                </p>
                {testResults.read.error && (
                  <p className="text-red-600 text-sm mt-1">{testResults.read.error}</p>
                )}
                {testResults.read.data && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Found {testResults.read.data.length} teams:</p>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                      {JSON.stringify(testResults.read.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </StandardLayout>
  );
}