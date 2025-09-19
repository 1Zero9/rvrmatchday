/**
 * Secure Match Central Dashboard 
 * Uses secure Supabase authentication instead of legacy client-side auth
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React from 'react';
import { AuthProvider, RequireAuth } from '../components/SecureAuth';
import MatchCentralContent from './match-central-original-backup';

export default function SecureMatchCentral() {
  return (
    <AuthProvider>
      <RequireAuth>
        <MatchCentralContent />
      </RequireAuth>
    </AuthProvider>
  );
}