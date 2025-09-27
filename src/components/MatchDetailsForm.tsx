/**
 * Match Details Form Component
 * Separated form component for better state management and data binding
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Match, Team } from "../types/match-tracker";
import CardManager from "./CardManager";

interface MatchDetails {
  venue: string;
  referee: boolean;
  weather: string;
  notes: string;
  goalScorers: { playerId: string; playerName: string; assistedBy?: string; minute?: number }[];
  selectedSquad: string[];
}

interface QuickResult {
  homeTeam: string;
  homeTeamCustom: string;
  awayTeam: string;
  awayTeamCustom: string;
  homeScore: number;
  awayScore: number;
  matchDate: string;
  isHomeMatch: boolean;
  matchType: string;
}

interface MatchDetailsFormProps {
  details: MatchDetails;
  setDetails: React.Dispatch<React.SetStateAction<MatchDetails>>;
  quickResult: QuickResult;
  editingMatch: Match | null;
  teams: Team[];
  players: any[]; // Add players prop for card management
  onBack: () => void;
  onSave: () => Promise<void>;
  isFutureMatch: () => boolean;
  getAvailablePlayers: () => any[];
  getRVRGoals: () => number;
  getAvailableVenues: () => string[];
  showAddVenue: boolean;
  setShowAddVenue: (show: boolean) => void;
  newVenueName: string;
  setNewVenueName: (name: string) => void;
  addNewVenue: () => Promise<void>;
}

export default function MatchDetailsForm({
  details,
  setDetails,
  quickResult,
  editingMatch,
  teams,
  players,
  onBack,
  onSave,
  isFutureMatch,
  getAvailablePlayers,
  getRVRGoals,
  getAvailableVenues,
  showAddVenue,
  setShowAddVenue,
  newVenueName,
  setNewVenueName,
  addNewVenue
}: MatchDetailsFormProps) {
  
  // Force re-render when editingMatch changes
  const [renderKey, setRenderKey] = useState(0);
  
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [editingMatch?.id]);

  // Debug logging
  useEffect(() => {
    if (editingMatch) {
      console.log('🔧 MatchDetailsForm - Current state:', {
        weather: details.weather,
        selectedSquad: details.selectedSquad.length,
        goalScorers: details.goalScorers.length,
        notes: details.notes?.substring(0, 30) + '...',
        editingMatchId: editingMatch.id
      });
    }
  }, [details, editingMatch]);

  return (
    <motion.div
      key={`details-form-${renderKey}`}
      className="bg-white rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {isFutureMatch() ? '📅 Match Details (Optional)' : '📋 Additional Details (Optional)'}
      </h2>
      
      {/* Debug Info */}
      {editingMatch && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs text-blue-800">
            <strong>Debug Info:</strong> Weather="{details.weather}", Squad={details.selectedSquad.length}, Goals={details.goalScorers.length}
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Venue and Referee */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
            <div className="space-y-2">
              <select
                value={details.venue}
                onChange={(e) => {
                  console.log('🏟️ Venue changed to:', e.target.value);
                  setDetails(prev => ({ ...prev, venue: e.target.value }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getAvailableVenues().map(venue => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
              
              {/* Add New Venue Button */}
              {!showAddVenue && (
                <button
                  type="button"
                  onClick={() => setShowAddVenue(true)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                >
                  <span>➕</span>
                  <span>Add New Venue</span>
                </button>
              )}
              
              {/* Add New Venue Form */}
              {showAddVenue && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Enter venue name..."
                      value={newVenueName}
                      onChange={(e) => setNewVenueName(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addNewVenue();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addNewVenue}
                      disabled={!newVenueName.trim()}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddVenue(false);
                        setNewVenueName('');
                      }}
                      className="px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Referee Present</label>
            {/* Debug Info */}
            <div className="text-xs text-gray-500 mb-1">
              Current value: {String(details.referee)} (type: {typeof details.referee})
            </div>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => {
                  console.log('👨‍⚖️ Referee button clicked: YES');
                  setDetails(prev => ({ ...prev, referee: true }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  details.referee === true 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-green-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  details.referee === true ? 'border-green-500 bg-green-500' : 'border-gray-400'
                }`}>
                  {details.referee === true && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="font-medium">Yes</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  console.log('👨‍⚖️ Referee button clicked: NO');
                  setDetails(prev => ({ ...prev, referee: false }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  details.referee === false 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  details.referee === false ? 'border-red-500 bg-red-500' : 'border-gray-400'
                }`}>
                  {details.referee === false && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="font-medium">No</span>
              </button>
            </div>
          </div>
        </div>

        {/* Weather */}
        <WeatherSelector 
          value={details.weather}
          onChange={(weather) => {
            console.log('🌤️ Weather changed to:', weather);
            setDetails(prev => ({ ...prev, weather }));
          }}
          renderKey={renderKey}
        />

        {/* Squad Selection */}
        {!isFutureMatch() && getAvailablePlayers().length > 0 && (
          <SquadSelector
            selectedSquad={details.selectedSquad}
            availablePlayers={getAvailablePlayers()}
            onChange={(selectedSquad) => {
              console.log('👥 Squad changed to:', selectedSquad.length, 'players');
              setDetails(prev => ({ ...prev, selectedSquad }));
            }}
            renderKey={renderKey}
          />
        )}

        {/* Goal Scorers */}
        {!isFutureMatch() && getRVRGoals() > 0 && (
          <GoalScorersSelector
            goalScorers={details.goalScorers}
            selectedSquad={details.selectedSquad}
            availablePlayers={getAvailablePlayers()}
            goalCount={getRVRGoals()}
            onChange={(goalScorers) => {
              console.log('⚽ Goal scorers changed to:', goalScorers.length);
              setDetails(prev => ({ ...prev, goalScorers }));
            }}
            renderKey={renderKey}
          />
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Match Notes</label>
          <textarea
            value={details.notes}
            onChange={(e) => {
              console.log('📝 Notes changed to:', e.target.value.substring(0, 20) + '...');
              setDetails(prev => ({ ...prev, notes: e.target.value }));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Key moments, player performances, etc."
          />
        </div>

        {/* Card Management */}
        {editingMatch?.id && !isFutureMatch() && (
          <div>
            <CardManager
              matchId={editingMatch.id}
              players={players}
              opponentName={quickResult.awayTeamCustom || teams.find(t => t.id === quickResult.awayTeam)?.name || 'Unknown Opponent'}
              onCardAdded={(card) => {
                console.log('Card added:', card);
              }}
              onCardRemoved={(cardId) => {
                console.log('Card removed:', cardId);
              }}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
        >
          ← Back
        </button>
        
        <button
          onClick={onSave}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          ✅ Save Match
        </button>
      </div>
    </motion.div>
  );
}

// Weather Selector Component
function WeatherSelector({ value, onChange, renderKey }: { value: string; onChange: (value: string) => void; renderKey: number }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Weather Conditions</label>
      <select
        value={value || ''}
        onChange={(e) => {
          console.log('🌤️ Weather selector changed from:', value, 'to:', e.target.value);
          onChange(e.target.value);
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select...</option>
        <option value="Sunny">☀️ Sunny</option>
        <option value="Partly Cloudy">⛅ Partly Cloudy</option>
        <option value="Cloudy">☁️ Cloudy</option>
        <option value="Light Rain">🌦️ Light Rain</option>
        <option value="Heavy Rain">🌧️ Heavy Rain</option>
        <option value="Windy">💨 Windy</option>
        <option value="Foggy">🌫️ Foggy</option>
      </select>
    </div>
  );
}

// Squad Selector Component
function SquadSelector({ 
  selectedSquad, 
  availablePlayers, 
  onChange, 
  renderKey 
}: { 
  selectedSquad: string[]; 
  availablePlayers: any[]; 
  onChange: (selectedSquad: string[]) => void; 
  renderKey: number;
}) {
  // Ensure selectedSquad is always an array
  const currentSelectedSquad = Array.isArray(selectedSquad) ? selectedSquad : [];
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Match Squad (Select players who played)
      </label>
      <div 
        className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200"
      >
        {availablePlayers.map((player) => {
          const isSelected = currentSelectedSquad.includes(player.id);
          return (
            <label 
              key={`${player.id}-${renderKey}`} 
              className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...currentSelectedSquad, player.id]);
                  } else {
                    onChange(currentSelectedSquad.filter(id => id !== player.id));
                  }
                }}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {player.name}
                {player.position && <span className="text-gray-500 ml-1">({player.position})</span>}
              </span>
            </label>
          );
        })}
      </div>
      {currentSelectedSquad.length > 0 && (
        <p className="text-sm text-green-600 mt-2">
          ✅ {currentSelectedSquad.length} player{currentSelectedSquad.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}

// Goal Scorers Selector Component
function GoalScorersSelector({
  goalScorers,
  selectedSquad,
  availablePlayers,
  goalCount,
  onChange,
  renderKey
}: {
  goalScorers: any[];
  selectedSquad: string[];
  availablePlayers: any[];
  goalCount: number;
  onChange: (goalScorers: any[]) => void;
  renderKey: number;
}) {
  // Ensure goalScorers is always an array
  const currentGoalScorers = Array.isArray(goalScorers) ? goalScorers : [];
  const currentSelectedSquad = Array.isArray(selectedSquad) ? selectedSquad : [];
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Goal Scorers ({goalCount} goal{goalCount !== 1 ? 's' : ''})
      </label>
      <div className="space-y-3">
        {Array.from({ length: goalCount }, (_, index) => {
          const scorer = currentGoalScorers[index] || { playerId: '', playerName: '', assistedBy: '', minute: 0 };
          
          return (
            <div 
              key={`goal-${index}-${renderKey}`} 
              className="flex gap-2 items-center p-3 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="text-sm font-medium text-gray-600 w-12">
                Goal {index + 1}:
              </div>
              
              {/* Goal Scorer Select */}
              <select
                value={scorer.playerId || ''}
                onChange={(e) => {
                  const selectedPlayer = availablePlayers.find(p => p.id === e.target.value);
                  const newScorers = [...currentGoalScorers];
                  while (newScorers.length <= index) {
                    newScorers.push({ playerId: '', playerName: '', assistedBy: '', minute: 0 });
                  }
                  newScorers[index] = { 
                    ...newScorers[index], 
                    playerId: e.target.value,
                    playerName: selectedPlayer?.name || ''
                  };
                  onChange(newScorers);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select player...</option>
                {(currentSelectedSquad.length > 0 ? 
                  currentSelectedSquad.map(playerId => availablePlayers.find(p => p.id === playerId)).filter(Boolean) :
                  availablePlayers
                ).map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name} {player.position && `(${player.position})`}
                  </option>
                ))}
              </select>
              
              {/* Assist Select */}
              <select
                value={scorer.assistedBy || ''}
                onChange={(e) => {
                  const newScorers = [...currentGoalScorers];
                  while (newScorers.length <= index) {
                    newScorers.push({ playerId: '', playerName: '', assistedBy: '', minute: 0 });
                  }
                  newScorers[index] = { ...newScorers[index], assistedBy: e.target.value };
                  onChange(newScorers);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Assisted by...</option>
                {(currentSelectedSquad.length > 0 ? 
                  currentSelectedSquad.map(playerId => availablePlayers.find(p => p.id === playerId)).filter(Boolean) :
                  availablePlayers
                ).filter(player => player.id !== scorer.playerId).map(player => (
                  <option key={player.id} value={player.name}>
                    {player.name} {player.position && `(${player.position})`}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}