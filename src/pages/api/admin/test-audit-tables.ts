/**
 * Test API - Check which audit tables exist
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const results: any = {
    tables: {},
    recommendations: []
  };

  // Test admin_event_log (comprehensive table)
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_event_log')
      .select('id')
      .limit(1);
    
    if (!error) {
      results.tables.admin_event_log = {
        exists: true,
        status: 'available',
        recordCount: data?.length || 0
      };
      results.recommendations.push('✅ Comprehensive admin_event_log table is available');
    } else {
      results.tables.admin_event_log = {
        exists: false,
        status: 'not_available',
        error: error.message
      };
    }
  } catch (error: any) {
    results.tables.admin_event_log = {
      exists: false,
      status: 'error',
      error: error.message
    };
    results.recommendations.push('🚧 Need to create comprehensive admin_event_log table');
  }

  // Test admin_audit_log (legacy table 1)
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_audit_log')
      .select('id')
      .limit(5);
    
    if (!error) {
      results.tables.admin_audit_log = {
        exists: true,
        status: 'available',
        recordCount: data?.length || 0
      };
      results.recommendations.push('📜 Legacy admin_audit_log table found with data');
    } else {
      results.tables.admin_audit_log = {
        exists: false,
        status: 'not_available',
        error: error.message
      };
    }
  } catch (error: any) {
    results.tables.admin_audit_log = {
      exists: false,
      status: 'error',
      error: error.message
    };
  }

  // Test user_management_log (legacy table 2)
  try {
    const { data, error } = await supabaseAdmin
      .from('user_management_log')
      .select('id')
      .limit(5);
    
    if (!error) {
      results.tables.user_management_log = {
        exists: true,
        status: 'available',
        recordCount: data?.length || 0
      };
      results.recommendations.push('📋 Legacy user_management_log table found with data');
    } else {
      results.tables.user_management_log = {
        exists: false,
        status: 'not_available',
        error: error.message
      };
    }
  } catch (error: any) {
    results.tables.user_management_log = {
      exists: false,
      status: 'error',
      error: error.message
    };
  }

  // Generate recommendations
  const availableTables = Object.keys(results.tables).filter(
    table => results.tables[table].exists
  );

  if (availableTables.length === 0) {
    results.recommendations.push('⚠️ No audit tables found - need to set up logging system');
    results.recommendations.push('💡 Run the setup-comprehensive-audit API to create tables');
  } else if (!results.tables.admin_event_log?.exists) {
    results.recommendations.push('🔄 Migrate to comprehensive audit logging for better tracking');
    results.recommendations.push('📊 Current system using legacy tables only');
  }

  results.summary = {
    comprehensiveTableAvailable: results.tables.admin_event_log?.exists || false,
    legacyTablesAvailable: availableTables.filter(t => t !== 'admin_event_log').length,
    totalTablesFound: availableTables.length,
    recommendedAction: results.tables.admin_event_log?.exists 
      ? 'System ready - using comprehensive logging'
      : availableTables.length > 0 
        ? 'Upgrade to comprehensive logging recommended'
        : 'Initial setup required'
  };

  return res.status(200).json(results);
}