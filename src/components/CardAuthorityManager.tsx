/**
 * Card Authority Manager - Red Card Submission Tracking
 * Professional system for managing football authority submissions
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cardManager, Card } from '../lib/card-manager';

export default function CardAuthorityManager() {
  const [pendingCards, setPendingCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [exportData, setExportData] = useState('');

  useEffect(() => {
    loadPendingSubmissions();
  }, []);

  const loadPendingSubmissions = async () => {
    try {
      const pending = await cardManager.getPendingSubmissions();
      setPendingCards(pending);
    } catch (error) {
      console.error('Error loading pending submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitToAuthority = async (cardId: string, banGames?: number) => {
    setSubmitting(cardId);
    try {
      const success = await cardManager.markSubmittedToAuthority(cardId, banGames);
      if (success) {
        await loadPendingSubmissions(); // Reload data
        alert('Card submission recorded successfully');
      } else {
        alert('Failed to record card submission');
      }
    } catch (error) {
      console.error('Error submitting card:', error);
      alert('Error recording card submission');
    } finally {
      setSubmitting(null);
    }
  };

  const handleExportSubmissions = () => {
    const data = cardManager.exportForAuthority(pendingCards);
    setExportData(data);
    setShowExport(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportData);
    alert('Export data copied to clipboard!');
  };

  const downloadExport = () => {
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `card-submissions-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          📋 Football Authority Submissions
        </h3>
        {pendingCards.length > 0 && (
          <button
            onClick={handleExportSubmissions}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>📋</span>
            Export Report
          </button>
        )}
      </div>

      {pendingCards.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">✅</div>
          <div className="font-medium">No pending red card submissions</div>
          <div className="text-sm mt-1">All red cards have been submitted to the football authority</div>
        </div>
      ) : (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-amber-900 mb-2">⚠️ Action Required</h4>
            <div className="text-sm text-amber-800">
              <strong>{pendingCards.length}</strong> red card{pendingCards.length !== 1 ? 's' : ''} need{pendingCards.length === 1 ? 's' : ''} to be submitted to the football authority.
              Red cards must be submitted within the required timeframe to avoid penalties.
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {pendingCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-6 bg-red-500 rounded-sm"></div>
                          <span className="font-medium text-red-900">Red Card</span>
                        </div>
                        <div className="text-sm text-red-700">
                          {card.minute}' - {card.player_name || 'Unknown Player'}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-red-800">Match:</strong>
                          <div className="text-red-700">
                            vs {(card as any).matches?.opponent || 'Unknown'} 
                            <div className="text-xs text-red-600">
                              {(card as any).matches?.scheduled_date 
                                ? new Date((card as any).matches.scheduled_date).toLocaleDateString()
                                : 'No date'}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <strong className="text-red-800">Type:</strong>
                          <div className="text-red-700">
                            {card.is_straight_red ? '⚡ Straight Red' : 
                             card.is_automatic_red ? '🔄 Automatic Red (2nd Yellow)' : 
                             'Red Card'}
                          </div>
                        </div>

                        {card.reason && (
                          <div className="md:col-span-2">
                            <strong className="text-red-800">Reason:</strong>
                            <div className="text-red-700">{card.reason}</div>
                          </div>
                        )}

                        <div>
                          <strong className="text-red-800">Suggested Ban:</strong>
                          <div className="text-red-700">{card.ban_games || 1} game(s)</div>
                        </div>

                        <div>
                          <strong className="text-red-800">Competition:</strong>
                          <div className="text-red-700">{(card as any).matches?.match_type || 'League'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      <button
                        onClick={() => handleSubmitToAuthority(card.id, card.ban_games)}
                        disabled={submitting === card.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        {submitting === card.id ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <span>✅</span>
                            Mark Submitted
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📝 Submission Guidelines</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <div>• Red cards must be submitted to the football authority within 7 days of the match</div>
              <div>• Include match details, player information, and incident description</div>
              <div>• Straight red cards typically result in automatic match bans</div>
              <div>• Two yellow cards = automatic red with minimum 1 game ban</div>
              <div>• Serious offenses may result in extended bans (2-3+ games)</div>
            </div>
          </div>
        </>
      )}

      {/* Export Modal */}
      <AnimatePresence>
        {showExport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExport(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Card Submission Report</h3>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">{exportData}</pre>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExport(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <span>📋</span>
                  Copy
                </button>
                <button
                  onClick={downloadExport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <span>📥</span>
                  Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}