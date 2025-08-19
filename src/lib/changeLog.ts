import { supabase } from './supabase';

interface ChangeLogEntry {
  table_name: string;
  record_id?: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  change_summary: string;
  user_agent?: string;
  ip_address?: string;
}

export async function logChange(entry: ChangeLogEntry): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Cannot log change: No authenticated user');
      return;
    }

    const logData = {
      ...entry,
      changed_by: user.id,
      user_agent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
      // In a real app, you'd get the IP from the request headers
      ip_address: '127.0.0.1'
    };

    const { error } = await supabase
      .from('change_log')
      .insert(logData);

    if (error) {
      console.error('Failed to log change:', error);
    }
  } catch (error) {
    console.error('Error logging change:', error);
  }
}

// Helper function for commonly used change logging
export const ChangeLogger = {
  async created(tableName: string, recordId: string, newData: Record<string, unknown>, summary: string) {
    await logChange({
      table_name: tableName,
      record_id: recordId,
      action: 'INSERT',
      new_values: newData,
      change_summary: `Created ${tableName}: ${summary}`
    });
  },

  async updated(tableName: string, recordId: string, oldData: Record<string, unknown>, newData: Record<string, unknown>, summary: string) {
    await logChange({
      table_name: tableName,
      record_id: recordId,
      action: 'UPDATE',
      old_values: oldData,
      new_values: newData,
      change_summary: `Updated ${tableName}: ${summary}`
    });
  },

  async deleted(tableName: string, recordId: string, oldData: Record<string, unknown>, summary: string) {
    await logChange({
      table_name: tableName,
      record_id: recordId,
      action: 'DELETE',
      old_values: oldData,
      change_summary: `Deleted ${tableName}: ${summary}`
    });
  },

  async system(action: string, summary: string, data?: Record<string, unknown>) {
    await logChange({
      table_name: 'system',
      action: action as 'INSERT' | 'UPDATE' | 'DELETE',
      new_values: data,
      change_summary: `System: ${summary}`
    });
  }
};

// Types for the change log display
export interface ChangeLogRecord {
  id: string;
  table_name: string;
  record_id?: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  changed_by?: string;
  changed_at: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  change_summary: string;
  user_agent?: string;
  ip_address?: string;
  user?: {
    email: string;
    name?: string;
  };
}

export async function getChangeLog(
  limit = 100, 
  tableName?: string, 
  action?: string
): Promise<ChangeLogRecord[]> {
  try {
    let query = supabase
      .from('change_log')
      .select(`
        id,
        table_name,
        record_id,
        action,
        changed_by,
        changed_at,
        old_values,
        new_values,
        change_summary,
        user_agent,
        ip_address
      `)
      .order('changed_at', { ascending: false })
      .limit(limit);

    if (tableName) {
      query = query.eq('table_name', tableName);
    }

    if (action) {
      query = query.eq('action', action);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Failed to fetch change log:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching change log:', error);
    return [];
  }
}