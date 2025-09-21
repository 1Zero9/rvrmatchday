/**
 * Secure Match Central Dashboard
 * New secure authentication system with Supabase Auth
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React from "react";
import { useRouter } from "next/router";
import StandardLayout from "../components/StandardLayout";
import { RequireAuth } from '../components/SecureAuth';

// Import the existing match central content
import MatchCentralContent from '../components/MatchCentralContent';

export default function SecureMatchCentral() {
  const router = useRouter();

  return (
    <StandardLayout title="Match Central - Secure Access">
        <RequireAuth
          requiredPermission="match_central_access"
          fallback={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-8">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl text-white">⚽</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Match Central</h1>
                  <p className="text-gray-600">Secure access for authorized personnel only</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">🔐 Authentication Required</h3>
                    <p className="text-sm text-blue-700">
                      Match Central requires secure authentication. Only authorized coaches, 
                      managers, and administrators can access this system.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      🔓 Sign In to Continue
                    </button>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        Don't have an account?
                      </p>
                      <button
                        onClick={() => router.push('/register')}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        👥 Request Account Access
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-700">
                        <strong>Note:</strong> Account access requires approval from club administrators. 
                        Please allow 24-48 hours for account activation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <MatchCentralContent />
        </RequireAuth>
      </StandardLayout>
  );
}