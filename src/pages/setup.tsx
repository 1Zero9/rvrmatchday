import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

interface DatabaseStatus {
  status: string;
  message: string;
  needsSchema: boolean;
  details?: {
    existing: string[];
    missing: string[];
  };
}

export default function Setup() {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [message, setMessage] = useState('Testing database connection...');
  const [needsSchema, setNeedsSchema] = useState(false);
  const [details, setDetails] = useState<{existing: string[], missing: string[]}>({ existing: [], missing: [] });
  const [isRetesting, setIsRetesting] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsRetesting(true);
    try {
      const response = await fetch('/api/test-db');
      const result: DatabaseStatus = await response.json();
      
      setConnectionStatus(result.status);
      setMessage(result.message);
      setNeedsSchema(result.needsSchema);
      setDetails(result.details || { existing: [], missing: [] });
    } catch {
      setConnectionStatus('error');
      setMessage('Failed to connect to database');
      setNeedsSchema(true);
      setDetails({ existing: [], missing: [] });
    } finally {
      setIsRetesting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-6">
              Database Setup
            </h1>

            {/* Connection Status */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
              <div className={`p-4 rounded-lg ${
                connectionStatus === 'ready' ? 'bg-green-50 border border-green-200' :
                connectionStatus === 'partial' ? 'bg-yellow-50 border border-yellow-200' :
                connectionStatus === 'connected' ? 'bg-blue-50 border border-blue-200' :
                connectionStatus === 'error' ? 'bg-red-50 border border-red-200' :
                'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${
                    connectionStatus === 'ready' ? 'bg-green-500' :
                    connectionStatus === 'partial' ? 'bg-yellow-500' :
                    connectionStatus === 'connected' ? 'bg-blue-500' :
                    connectionStatus === 'error' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className={`font-medium ${
                    connectionStatus === 'ready' ? 'text-green-800' :
                    connectionStatus === 'partial' ? 'text-yellow-800' :
                    connectionStatus === 'connected' ? 'text-blue-800' :
                    connectionStatus === 'error' ? 'text-red-800' :
                    'text-gray-800'
                  }`}>
                    {message}
                  </span>
                </div>
                
                {/* Table Status */}
                {(details.existing.length > 0 || details.missing.length > 0) && (
                  <div className="text-sm space-y-2">
                    {details.existing.length > 0 && (
                      <div>
                        <span className="font-medium text-green-700">✓ Existing tables:</span>
                        <span className="ml-2 text-green-600">
                          {details.existing.join(', ')}
                        </span>
                      </div>
                    )}
                    {details.missing.length > 0 && (
                      <div>
                        <span className="font-medium text-red-700">✗ Missing tables:</span>
                        <span className="ml-2 text-red-600">
                          {details.missing.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Schema Setup Instructions */}
            {needsSchema && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Database Schema Setup</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-800 mb-4">
                    Your Supabase database needs to be set up with the required tables. Here&apos;s what you need to do:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Step 1: Open Supabase Dashboard</h3>
                      <p className="text-sm text-gray-600">
                        Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">supabase.com/dashboard</a> and select your project.
                      </p>
                    </div>

                    <div className="bg-white rounded p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Step 2: Open SQL Editor</h3>
                      <p className="text-sm text-gray-600">
                        Navigate to the SQL Editor in your Supabase dashboard.
                      </p>
                    </div>

                    <div className="bg-white rounded p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Step 3: Run Database Schema</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Copy and paste the contents of <code className="bg-gray-100 px-2 py-1 rounded">database-schema-extended.sql</code> and run it.
                      </p>
                      <details className="text-xs">
                        <summary className="cursor-pointer text-blue-600 hover:underline">
                          Click to view schema location
                        </summary>
                        <p className="mt-2 text-gray-500">
                          The extended file is located in your project root: <code>/database-schema-extended.sql</code>
                        </p>
                        <p className="mt-1 text-gray-500 text-xs">
                          This includes the full MatchDay tracker with coaches, players, teams, and match events.
                        </p>
                      </details>
                    </div>

                    <div className="bg-white rounded p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Step 4: Test Connection</h3>
                      <button 
                        onClick={testConnection}
                        disabled={isRetesting}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRetesting ? 'Testing...' : 'Retest Connection'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {connectionStatus === 'ready' && !needsSchema && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800">Database Ready!</h3>
                </div>
                <p className="text-green-700 mb-4">
                  Your database is connected and all tables are set up correctly.
                </p>
                <Link 
                  href="/"
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Go to Homepage
                </Link>
              </div>
            )}

            {/* Current Configuration */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div>
                  <span className="font-medium">Supabase URL:</span> 
                  <span className="text-gray-600 ml-2">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? 
                      `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...` : 
                      'Not configured'
                    }
                  </span>
                </div>
                <div>
                  <span className="font-medium">API Key:</span> 
                  <span className="text-gray-600 ml-2">
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 
                      `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 
                      'Not configured'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}