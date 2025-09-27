/**
 * Card Manager Component for Match Recorder
 * Professional card tracking with yellow/red logic and authority submission
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cardManager, Card, CardSummary } from '../lib/card-manager';

interface CardManagerProps {
  matchId: string;
  players: any[];
  opponentName: string;
  onCardAdded?: (card: Card) => void;
  onCardRemoved?: (cardId: string) => void;
}

interface NewCard {
  minute: number;
  player_id?: string;
  player_name: string;
  team_side: 'ours' | 'theirs';
  card: 'yellow' | 'red';
  reason: string;
  is_straight_red?: boolean;
}

export default function CardManager({
  matchId,
  players,
  opponentName,
  onCardAdded,
  onCardRemoved
}: CardManagerProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [summary, setSummary] = useState<CardSummary | null>(null);
  const [showAddCard, setShowAddCard] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newCard, setNewCard] = useState<NewCard>({
    minute: 1,
    player_id: '',
    player_name: '',
    team_side: 'ours',
    card: 'yellow',
    reason: '',
    is_straight_red: false
  });

  // Load cards when component mounts or matchId changes
  useEffect(() => {
    if (matchId) {
      loadCards();
    }
  }, [matchId, players]);

  const loadCards = async () => {
    try {
      const matchCards = await cardManager.getMatchCards(matchId);
      const cardSummary = await cardManager.getMatchCardSummary(matchId);
      
      // Enhance cards with player names if missing
      const enhancedCards = await Promise.all(
        matchCards.map(async (card) => {
          if (!card.player_name && card.player_id && card.team_side === 'ours') {
            // Look up player name from players list
            const player = players.find(p => p.id === card.player_id);
            if (player) {
              return {
                ...card,
                player_name: player.name || `${player.first_name || ''} ${player.last_name || ''}`.trim()
              };
            }
          }
          return card;
        })
      );
      
      setCards(enhancedCards);
      setSummary(cardSummary);
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const handleAddCard = async () => {
    if (!newCard.player_name.trim() || newCard.minute < 1) {
      alert('Please enter player name and valid minute');
      return;
    }

    setLoading(true);
    try {
      const cardData = {
        match_id: matchId,
        minute: newCard.minute,
        player_id: newCard.player_id || undefined,
        player_name: newCard.player_name,
        team_side: newCard.team_side,
        card: newCard.card,
        reason: newCard.reason,
        is_straight_red: newCard.card === 'red' ? newCard.is_straight_red : false,
        is_automatic_red: false
      };

      console.log('🃏 Adding card with data:', cardData);
      const addedCard = await cardManager.addCard(cardData);
      
      if (addedCard) {
        await loadCards(); // Reload to get updated summary
        onCardAdded?.(addedCard);
        
        // Reset form
        setNewCard({
          minute: Math.max(1, newCard.minute + 1),
          player_id: '',
          player_name: '',
          team_side: 'ours',
          card: 'yellow',
          reason: '',
          is_straight_red: false
        });
        setShowAddCard(false);
      } else {
        console.error('Failed to add card - cardManager returned null. Check database connection and table structure.');
        alert('Failed to add card. This may be because the cards table does not exist in your database. Please check the browser console for the SQL needed to create the table.');
      }
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Error adding card');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to remove this card?')) {
      return;
    }

    try {
      const success = await cardManager.removeCard(cardId);
      if (success) {
        await loadCards();
        onCardRemoved?.(cardId);
      } else {
        alert('Failed to remove card');
      }
    } catch (error) {
      console.error('Error removing card:', error);
      alert('Error removing card');
    }
  };

  const handlePlayerSelect = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      // Handle null/undefined values properly
      const firstName = player.first_name || '';
      const lastName = player.last_name && player.last_name !== 'null' ? player.last_name : '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      setNewCard(prev => ({
        ...prev,
        player_id: playerId,
        player_name: fullName
      }));
    }
  };

  const commonReasons = [
    'Unsporting behaviour',
    'Dissent by word or action',
    'Persistent fouling',
    'Delaying the restart of play',
    'Serious foul play',
    'Violent conduct',
    'Abusive language',
    'Second yellow card',
    'Other'
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          🟨🟥 Card Management
        </h3>
        <button
          onClick={() => setShowAddCard(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          Add Card
        </button>
      </div>

      {/* Card Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.yellowCards.length}</div>
            <div className="text-xs text-yellow-700">Yellow Cards</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{summary.redCards.length}</div>
            <div className="text-xs text-red-700">Red Cards</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{summary.automaticReds.length}</div>
            <div className="text-xs text-orange-700">Auto Reds</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{summary.pendingSubmissions.length}</div>
            <div className="text-xs text-purple-700">Pending</div>
          </div>
        </div>
      )}

      {/* Warning for players with two yellows */}
      {summary?.playersWithTwoYellows.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-orange-900 mb-2">⚠️ Players with Two Yellow Cards</h4>
          <div className="text-sm text-orange-800">
            These players should have automatic red cards:
            <ul className="list-disc list-inside mt-1">
              {summary.playersWithTwoYellows.map((playerId, idx) => {
                const player = players.find(p => p.id === playerId);
                return (
                  <li key={idx}>
                    {player ? `${player.first_name} ${player.last_name}` : `Player ID: ${playerId}`}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Cards List */}
      <div className="space-y-3">
        <AnimatePresence>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                card.card === 'yellow' 
                  ? 'bg-yellow-50 border-yellow-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {card.minute}'
                  </span>
                  <div className={`w-6 h-8 rounded-sm ${
                    card.card === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'
                  }`}></div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900">
                    {card.player_name || 'Unknown Player'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {card.team_side === 'ours' ? 'Our Team' : opponentName}
                  </div>
                  {card.reason && (
                    <div className="text-xs text-gray-500 italic mt-1">
                      {card.reason}
                    </div>
                  )}
                  {card.is_automatic_red && (
                    <div className="text-xs text-orange-600 font-medium mt-1">
                      🔄 Automatic Red (Second Yellow)
                    </div>
                  )}
                  {card.is_straight_red && (
                    <div className="text-xs text-red-600 font-medium mt-1">
                      ⚡ Straight Red Card
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {card.card === 'red' && !card.submitted_to_authority && (
                  <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    📋 Needs Authority Submission
                  </div>
                )}
                <button
                  onClick={() => handleRemoveCard(card.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Remove card"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {cards.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🟨🟥</div>
            <div>No cards recorded for this match</div>
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddCard(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Card</h3>
              
              <div className="space-y-4">
                {/* Minute */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minute
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newCard.minute}
                    onChange={(e) => setNewCard(prev => ({ ...prev, minute: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Team Side */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCard(prev => ({ ...prev, team_side: 'ours' }))}
                      className={`px-3 py-2 rounded-lg border ${
                        newCard.team_side === 'ours'
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    >
                      Our Team
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCard(prev => ({ ...prev, team_side: 'theirs' }))}
                      className={`px-3 py-2 rounded-lg border ${
                        newCard.team_side === 'theirs'
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    >
                      {opponentName}
                    </button>
                  </div>
                </div>

                {/* Player Selection */}
                {newCard.team_side === 'ours' && players.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Player (Our Team)
                    </label>
                    <select
                      value={newCard.player_id}
                      onChange={(e) => handlePlayerSelect(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select player...</option>
                      {players.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.first_name} {player.last_name} {player.jersey_number ? `(#${player.jersey_number})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Manual Player Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Player Name {newCard.team_side === 'theirs' ? `(${opponentName})` : '(Manual Entry)'}
                  </label>
                  <input
                    type="text"
                    value={newCard.player_name}
                    onChange={(e) => setNewCard(prev => ({ ...prev, player_name: e.target.value }))}
                    placeholder="Enter player name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Card Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewCard(prev => ({ ...prev, card: 'yellow' }))}
                      className={`px-3 py-2 rounded-lg border flex items-center justify-center gap-2 ${
                        newCard.card === 'yellow'
                          ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="w-4 h-6 bg-yellow-400 rounded-sm"></div>
                      Yellow
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCard(prev => ({ ...prev, card: 'red' }))}
                      className={`px-3 py-2 rounded-lg border flex items-center justify-center gap-2 ${
                        newCard.card === 'red'
                          ? 'bg-red-50 border-red-300 text-red-700'
                          : 'bg-gray-50 border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="w-4 h-6 bg-red-500 rounded-sm"></div>
                      Red
                    </button>
                  </div>
                </div>

                {/* Red Card Type */}
                {newCard.card === 'red' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Red Card Type
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newCard.is_straight_red}
                          onChange={(e) => setNewCard(prev => ({ ...prev, is_straight_red: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm">Straight Red Card (not second yellow)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <select
                    value={commonReasons.includes(newCard.reason) ? newCard.reason : 'Other'}
                    onChange={(e) => {
                      if (e.target.value === 'Other') {
                        // Don't auto-populate "Other" - let user type custom reason
                        setNewCard(prev => ({ ...prev, reason: '' }));
                      } else {
                        setNewCard(prev => ({ ...prev, reason: e.target.value }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  >
                    <option value="">Select reason...</option>
                    {commonReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                  {/* Only show custom input if "Other" is selected or if current reason is not in common reasons */}
                  {(!commonReasons.includes(newCard.reason) || newCard.reason === '') && (
                    <input
                      type="text"
                      value={newCard.reason}
                      onChange={(e) => setNewCard(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Enter custom reason"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  disabled={loading || !newCard.player_name.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Card'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}