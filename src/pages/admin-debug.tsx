/**
 * Admin Debug Page
 * Shows authentication status and user info
 */

import React from 'react';
import StandardLayout from '../components/StandardLayout';
import { AuthProvider, useAuth } from '../components/SecureAuth';

function AdminDebugContent() {
  const { user, profile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <StandardLayout title="Admin Debug">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Debug Information</h1>
        
        <div className="space-y-6">
          {/* Authentication Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Status</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">User Authenticated:</span>
                <span className={`ml-2 px-2 py-1 rounded ${user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Profile Loaded:</span>
                <span className={`ml-2 px-2 py-1 rounded ${profile ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {profile ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Is Admin:</span>
                <span className={`ml-2 px-2 py-1 rounded ${isAdmin ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {isAdmin ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Loading:</span>
                <span className={`ml-2 px-2 py-1 rounded ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {loading ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* User Information */}
          {user && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">User ID:</span> {user.id}</div>
                <div><span className="font-medium">Email:</span> {user.email}</div>
                <div><span className="font-medium">Email Verified:</span> {user.email_confirmed_at ? 'Yes' : 'No'}</div>
                <div><span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleString()}</div>
                <div><span className="font-medium">Last Sign In:</span> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</div>
              </div>
            </div>
          )}

          {/* Profile Information */}
          {profile && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Profile ID:</span> {profile.id}</div>
                <div><span className="font-medium">Email:</span> {profile.email}</div>
                <div><span className="font-medium">Username:</span> {profile.username}</div>
                <div><span className="font-medium">Full Name:</span> {profile.full_name}</div>
                <div><span className="font-medium">Role:</span> {profile.role}</div>
                <div><span className="font-medium">Teams:</span> {profile.teams?.join(', ') || 'None'}</div>
                <div><span className="font-medium">Permissions:</span> {profile.permissions?.join(', ') || 'None'}</div>
                <div><span className="font-medium">Active:</span> {profile.is_active ? 'Yes' : 'No'}</div>
              </div>
            </div>
          )}

          {/* No Profile Debug */}
          {user && !profile && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">⚠️ Profile Missing</h2>
              <p className="text-yellow-700 mb-4">
                You have a Supabase auth user but no profile in tracker_users table.
              </p>
              <div className="bg-white rounded p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Run this SQL to fix:</p>
                <code className="text-xs bg-gray-100 p-2 rounded block">
                  {`INSERT INTO tracker_users (id, email, username, full_name, role) 
VALUES ('${user.id}', '${user.email}', 'admin', 'Your Full Name', 'admin');`}
                </code>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-x-4">
              <a href="/welcome" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Go to Welcome
              </a>
              <a href="/admin" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Try Admin Again
              </a>
              <a href="/login" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Back to Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}

export default function AdminDebug() {
  return (
    <AuthProvider>
      <AdminDebugContent />
    </AuthProvider>
  );
}