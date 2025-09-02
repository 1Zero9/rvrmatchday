/**
 * Debug Storage Configuration
 */

import React from 'react';
import StandardLayout from '../components/StandardLayout';

export default function DebugStorage() {
  const nodeEnv = process.env.NODE_ENV;
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE;
  const shouldUseSupabase = nodeEnv === 'production' || useSupabase === 'true';
  
  // Check if we're on client side
  const isClient = typeof window !== 'undefined';

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Storage Debug Info</h1>
            <p className="text-gray-600">Current environment and storage configuration</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Environment Variables</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">NODE_ENV:</span>
                <span className="font-mono">{nodeEnv || 'undefined'}</span>
              </div>
              
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">NEXT_PUBLIC_USE_SUPABASE:</span>
                <span className="font-mono">{useSupabase || 'undefined'}</span>
              </div>
              
              <div className="flex justify-between p-3 bg-blue-50 rounded">
                <span className="font-medium">Should Use Supabase:</span>
                <span className={`font-bold ${shouldUseSupabase ? 'text-green-600' : 'text-red-600'}`}>
                  {shouldUseSupabase ? 'YES' : 'NO'}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2">Expected Behavior:</h3>
              <div className="text-sm text-yellow-800 space-y-1">
                <div>• If NODE_ENV = 'production' OR NEXT_PUBLIC_USE_SUPABASE = 'true' → Use Supabase</div>
                <div>• Otherwise → Use localStorage</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </StandardLayout>
  );
}