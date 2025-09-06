/**
 * Bulk Operations Panel - Enterprise Scale Management
 * Handle mass operations on teams, players, and matches
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team, Match, Player } from '../types/match-tracker';

interface BulkOperationsProps {
  selectedItems: string[];
  itemType: 'teams' | 'players' | 'matches';
  onClearSelection: () => void;
  onBulkUpdate: (operation: string, data: any) => Promise<void>;
  className?: string;
}

export default function BulkOperationsPanel({ 
  selectedItems, 
  itemType, 
  onClearSelection, 
  onBulkUpdate,
  className = ""
}: BulkOperationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [operation, setOperation] = useState('');

  if (selectedItems.length === 0) return null;

  const handleBulkOperation = async (op: string, data: any = {}) => {
    try {
      setLoading(true);
      setOperation(op);
      await onBulkUpdate(op, { items: selectedItems, ...data });
      onClearSelection();
    } catch (error) {
      console.error('Bulk operation failed:', error);
      // TODO: Add proper error handling/notifications
    } finally {
      setLoading(false);
      setOperation('');
      setIsOpen(false);
    }
  };

  const getOperations = () => {
    switch (itemType) {
      case 'teams':
        return [
          { id: 'activate', label: 'Activate Teams', icon: '✅', color: 'green' },
          { id: 'deactivate', label: 'Deactivate Teams', icon: '⏸️', color: 'yellow' },
          { id: 'archive', label: 'Archive Teams', icon: '📦', color: 'gray' },
          { id: 'change-league', label: 'Change League', icon: '🏆', color: 'blue' },
          { id: 'change-season', label: 'Change Season', icon: '📅', color: 'purple' },
          { id: 'export', label: 'Export Data', icon: '📊', color: 'indigo' },
          { id: 'delete', label: 'Delete Teams', icon: '🗑️', color: 'red' },
        ];
      case 'players':
        return [
          { id: 'transfer', label: 'Transfer Players', icon: '↔️', color: 'blue' },
          { id: 'activate', label: 'Activate Players', icon: '✅', color: 'green' },
          { id: 'deactivate', label: 'Deactivate Players', icon: '⏸️', color: 'yellow' },
          { id: 'update-position', label: 'Update Positions', icon: '⚽', color: 'orange' },
          { id: 'export', label: 'Export Data', icon: '📊', color: 'indigo' },
        ];
      case 'matches':
        return [
          { id: 'reschedule', label: 'Reschedule Matches', icon: '📅', color: 'blue' },
          { id: 'cancel', label: 'Cancel Matches', icon: '❌', color: 'red' },
          { id: 'change-venue', label: 'Change Venue', icon: '🏟️', color: 'purple' },
          { id: 'export', label: 'Export Results', icon: '📊', color: 'indigo' },
        ];
      default:
        return [];
    }
  };

  const operations = getOperations();

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 ${className}`}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden min-w-96"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">{selectedItems.length}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedItems.length} {itemType} selected
                </h3>
                <p className="text-sm text-gray-600">Choose a bulk operation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={isOpen ? 'Hide operations' : 'Show operations'}
              >
                <svg 
                  className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button
                onClick={onClearSelection}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Clear selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Operations Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  {operations.map(op => (
                    <motion.button
                      key={op.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBulkOperation(op.id)}
                      disabled={loading}
                      className={`p-4 rounded-xl border-2 border-dashed border-${op.color}-200 hover:border-${op.color}-400 bg-${op.color}-50 hover:bg-${op.color}-100 transition-all text-left group ${
                        loading && operation === op.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{op.icon}</span>
                        <div>
                          <div className={`font-medium text-${op.color}-900 group-hover:text-${op.color}-800`}>
                            {op.label}
                          </div>
                          <div className={`text-sm text-${op.color}-600`}>
                            {selectedItems.length} {itemType}
                          </div>
                        </div>
                      </div>
                      
                      {loading && operation === op.id && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                            <span className="text-sm text-blue-600">Processing...</span>
                          </div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Quick actions for {selectedItems.length} selected {itemType}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBulkOperation('export')}
                        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                      >
                        📊 Export
                      </button>
                      
                      <button
                        onClick={onClearSelection}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Quick Actions */}
        {!isOpen && (
          <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleBulkOperation('export')}
                className="flex items-center space-x-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors text-sm"
              >
                <span>📊</span>
                <span>Export</span>
              </button>
            </div>
            
            <button
              onClick={() => setIsOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              More operations →
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}