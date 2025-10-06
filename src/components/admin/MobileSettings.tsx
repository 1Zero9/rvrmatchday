/**
 * Mobile Settings Admin Component
 * Manage mobile app features and toggles
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Smartphone, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MobileSetting {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'features' | 'access' | 'display';
}

export default function MobileSettings() {
  const [settings, setSettings] = useState<MobileSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Default mobile settings
  const defaultSettings: MobileSetting[] = [
    {
      key: 'mobile_match_recorder_enabled',
      title: 'Mobile Match Recorder',
      description: 'Allow access to the standalone mobile match recording app for sideline use',
      enabled: true,
      category: 'features'
    },
    {
      key: 'mobile_theme_selector_enabled',
      title: 'Theme Selector',
      description: 'Allow users to customize color themes in the mobile app',
      enabled: true,
      category: 'display'
    },
    {
      key: 'mobile_notifications_enabled',
      title: 'Push Notifications',
      description: 'Enable mobile push notifications for match updates',
      enabled: true,
      category: 'features'
    },
    {
      key: 'mobile_offline_mode_enabled',
      title: 'Offline Mode',
      description: 'Allow mobile app to work offline with cached data',
      enabled: true,
      category: 'features'
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // First, ensure admin_settings table exists
      await ensureAdminSettingsTable();

      // Load settings from database
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .like('key', 'mobile_%');

      if (error) {
        console.error('Error loading settings:', error);
        // Fall back to defaults
        setSettings(defaultSettings);
      } else {
        // Merge database settings with defaults
        const loadedSettings = defaultSettings.map(defaultSetting => {
          const dbSetting = data?.find(d => d.key === defaultSetting.key);
          return {
            ...defaultSetting,
            enabled: dbSetting ? dbSetting.value === 'true' : defaultSetting.enabled
          };
        });
        setSettings(loadedSettings);
      }
    } catch (err) {
      console.error('Error in loadSettings:', err);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const ensureAdminSettingsTable = async () => {
    try {
      // Try to create the table if it doesn't exist
      const { error } = await supabase.rpc('create_admin_settings_table_if_not_exists');
      
      if (error) {
        // If RPC doesn't exist, try direct table creation
        await supabase.from('admin_settings').select('key').limit(1);
      }
    } catch (err) {
      // Table might not exist, that's ok - we'll create settings as needed
      console.log('Admin settings table may not exist yet');
    }
  };

  const toggleSetting = async (settingKey: string) => {
    setSaving(settingKey);
    
    const setting = settings.find(s => s.key === settingKey);
    if (!setting) return;

    const newValue = !setting.enabled;

    try {
      // Update in database
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          key: settingKey,
          value: newValue.toString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating setting:', error);
        // Create table and try again
        await createAdminSettingsTable();
        await supabase
          .from('admin_settings')
          .upsert({
            key: settingKey,
            value: newValue.toString(),
            updated_at: new Date().toISOString()
          });
      }

      // Update local state
      setSettings(prev => prev.map(s => 
        s.key === settingKey ? { ...s, enabled: newValue } : s
      ));

    } catch (err) {
      console.error('Error toggling setting:', err);
    } finally {
      setSaving(null);
    }
  };

  const createAdminSettingsTable = async () => {
    try {
      await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS admin_settings (
            key VARCHAR(255) PRIMARY KEY,
            value TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `
      });
    } catch (err) {
      console.log('Could not create admin_settings table via RPC');
    }
  };

  const getCategorySettings = (category: string) => {
    return settings.filter(s => s.category === category);
  };

  const getToggleIcon = (enabled: boolean) => {
    return enabled ? (
      <ToggleRight className="w-6 h-6 text-green-500" />
    ) : (
      <ToggleLeft className="w-6 h-6 text-gray-400" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mobile App Settings</h1>
            <p className="text-gray-600">Configure mobile app features and access controls</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4 mb-8">
          <a
            href="/mobile-wow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Mobile App</span>
          </a>
          <a
            href="/mobile-wow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Test Match Recorder</span>
          </a>
        </div>
      </div>

      {/* Features Settings */}
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">App Features</h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y">
            {getCategorySettings('features').map((setting) => (
              <motion.div
                key={setting.key}
                className="p-6 flex items-center justify-between"
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{setting.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                  {setting.key === 'mobile_match_recorder_enabled' && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Standalone App
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleSetting(setting.key)}
                  disabled={saving === setting.key}
                  className="ml-4 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {saving === setting.key ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  ) : (
                    getToggleIcon(setting.enabled)
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Display & Interface</h2>
          <div className="bg-white rounded-lg border border-gray-200 divide-y">
            {getCategorySettings('display').map((setting) => (
              <motion.div
                key={setting.key}
                className="p-6 flex items-center justify-between"
                whileHover={{ backgroundColor: '#f9fafb' }}
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{setting.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                </div>
                <button
                  onClick={() => toggleSetting(setting.key)}
                  disabled={saving === setting.key}
                  className="ml-4 p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {saving === setting.key ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  ) : (
                    getToggleIcon(setting.enabled)
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status Info */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Mobile App Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {settings.filter(s => s.enabled).length}
              </div>
              <div className="text-sm text-blue-700">Features Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {settings.filter(s => s.category === 'features' && s.enabled).length}
              </div>
              <div className="text-sm text-blue-700">Active Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {settings.find(s => s.key === 'mobile_match_recorder_enabled')?.enabled ? '✅' : '❌'}
              </div>
              <div className="text-sm text-blue-700">Match Recorder</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}