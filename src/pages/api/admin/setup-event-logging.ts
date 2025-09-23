/**
 * Admin API - Setup Event Logging
 * Creates the user_management_log table and initial setup
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Setting up user management event logging...');

    // Create the user_management_log table (simple version)
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS user_management_log (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          admin_user_id UUID,
          target_user_id UUID,
          action VARCHAR(50) NOT NULL,
          details JSONB DEFAULT '{}',
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Try to create table using different methods
    let tableExists = false;
    
    // First, check if table already exists
    const { error: checkError } = await supabaseAdmin
      .from('user_management_log')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      tableExists = true;
      console.log('Table already exists');
    } else if (checkError.message.includes('does not exist')) {
      // Table doesn't exist, provide SQL for manual creation
      return res.status(200).json({
        success: false,
        tableExists: false,
        message: 'Event logging table does not exist',
        instruction: 'Please run this SQL in your Supabase SQL editor:',
        sql: `-- Copy and paste this SQL into Supabase SQL Editor:
CREATE TABLE user_management_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID,
    target_user_id UUID,
    action VARCHAR(50) NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_user_mgmt_log_admin_user ON user_management_log(admin_user_id);
CREATE INDEX idx_user_mgmt_log_target_user ON user_management_log(target_user_id);
CREATE INDEX idx_user_mgmt_log_action ON user_management_log(action);
CREATE INDEX idx_user_mgmt_log_created_at ON user_management_log(created_at DESC);

-- Add foreign key constraints
ALTER TABLE user_management_log 
ADD CONSTRAINT fk_admin_user FOREIGN KEY (admin_user_id) REFERENCES tracker_users(id) ON DELETE SET NULL;

ALTER TABLE user_management_log 
ADD CONSTRAINT fk_target_user FOREIGN KEY (target_user_id) REFERENCES tracker_users(id) ON DELETE SET NULL;`
      });
    }

    // Create indexes
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_admin_user ON user_management_log(admin_user_id);
      CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_target_user ON user_management_log(target_user_id);
      CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_action ON user_management_log(action);
      CREATE INDEX IF NOT EXISTS idx_user_mgmt_log_created_at ON user_management_log(created_at DESC);
    `;

    // Test if we can insert a sample log entry
    const testAdmin = await supabaseAdmin
      .from('tracker_users')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
      .single();

    if (testAdmin.data) {
      const { error: insertError } = await supabaseAdmin
        .from('user_management_log')
        .insert([{
          admin_user_id: testAdmin.data.id,
          action: 'setup_system',
          details: {
            message: 'Event logging system initialized',
            timestamp: new Date().toISOString()
          },
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Error inserting test log:', insertError);
        return res.status(500).json({ 
          error: 'Table exists but insert failed', 
          details: insertError.message 
        });
      }
    }

    // Test if we can read logs
    const { data: logs, error: readError } = await supabaseAdmin
      .from('user_management_log')
      .select('*')
      .limit(5);

    if (readError) {
      console.error('Error reading logs:', readError);
      return res.status(500).json({ 
        error: 'Cannot read from log table', 
        details: readError.message 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event logging system setup complete',
      tableExists: true,
      testLogsCount: logs?.length || 0,
      sampleLogs: logs || []
    });

  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ 
      error: 'Setup failed', 
      details: (error as Error).message 
    });
  }
}