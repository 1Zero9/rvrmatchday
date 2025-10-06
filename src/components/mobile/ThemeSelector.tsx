/**
 * 🎨 RVR AFC Theme Selector
 * 
 * Allows users to switch between Seniors, Boys, and Girls themes
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useRVRTheme, getAllThemes, Theme } from '../../utils/rvr-themes';

interface ThemeSelectorProps {
  onClose?: () => void;
  showAsModal?: boolean;
}

export default function ThemeSelector({ onClose, showAsModal = false }: ThemeSelectorProps) {
  const { currentTheme, setTheme, themeId } = useRVRTheme();
  const themes = getAllThemes();

  const handleThemeSelect = (selectedThemeId: string) => {
    setTheme(selectedThemeId);
    if (showAsModal && onClose) {
      setTimeout(onClose, 500); // Small delay to show selection
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: showAsModal ? 50 : 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: showAsModal ? 50 : 0 }}
        className={showAsModal ? 'fixed inset-0 z-50 flex items-end' : ''}
      >
        {showAsModal && (
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
        )}
        
        <div className={`
          ${showAsModal 
            ? 'relative bg-white rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto' 
            : 'bg-white rounded-xl p-4 border border-gray-200'
          }
        `}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Choose Your Color Theme</h3>
            {showAsModal && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Customize your app with your favorite color theme
          </p>

          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <motion.button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-xl border-2 text-left transition-all
                  ${themeId === theme.id 
                    ? 'border-current shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
                style={{
                  borderColor: themeId === theme.id ? theme.colors.primary : undefined
                }}
              >
                <div className="text-center">
                  {/* Theme Preview Header */}
                  <div className="h-16 rounded-lg relative overflow-hidden mb-3">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${theme.colors.headerGradient.from}, ${theme.colors.headerGradient.via}, ${theme.colors.headerGradient.to})`
                      }}
                    />
                    <div className="relative z-10 px-2 py-2 flex items-center justify-center h-full">
                      <span className="text-white text-sm font-semibold">
                        {theme.displayName}
                      </span>
                      {themeId === theme.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center bg-white/90"
                        >
                          <Check size={12} style={{ color: theme.colors.primary }} />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Theme Color Preview */}
                  <div className="flex justify-center space-x-1 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.headerGradient.from }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  </div>
                  
                  <p className="text-xs text-gray-600">
                    {theme.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {showAsModal && (
            <button
              onClick={onClose}
              className="w-full mt-6 py-3 text-gray-600 font-medium"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

