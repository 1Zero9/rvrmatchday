/**
 * Complete Match Central Content Component  
 * Full restoration of the original match-central.tsx with all functionality
 * Consolidates live dashboard, fixtures, results, tables, and match tracker
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import StandardLayout from "./StandardLayout";
import CelebrationResultCard from "./CelebrationResultCard";
import MobileBottomNav from "./MobileBottomNav";
import AdvancedTeamFilter from "./AdvancedTeamFilter";
import LoginButton from "./LoginButton";
import { useAuth } from "./SecureAuth";
import { supabase } from "../lib/supabase";
import { Team, TeamSummary, Match } from "../types/match-tracker";
import { VERSION_CONFIG } from "../config/version";
import { MatchTypeBadge } from "./MatchTypeBadge";
import { getMatchTypeCardColors } from "../lib/match-type-colors";
import MatchStatusManager from "./MatchStatusManager";

// Chart.js imports and setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type TabType = 'overview' | 'fixtures' | 'management' | 'statistics';

// Component for displaying players in match results card
function MatchPlayersDisplay({ match }: { match: Match }) {
  const [selectedPlayers, setSelectedPlayers] = React.useState<any[]>([]);
  
  React.useEffect(() => {
    const loadSelectedPlayers = async () => {
      try {
        console.log('🔍 Loading players for match:', match.id);
        
        // Get selected squad from matches table (selected_squad field)
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .select('selected_squad')
          .eq('id', match.id)
          .single();

        if (matchData && matchData.selected_squad && !matchError) {
          console.log('✅ Found match with squad data:', matchData.selected_squad);
          
          // Parse selected_squad (could be JSON string or array)
          let selectedSquad: string[] = [];
          if (Array.isArray(matchData.selected_squad)) {
            selectedSquad = matchData.selected_squad;
          } else if (typeof matchData.selected_squad === 'string') {
            try {
              selectedSquad = JSON.parse(matchData.selected_squad);
            } catch (e) {
              console.warn('Failed to parse selected_squad JSON:', matchData.selected_squad);
              selectedSquad = [];
            }
          }

          console.log('✅ Parsed squad:', selectedSquad.length, 'selected player IDs');
          
          if (selectedSquad.length > 0) {
            // Get player details for the selected player IDs
            const { data: playersData, error: playersError } = await supabase
              .from('players')
              .select('id, first_name, last_name, position')
              .in('id', selectedSquad);

            if (playersData && !playersError) {
              const players = playersData.map(player => ({
                id: player.id,
                name: `${player.first_name || ''}${player.last_name && player.last_name !== 'null' ? ` ${player.last_name}` : ''}`.trim() || 'Unknown Player',
                position: player.position || 'Player'
              }));
              console.log('✅ Found player details:', players.length, 'players');
              setSelectedPlayers(players);
            } else {
              console.warn('❌ Failed to get player details:', playersError);
              setSelectedPlayers([]);
            }
          } else {
            console.log('ℹ️ No squad selected for this match');
            setSelectedPlayers([]);
          }
        } else {
          console.log('ℹ️ No squad data found for match');
          setSelectedPlayers([]);
        }
      } catch (error) {
        console.error('Error loading selected players:', error);
        setSelectedPlayers([]);
      }
    };

    loadSelectedPlayers();
  }, [match.id]);

  if (selectedPlayers.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">👥</span>
        <h4 className="text-sm font-bold text-purple-900">Selected Squad</h4>
        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
          {selectedPlayers.length} players
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {selectedPlayers.map((player, index) => (
          <div key={player.id || index} className="bg-white rounded-lg p-2 border border-purple-200">
            <div className="font-medium text-purple-900 truncate">{player.name}</div>
            <div className="text-purple-600 text-xs">{player.position}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Expanded Match Details Component
function MatchExpandedDetails({ match }: { match: Match }) {
  const [events, setEvents] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [playerLookup, setPlayerLookup] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const loadMatchDetails = async () => {
      try {
        console.log('🔍 Loading match details for:', match.id);

        // Load match events
        const { data: eventsData } = await supabase
          .from('match_events')
          .select('*')
          .eq('match_id', match.id)
          .order('event_minute');

        // Load cards from cards table
        const { data: cardsData } = await supabase
          .from('cards')
          .select('*')
          .eq('match_id', match.id)
          .order('minute');

        console.log('📋 Match events loaded:', eventsData?.length || 0);
        console.log('🟨🟥 Cards loaded:', cardsData?.length || 0);

        // Load all players to create a lookup map
        const { data: allPlayersData } = await supabase
          .from('players')
          .select('id, first_name, last_name, position');

        const lookup = new Map<string, string>();
        if (allPlayersData) {
          allPlayersData.forEach(player => {
            const fullName = `${player.first_name || ''} ${player.last_name && player.last_name !== 'null' ? player.last_name : ''}`.trim();
            lookup.set(player.id, fullName);
          });
        }
        setPlayerLookup(lookup);

        // Load selected players for squad display
        if (match.selectedSquad) {
          let playerIds: string[] = [];
          if (Array.isArray(match.selectedSquad)) {
            playerIds = match.selectedSquad;
          } else if (typeof match.selectedSquad === 'string') {
            try {
              playerIds = JSON.parse(match.selectedSquad);
            } catch (e) {
              console.error('Failed to parse selectedSquad string:', e);
              playerIds = [];
            }
          }

          if (playerIds.length > 0) {
            const selectedPlayers = playerIds.map(id => {
              const playerData = allPlayersData?.find(p => p.id === id);
              const playerName = lookup.get(id);
              return {
                id,
                name: playerName || 'Unknown Player',
                position: playerData?.position || 'Player'
              };
            });
            setPlayers(selectedPlayers);
          }
        }

        setEvents(eventsData || []);
        setCards(cardsData || []);
      } catch (error) {
        console.error('Error loading match details:', error);
      }
    };

    loadMatchDetails();
  }, [match.id, match.selectedSquad]);

  // Separate events by type for better display
  const goalEvents = events.filter(event => event.event_type === 'Goal');
  const cardEventsFromEvents = events.filter(event => event.event_type === 'Yellow Card' || event.event_type === 'Red Card');
  const substitutionEvents = events.filter(event => event.event_type === 'Substitution');
  const otherEvents = events.filter(event => 
    !['Goal', 'Yellow Card', 'Red Card', 'Substitution'].includes(event.event_type)
  );

  // Combine cards from both sources (cards table and legacy match_events)
  const allCards = [
    ...cards.map(card => ({
      minute: card.minute,
      type: card.card,
      playerName: card.player_name || playerLookup.get(card.player_id) || 'Unknown Player',
      reason: card.reason,
      isAutomatic: card.is_automatic_red,
      isStraight: card.is_straight_red,
      source: 'cards_table'
    })),
    ...cardEventsFromEvents.map(event => ({
      minute: event.event_minute || event.minute,
      type: event.event_type === 'Yellow Card' ? 'yellow' : 'red',
      playerName: event.player_name,
      reason: event.notes,
      isAutomatic: false,
      isStraight: false,
      source: 'match_events'
    }))
  ].sort((a, b) => a.minute - b.minute);

  return (
    <div className="space-y-4">
      {/* Compact Match Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
          {/* Left Side - Match Info */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Competition:</span>
              <span className="text-blue-900">{match.matchType || 'League'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Venue:</span>
              <span className="text-blue-900">{match.venue || (match.isHomeMatch ? 'Home' : 'Away')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Date:</span>
              <span className="text-blue-900">{new Date(match.scheduledDate).toLocaleDateString()}</span>
            </div>
            {match.referee && (
              <div className="flex justify-between">
                <span className="text-blue-700 font-medium">Referee:</span>
                <span className="text-blue-900">{match.referee === 'Yes' ? '✅' : '❌'}</span>
              </div>
            )}
          </div>
          
          {/* Right Side - Score & Key Info */}
          <div className="space-y-2">
            <div className="text-center">
              <div className="text-blue-700 font-medium text-xs">Final Score</div>
              <div className="text-blue-900 font-bold text-lg">
                {match.homeScore !== undefined && match.awayScore !== undefined 
                  ? `${match.homeScore} - ${match.awayScore}` 
                  : 'Not recorded'}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 font-medium">Weather:</span>
              <span className="text-blue-900">{match.weather || 'Not recorded'}</span>
            </div>
            {match.playerOfTheMatch && (
              <div className="text-center">
                <div className="text-blue-700 font-medium text-xs">⭐ Player of Match</div>
                <div className="text-blue-900 font-semibold">{match.playerOfTheMatch}</div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Compact Goals & Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Goals */}
        {goalEvents.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h6 className="font-bold text-green-900 mb-2 text-sm">⚽ Goals ({goalEvents.length})</h6>
            <div className="space-y-2">
              {goalEvents.map((event, index) => {
                // Extract assist info
                let assistName = event.event_data?.assistPlayerName;
                
                if (!assistName && event.notes && event.notes.includes('Assist:')) {
                  // Simple string parsing: "Assist: Finn" -> "Finn"
                  const parts = event.notes.split('Assist:');
                  if (parts.length > 1) {
                    assistName = parts[1].trim();
                  }
                }

                return (
                  <div key={index} className="flex items-center justify-between bg-white rounded p-2 border border-green-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-500 text-white font-bold rounded-full flex items-center justify-center text-xs">
                        {event.event_minute || event.minute}'
                      </span>
                      <div>
                        <div className="font-medium text-green-900">{event.player_name}</div>
                        {assistName && (
                          <div className="text-green-700 font-medium text-xs">
                            🎯 {assistName}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cards */}
        {allCards.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <h6 className="font-bold text-yellow-900 mb-2 text-sm">🟨🟥 Cards ({allCards.length})</h6>
            <div className="space-y-2">
              {allCards.map((card, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded p-2 border border-yellow-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-gray-100 text-gray-700 font-bold rounded-full flex items-center justify-center text-xs">
                      {card.minute}'
                    </span>
                    <div className={`w-4 h-5 rounded-sm ${card.type === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium text-yellow-900">{card.playerName}</div>
                      {card.reason && (
                        <div className="text-yellow-700 truncate max-w-24">{card.reason}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* Additional Info - Substitutions & Squad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Substitutions */}
        {substitutionEvents.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h6 className="font-bold text-purple-900 mb-2 text-sm">🔄 Substitutions ({substitutionEvents.length})</h6>
            <div className="space-y-2">
              {substitutionEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-2 bg-white rounded p-2 border border-purple-100 text-xs">
                  <span className="w-6 h-6 bg-purple-100 text-purple-700 font-bold rounded-full flex items-center justify-center">
                    {event.event_minute || event.minute}'
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-red-600">⬇️ {event.event_data?.playerOut || 'Out'}</span>
                    <span className="text-purple-600">→</span>
                    <span className="text-green-600">⬆️ {event.player_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Other Events */}
      {otherEvents.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 className="font-bold text-gray-800 mb-3 flex items-center">
            📝 Other Events ({otherEvents.length})
          </h5>
          <div className="space-y-2">
            {otherEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="w-8 text-xs bg-gray-200 px-1 py-0.5 rounded text-center">
                  {event.event_minute || event.minute}'
                </span>
                <span className="font-medium">{event.event_type}</span>
                {event.player_name && (
                  <span className="text-gray-600">- {event.player_name}</span>
                )}
                {event.notes && (
                  <span className="text-xs text-gray-500 italic">({event.notes})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Notes */}
      {match.notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-bold text-blue-900 mb-3 flex items-center">
            📝 Match Notes
          </h5>
          <div className="text-blue-800 text-sm leading-relaxed whitespace-pre-wrap">
            {match.notes}
          </div>
        </div>
      )}

      {/* Match Squad */}
      {players.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h5 className="font-bold text-indigo-900 mb-3 flex items-center">
            👥 Match Squad ({players.length} players)
          </h5>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {players.map((player) => (
              <div key={player.id} className="bg-white border border-indigo-100 rounded-lg p-2 text-center">
                <div className="font-medium text-indigo-900 text-xs truncate">
                  {player.name}
                </div>
                <div className="text-indigo-600 text-xs mt-1">{player.position || 'Player'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Statistics Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h5 className="font-bold text-gray-800 mb-3 flex items-center">
          📊 Match Statistics
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{goalEvents.length}</div>
            <div className="text-gray-600">Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{allCards.filter(card => card.type === 'yellow').length}</div>
            <div className="text-gray-600">Yellow Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{allCards.filter(card => card.type === 'red').length}</div>
            <div className="text-gray-600">Red Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{substitutionEvents.length}</div>
            <div className="text-gray-600">Substitutions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Collapsible Team Card Component
function CollapsibleTeamCard({ 
  team, 
  onEdit, 
  onDelete 
}: { 
  team: Team; 
  onEdit: () => void; 
  onDelete: () => void; 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTeamDetails = async () => {
    if (loading || isExpanded) return;
    
    setLoading(true);
    try {
      // Load players
      const { data: playersData } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', team.id)
        .order('first_name');

      // Load recent matches
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*')
        .or(`team_id.eq.${team.id},opponent_id.eq.${team.id}`)
        .order('match_date', { ascending: false })
        .limit(5);

      setPlayers(playersData || []);
      setMatches(matchesData || []);
    } catch (error) {
      console.error('Error loading team details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = () => {
    if (!isExpanded) {
      loadTeamDetails();
    }
    setIsExpanded(!isExpanded);
  };

  // Get team statistics
  const teamMatches = matches.filter(m => m.team_id === team.id);
  const wins = teamMatches.filter(m => m.result === 'Win').length;
  const draws = teamMatches.filter(m => m.result === 'Draw').length;
  const losses = teamMatches.filter(m => m.result === 'Loss').length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Team Header - Always Visible */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl text-white">⚽</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{team.age_group || 'Unknown Age'}</span>
                <span>•</span>
                <span>{team.league || 'Unknown League'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Stats */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                {players.length} players
              </span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {teamMatches.length} matches
              </span>
            </div>
            
            {/* Expand Arrow */}
            <div className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
              <span className="text-lg">▶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200"
          >
            <div className="p-4 space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading team details...</p>
                </div>
              ) : (
                <>
                  {/* Team Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-gray-900">{players.length}</div>
                      <div className="text-xs text-gray-600">Players</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-700">{wins}</div>
                      <div className="text-xs text-green-600">Wins</div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-yellow-700">{draws}</div>
                      <div className="text-xs text-yellow-600">Draws</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-700">{losses}</div>
                      <div className="text-xs text-red-600">Losses</div>
                    </div>
                  </div>

                  {/* Players List */}
                  {players.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Squad ({players.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                        {players.map((player) => (
                          <div key={player.id} className="bg-gray-50 rounded p-2 text-sm">
                            <div className="font-medium text-gray-900 truncate">
                              {`${player.first_name || ''}${player.last_name && player.last_name !== 'null' ? ` ${player.last_name}` : ''}`.trim() || 'Unknown Player'}
                            </div>
                            <div className="text-gray-600 text-xs">{player.position || 'Player'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Matches */}
                  {teamMatches.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recent Matches</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {teamMatches.slice(0, 3).map((match) => (
                          <div key={match.id} className="bg-gray-50 rounded p-2 text-sm flex items-center justify-between">
                            <div>
                              <div className="font-medium">vs {match.opponent_name}</div>
                              <div className="text-gray-600 text-xs">
                                {match.match_date ? new Date(match.match_date).toLocaleDateString() : 'No date'}
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              match.result === 'Win' ? 'bg-green-100 text-green-700' :
                              match.result === 'Draw' ? 'bg-yellow-100 text-yellow-700' :
                              match.result === 'Loss' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {match.result || 'TBD'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={onEdit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      ✏️ Edit Team
                    </button>
                    <button
                      onClick={onDelete}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MatchCentralContent() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [overviewFilter, setOverviewFilter] = useState<string>('all');
  const [advancedTeamFilter, setAdvancedTeamFilter] = useState<string>('all');
  const [matchTypeFilter, setMatchTypeFilter] = useState<Set<string>>(new Set(['League']));
  // Removed cards view option - only list view now
  // const [viewMode, setViewMode] = useState<'list' | 'cards'>('list');
  const [loading, setLoading] = useState(true);
  const [expandedResults, setExpandedResults] = useState<{[key: string]: boolean}>({});
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [unrecordedMatches, setUnrecordedMatches] = useState<Match[]>([]);
  const [deleteModal, setDeleteModal] = useState<{show: boolean; matchId: string; matchName: string; type: 'match' | 'fixture'}>({
    show: false,
    matchId: '',
    matchName: '',
    type: 'match'
  });
  // Authentication handled by RequireAuth wrapper - no secondary auth needed
  const [selectedStatsTeam, setSelectedStatsTeam] = useState<string>('all');
  const [selectedMatchTypes, setSelectedMatchTypes] = useState<Set<string>>(new Set(['League']));
  const [showCancelledPostponed, setShowCancelledPostponed] = useState<boolean>(true);
  const [playerStats, setPlayerStats] = useState<{ topScorers: any[]; topAssists: any[]; mostMatches: any[]; }>({ topScorers: [], topAssists: [], mostMatches: [] });
  const [matchesWithExtra, setMatchesWithExtra] = useState<{[key: string]: boolean}>({});
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [collapsedTeamSections, setCollapsedTeamSections] = useState<{[key: string]: boolean}>({
    rvrTeams: false,
    leagueOpponents: false,
    friendlyOpponents: false,
    otherOpponents: false
  });
  const [fullScreenMatch, setFullScreenMatch] = useState<Match | null>(null);
  const [overlayMatch, setOverlayMatch] = useState<Match | null>(null);

  const toggleMatchExpand = (matchId: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  // Full-screen match modal functions
  const openFullScreenMatch = (match: Match) => {
    setFullScreenMatch(match);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeFullScreenMatch = () => {
    setFullScreenMatch(null);
    document.body.style.overflow = 'unset'; // Restore scroll
  };

  // Keyboard escape functionality
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullScreenMatch) {
        closeFullScreenMatch();
      }
    };

    if (fullScreenMatch) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [fullScreenMatch]);

  const togglePlayerSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleTeamSection = (section: string) => {
    setCollapsedTeamSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasExtraInfo = async (match: Match) => {
    // Check if match has additional information to show when expanded
    const hasBasicExtra = match.veoRecording || 
           match.veoUrl ||
           (match.notes && match.notes.length > 0) ||
           (match.playerOfTheMatch && match.playerOfTheMatch.length > 0) ||
           (match.yellowCards && match.yellowCards.length > 0) ||
           (match.redCards && match.redCards.length > 0) ||
           (match.attendance && match.attendance > 0);
    
    // Check for goal events
    try {
      // Load match events from database to check for additional content
      const { data: goalEvents, error } = await supabase
        .from('match_events')
        .select('id')
        .eq('match_id', match.id)
        .eq('event_type', 'Goal');
      
      const hasGoalEvents = !error && goalEvents && goalEvents.length > 0;
      return hasBasicExtra || hasGoalEvents;
    } catch (error) {
      return hasBasicExtra;
    }
  };

  // Helper function to check if a match needs recording
  const isMatchUnrecorded = (match: Match) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    const matchDate = new Date(match.scheduledDate);
    const isPastMatch = matchDate < today;
    
    // Don't flag cancelled or postponed matches as needing recording
    if (match.status === 'Cancelled' || match.status === 'Postponed') {
      return false;
    }
    
    const isScheduled = match.status === 'Scheduled';
    const noScore = (match.homeScore === 0 || match.homeScore === null) && 
                   (match.awayScore === 0 || match.awayScore === null);
    
    return isPastMatch && (isScheduled || noScore);
  };

  // Delete match handler
  const handleDeleteMatch = async (matchId: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);
      
      if (error) {
        console.error('Error deleting match:', error);
        alert('Error deleting match. Please try again.');
      } else {
        // Close modal and refresh data
        setDeleteModal({ show: false, matchId: '', matchName: '', type: 'match' });
        loadData();
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Error deleting match. Please try again.');
    }
  };

  const loadData = async () => {
    console.log('🚀 Starting loadData function...');
    try {
      // Load teams directly from database
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`*, players(*)`)
        .order('created_at', { ascending: false });
        
      let loadedTeams: Team[] = [];
      if (teamsError) {
        console.error('Error loading teams from database:', teamsError);
      } else {
        loadedTeams = (teamsData || []).map(team => ({
          id: team.id,
          name: team.name,
          category: team.age_group || 'Unknown',
          ageGroup: team.age_group,
          gender: team.gender,
          season: team.season,
          league: team.league,
          homeVenue: team.home_venue,
          directions: team.directions || [],
          websiteUrl: team.website_url,
          contactEmail: team.contact_email,
          contactPhone: team.contact_phone,
          coaches: team.coaches || [],
          notes: team.notes,
          homeKit: { primary: '#009639', secondary: '#FFFFFF' },
          awayKit: { primary: '#FFFFFF', secondary: '#009639' },
          isOpponent: team.is_opponent || false,
          players: (team.players || []).map(p => ({
            id: p.id,
            teamId: team.id,
            name: p.first_name,
            position: p.position,
            isCaptain: p.is_captain || false,
            isViceCaptain: p.is_vice_captain || false,
            isActive: p.is_active !== false,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at || p.created_at)
          })),
          createdAt: new Date(team.created_at),
          updatedAt: new Date(team.updated_at || team.created_at)
        }));
      }
      setTeams(loadedTeams);
      
      // Load all matches from database
      console.log('🔍 Attempting to load matches from database...');
      console.log('🔗 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('🔑 Supabase Key (first 10 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10));
      
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('📊 Raw database result:', { 
        matchCount: matchesData?.length || 0, 
        error: matchesError,
        firstMatch: matchesData?.[0] ? {
          id: matchesData[0].id,
          opponent: matchesData[0].opponent,
          selectedSquad: matchesData[0].selected_squad
        } : 'No matches'
      });
      
      // Also check for match events
      const { data: eventsData, error: eventsError } = await supabase
        .from('match_events')
        .select('*')
        .limit(5);
      
      console.log('🎯 Match events check:', {
        eventsCount: eventsData?.length || 0,
        eventsError: eventsError,
        sampleEvent: eventsData?.[0] || 'No events'
      });
      
      if (matchesError) {
        console.error('Error loading matches:', matchesError);
        setAllMatches([]);
      } else if (!matchesData || matchesData.length === 0) {
        // If no data in database, create test data for debugging assists
        console.log('🧪 No matches found in database. Creating test data...');
        const testMatches = [{
          id: 'test-match-1',
          teamId: 'rvr-u12-boys',
          opponent: 'Test Opponent FC',
          matchType: 'League' as const,
          isHomeMatch: true,
          venue: 'Test Venue',
          scheduledDate: new Date('2024-01-15T10:00:00'),
          actualKickOff: new Date('2024-01-15T10:00:00'),
          status: 'Finished' as const,
          homeScore: 3,
          awayScore: 1,
          selectedSquad: ['player-1', 'player-2', 'player-3'],
          playerOfTheMatch: 'John Smith',
          yellowCards: '',
          redCards: '',
          attendance: 50,
          notes: 'Great match with excellent teamwork',
          createdAt: new Date(),
          updatedAt: new Date(),
          recordedBy: 'test-user'
        }];
        console.log('🎾 Setting test matches:', testMatches);
        setAllMatches(testMatches);
      } else {
        // Transform database records to match expected interface
        const transformedMatches = (matchesData || []).map(dbMatch => ({
          id: dbMatch.id,
          teamId: dbMatch.team_id,
          opponent: dbMatch.opponent,
          matchType: dbMatch.match_type || 'League',
          isHomeMatch: dbMatch.is_home_match,
          venue: dbMatch.venue,
          scheduledDate: new Date(dbMatch.scheduled_date),
          actualKickOff: dbMatch.actual_kick_off ? new Date(dbMatch.actual_kick_off) : undefined,
          status: dbMatch.status,
          homeScore: dbMatch.home_score || 0,
          awayScore: dbMatch.away_score || 0,
          referee: dbMatch.referee,
          weather: dbMatch.weather,
          notes: dbMatch.notes,
          selectedSquad: dbMatch.selected_squad || [],
          playerOfTheMatch: dbMatch.player_of_match || dbMatch.player_of_the_match,
          yellowCards: dbMatch.yellow_cards,
          redCards: dbMatch.red_cards,
          attendance: dbMatch.attendance,
          createdAt: new Date(dbMatch.created_at),
          updatedAt: new Date(dbMatch.updated_at || dbMatch.created_at)
        }));
        
        console.log('Loaded matches from database:', transformedMatches);
        console.log('🔍 Checking for matches with squad data:');
        transformedMatches.forEach((match, index) => {
          console.log(`📊 Match ${index + 1} Details:`, {
            id: match.id,
            team: match.teamId,
            opponent: match.opponent,
            status: match.status,
            homeScore: match.homeScore,
            awayScore: match.awayScore,
            selectedSquad: match.selectedSquad,
            hasSquadData: match.selectedSquad && match.selectedSquad.length > 0,
            playerOfTheMatch: match.playerOfTheMatch,
            notes: match.notes
          });
          if (match.selectedSquad && match.selectedSquad.length > 0) {
            console.log(`✅ Match ${index + 1}: ${match.teamId} vs ${match.opponent} - Squad: ${match.selectedSquad.length} players`, match.selectedSquad);
          } else {
            console.log(`❌ Match ${index + 1}: ${match.teamId} vs ${match.opponent} - No squad data`);
          }
        });
        setAllMatches(transformedMatches);
        
        // Check for unrecorded past matches and create alerts
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        const unrecordedPastMatches = transformedMatches.filter(match => {
          const matchDate = new Date(match.scheduledDate);
          const isPastMatch = matchDate < today;
          
          // Don't include cancelled or postponed matches in unrecorded list
          if (match.status === 'Cancelled' || match.status === 'Postponed') {
            return false;
          }
          
          const isScheduled = match.status === 'Scheduled';
          const noScore = (match.homeScore === 0 || match.homeScore === null) && 
                         (match.awayScore === 0 || match.awayScore === null);
          
          return isPastMatch && (isScheduled || noScore);
        });
        
        console.log('Found unrecorded past matches:', unrecordedPastMatches.length);
        setUnrecordedMatches(unrecordedPastMatches);
      }
      
      // Team summaries will be calculated from database data
      const teamSummaries = loadedTeams.map(team => ({
        id: team.id,
        name: team.name,
        totalPlayers: team.players?.length || 0,
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0
      }));
      
      setTeamSummaries(teamSummaries);
      setLoading(false);
      console.log('✅ LoadData completed. Setting loading to false.');
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  // Handle match status updates (for cancellation/postponement)
  const handleMatchStatusUpdate = async (updatedMatch: Match) => {
    try {
      // Update local state immediately for better UX
      setAllMatches(prevMatches => 
        prevMatches.map(match => 
          match.id === updatedMatch.id ? updatedMatch : match
        )
      );

      console.log('✅ Match status updated successfully:', updatedMatch.id, updatedMatch.status);
    } catch (error) {
      console.error('Failed to update match status:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Authentication handled by RequireAuth wrapper - just load data
    loadData();

    // Handle hash routing
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'fixtures', 'management', 'statistics'].includes(hash)) {
      setActiveTab(hash as TabType);
    }
  }, []);

  // Authentication functions removed - handled by RequireAuth wrapper

  // Get actual match data for fixtures and results - Fixed to match Matchday logic
  const getUpcomingMatches = () => {
    return allMatches
      .filter(match => {
        // Always include scheduled matches
        if (match.status === 'Scheduled') {
          return selectedTeam === 'all' || match.teamId === selectedTeam;
        }
        // Include cancelled/postponed matches only if filter is enabled
        if ((match.status === 'Cancelled' || match.status === 'Postponed') && showCancelledPostponed) {
          return selectedTeam === 'all' || match.teamId === selectedTeam;
        }
        return false;
      })
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 10);
  };

  const getCancelledPostponedMatches = () => {
    return allMatches
      .filter(match => 
        (match.status === 'Cancelled' || match.status === 'Postponed') &&
        (selectedTeam === 'all' || match.teamId === selectedTeam)
      )
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  };

  const getRecentResults = () => {
    return allMatches
      .filter(match => 
        match.status === 'Finished' && 
        match.homeScore !== undefined && 
        match.awayScore !== undefined &&
        (selectedTeam === 'all' || match.teamId === selectedTeam)
      )
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
      .slice(0, 10);
  };

  // Recalculate data when selectedTeam changes
  const upcomingMatches = React.useMemo(() => getUpcomingMatches(), [selectedTeam, allMatches, showCancelledPostponed]);
  const recentResults = React.useMemo(() => getRecentResults(), [selectedTeam, allMatches]);

  // Get filtered results for overview (updated to use advanced filters)
  const getFilteredOverviewResults = () => {
    let finished = allMatches
      .filter(match => match.status === 'Finished')
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
    
    // Apply team filter
    if (advancedTeamFilter !== 'all') {
      finished = finished.filter(match => match.teamId === advancedTeamFilter);
    }
    
    // Apply match type filter
    if (matchTypeFilter.size > 0) {
      finished = finished.filter(match => matchTypeFilter.has(match.matchType));
    }
    
    return finished;
  };

  const filteredOverviewResults = React.useMemo(() => {
    const results = getFilteredOverviewResults();
    console.log('🎯 Filtered Overview Results:', {
      totalMatches: allMatches.length,
      finishedMatches: allMatches.filter(m => m.status === 'Finished').length,
      filteredResults: results.length,
      advancedTeamFilter,
      matchTypeFilter,
      sampleResult: results[0] ? {
        id: results[0].id,
        opponent: results[0].opponent,
        status: results[0].status,
        homeScore: results[0].homeScore,
        awayScore: results[0].awayScore
      } : 'No results'
    });
    return results;
  }, [advancedTeamFilter, matchTypeFilter, allMatches]);

  // Generate league table from match results
  const getLeagueTable = () => {
    const teamStats = new Map();
    
    // Initialize team stats
    teams.forEach(team => {
      if (!team.isOpponent) {
        teamStats.set(team.id, {
          team: team,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        });
      }
    });

    // Process finished matches
    const finishedMatches = allMatches.filter(match => match.status === 'Finished');
    
    finishedMatches.forEach(match => {
      if (match.homeScore !== undefined && match.awayScore !== undefined) {
        const stats = teamStats.get(match.teamId);
        if (stats) {
          stats.played++;
          
          const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
          const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
          
          stats.goalsFor += teamScore;
          stats.goalsAgainst += opponentScore;
          stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
          
          if (teamScore > opponentScore) {
            stats.won++;
            stats.points += 3;
          } else if (teamScore === opponentScore) {
            stats.drawn++;
            stats.points += 1;
          } else {
            stats.lost++;
          }
        }
      }
    });

    // Convert to array and sort by points, then goal difference, then goals for
    return Array.from(teamStats.values())
      .filter(stats => stats.played > 0) // Only show teams that have played
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });
  };

  const leagueTable = React.useMemo(() => getLeagueTable(), [teams]);

  // Optimized team statistics calculation with performance tracking
  const getTeamStatistics = React.useCallback((teamId: string, matchTypes?: Set<string> | string) => {
    const startTime = performance.now();
    
    const teamMatches = allMatches.filter(match => {
      const teamMatch = (teamId === 'all' || match.teamId === teamId);
      const finishedMatch = match.status === 'Finished';
      
      let typeMatch = true;
      if (matchTypes) {
        if (typeof matchTypes === 'string') {
          typeMatch = matchTypes === 'All' || match.matchType === matchTypes;
        } else if (matchTypes instanceof Set) {
          typeMatch = matchTypes.size === 0 || matchTypes.has(match.matchType);
        }
      }
      
      return teamMatch && finishedMatch && typeMatch;
    });
    
    console.log(`⚡ Optimized stats calculation for team ${teamId} (type: ${matchTypes ? (typeof matchTypes === 'string' ? matchTypes : Array.from(matchTypes).join(',')) : 'All'}):`, {
      totalMatches: allMatches.length,
      filteredMatches: teamMatches.length,
      performanceTime: `${(performance.now() - startTime).toFixed(2)}ms`,
      finishedMatches: allMatches.filter(m => m.status === 'Finished').length,
      matchTypes: [...new Set(allMatches.map(m => m.matchType))],
      sampleMatches: allMatches.slice(0, 3).map(m => ({ id: m.id, type: m.matchType, status: m.status }))
    });

    const stats = {
      played: teamMatches.length,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      homeWins: 0,
      awayWins: 0,
      homeMatches: teamMatches.filter(m => m.isHomeMatch).length,
      awayMatches: teamMatches.filter(m => !m.isHomeMatch).length,
      cleanSheets: 0,
      biggestWin: { score: '', margin: 0 },
      biggestLoss: { score: '', margin: 0 },
      avgGoalsFor: 0,
      avgGoalsAgainst: 0,
      winPercentage: 0,
      form: [] as string[]
    };

    // Sort matches by date (oldest first) so form is built in chronological order
    const sortedMatches = teamMatches.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
    
    sortedMatches.forEach(match => {
      if (match.homeScore !== undefined && match.awayScore !== undefined) {
        const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
        const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
        
        stats.goalsFor += teamScore;
        stats.goalsAgainst += opponentScore;
        
        if (opponentScore === 0) stats.cleanSheets++;
        
        if (teamScore > opponentScore) {
          stats.won++;
          if (match.isHomeMatch) {
            stats.homeWins++;
          } else {
            stats.awayWins++;
          }
          stats.form.push('W');
          
          const margin = teamScore - opponentScore;
          if (margin > stats.biggestWin.margin) {
            stats.biggestWin = { score: `${teamScore}-${opponentScore}`, margin };
          }
        } else if (teamScore === opponentScore) {
          stats.drawn++;
          stats.form.push('D');
        } else {
          stats.lost++;
          stats.form.push('L');
          
          const margin = opponentScore - teamScore;
          if (margin > stats.biggestLoss.margin) {
            stats.biggestLoss = { score: `${teamScore}-${opponentScore}`, margin };
          }
        }
      }
    });

    stats.avgGoalsFor = stats.played > 0 ? stats.goalsFor / stats.played : 0;
    stats.avgGoalsAgainst = stats.played > 0 ? stats.goalsAgainst / stats.played : 0;
    stats.winPercentage = stats.played > 0 ? (stats.won / stats.played) * 100 : 0;
    stats.form = stats.form.slice(-5); // Last 5 matches chronologically

    const endTime = performance.now();
    console.log(`✅ Stats calculation completed in ${(endTime - startTime).toFixed(2)}ms`);
    
    return stats;
  }, [allMatches]);

  // Calculate player statistics from match events AND match squads
  const getPlayerStatistics = async (teamId: string, matchTypes?: Set<string>) => {
    try {
      // Load goal events from database
      let goalQuery = supabase
        .from('match_events')
        .select(`
          id,
          match_id,
          player_id,
          player_name,
          event_type,
          event_minute,
          notes,
          matches!inner(team_id, match_type),
          players(first_name, last_name)
        `)
        .eq('event_type', 'Goal');

      if (teamId !== 'all') {
        goalQuery = goalQuery.eq('matches.team_id', teamId);
      }

      // Filter by match types if provided
      if (matchTypes && matchTypes.size > 0) {
        goalQuery = goalQuery.in('matches.match_type', Array.from(matchTypes));
      }

      const { data: goalEvents, error: goalError } = await goalQuery;

      // Load matches with squad data to get accurate match appearances
      let matchQuery = supabase
        .from('matches')
        .select(`
          id,
          team_id,
          selected_squad,
          status,
          match_type
        `)
        .eq('status', 'Finished')
        .not('selected_squad', 'is', null);

      if (teamId !== 'all') {
        matchQuery = matchQuery.eq('team_id', teamId);
      }

      // Filter by match types if provided
      if (matchTypes && matchTypes.size > 0) {
        matchQuery = matchQuery.in('match_type', Array.from(matchTypes));
      }

      const { data: matchesWithSquads, error: matchError } = await matchQuery;

      // Load all active players to get proper names
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id, first_name, last_name')
        .eq('is_active', true);

      const events = goalEvents || [];
      const matches = matchesWithSquads || [];
      const players = playersData || [];

      console.log('✅ Data loaded:', { 
        goalEvents: events.length, 
        matchesWithSquads: matches.length,
        players: players.length 
      });

      // Create player lookup for proper names
      const playerLookup = new Map();
      players.forEach(player => {
        playerLookup.set(player.id, `${player.first_name}${player.last_name ? ` ${player.last_name}` : ''}`);
      });

      // Calculate stats by player
      const playerStats = new Map();

      // Process goal events for goals and assists
      events.forEach(event => {
        const playerId = event.player_id || event.player_name || 'unknown';
        const playerName = playerLookup.get(playerId) || 
          (event.players
            ? `${event.players.first_name}${event.players.last_name && event.players.last_name !== 'null' ? ` ${event.players.last_name}` : ''}`
            : (event.player_name && event.player_name !== 'null' ? event.player_name : 'Unknown Player'));
        
        if (!playerStats.has(playerId)) {
          playerStats.set(playerId, {
            name: playerName,
            goals: 0,
            assists: 0,
            matches: new Set()
          });
        }
        const stats = playerStats.get(playerId);
        stats.goals++;
        stats.matches.add(event.match_id);
        
        // Process assists from notes field
        if (event.notes && event.notes.includes('Assist:')) {
          const assistMatch = event.notes.match(/Assist:\s*([^|]+)/);
          if (assistMatch) {
            const assistPlayer = assistMatch[1].trim();
            if (assistPlayer && assistPlayer !== 'null') {
              if (!playerStats.has(assistPlayer)) {
                playerStats.set(assistPlayer, {
                  name: assistPlayer,
                  goals: 0,
                  assists: 0,
                  matches: new Set()
                });
              }
              playerStats.get(assistPlayer).assists++;
            }
          }
        }
      });

      // Process match squads for accurate match appearance counts
      matches.forEach(match => {
        if (match.selected_squad && Array.isArray(match.selected_squad)) {
          match.selected_squad.forEach(playerId => {
            const playerName = playerLookup.get(playerId) || `Player ${playerId}`;
            
            if (!playerStats.has(playerId)) {
              playerStats.set(playerId, {
                name: playerName,
                goals: 0,
                assists: 0,
                matches: new Set()
              });
            }
            playerStats.get(playerId).matches.add(match.id);
          });
        }
      });

      // Convert to arrays and add match counts
      const playersArray = Array.from(playerStats.values()).map(player => ({
        ...player,
        matches: player.matches.size
      }));

      const result = {
        topScorers: playersArray
          .filter(p => p.goals > 0)
          .sort((a, b) => b.goals - a.goals)
          .slice(0, 10),
        topAssists: playersArray
          .filter(p => p.assists > 0)
          .sort((a, b) => b.assists - a.assists)
          .slice(0, 10),
        mostMatches: playersArray
          .filter(p => p.matches > 0)
          .sort((a, b) => b.matches - a.matches)
          .slice(0, 10)
      };
      
      console.log('Final player statistics:', result);
      return result;
    } catch (error) {
      console.error('Error calculating player statistics:', error);
      return { topScorers: [], topAssists: [], mostMatches: [] };
    }
  };

  // Helper function to get filtered matches for charts
  const getFilteredMatches = React.useCallback((additionalFilter?: (match: Match) => boolean) => {
    return allMatches
      .filter(match => selectedStatsTeam === 'all' || match.teamId === selectedStatsTeam)
      .filter(match => selectedMatchTypes.size === 0 || selectedMatchTypes.has(match.matchType))
      .filter(match => additionalFilter ? additionalFilter(match) : true);
  }, [allMatches, selectedStatsTeam, selectedMatchTypes]);

  // Memoized team statistics for better performance
  const currentStats = React.useMemo(() => {
    console.log('🚀 Calculating team statistics (memoized):', selectedStatsTeam, selectedMatchTypes);
    return getTeamStatistics(selectedStatsTeam, selectedMatchTypes);
  }, [selectedStatsTeam, selectedMatchTypes, getTeamStatistics]);

  // Check which matches have extra info to display
  useEffect(() => {
    const checkMatchesExtra = async () => {
      const extraInfo: {[key: string]: boolean} = {};
      for (const match of allMatches) {
        const hasExtra = await hasExtraInfo(match);
        extraInfo[match.id] = hasExtra;
        console.log(`Match ${match.id} has extra info:`, hasExtra);
      }
      console.log('Matches with extra info:', extraInfo);
      setMatchesWithExtra(extraInfo);
    };
    
    if (allMatches.length > 0) {
      checkMatchesExtra();
    }
  }, [allMatches]);

  // Cache all player statistics and filter in memory for better performance
  const [allPlayerStats, setAllPlayerStats] = useState<{ loaded: boolean; data: any[] }>({ loaded: false, data: [] });
  const [statsLoading, setStatsLoading] = useState(false);

  // Load all player statistics and reload when match types change
  useEffect(() => {
    const loadAllPlayerStats = async () => {
      setStatsLoading(true);
      try {
        const stats = await getPlayerStatistics('all', selectedMatchTypes); // Load stats with match type filter
        setAllPlayerStats({ loaded: true, data: stats });
      } catch (error) {
        console.error('Error loading player stats:', error);
        setAllPlayerStats({ loaded: true, data: { topScorers: [], topAssists: [], mostMatches: [] } });
      } finally {
        setStatsLoading(false);
      }
    };
    
    if (allMatches.length > 0) {
      // Force reload stats whenever matches or match types change
      setAllPlayerStats({ loaded: false, data: { topScorers: [], topAssists: [], mostMatches: [] } });
      loadAllPlayerStats();
    }
  }, [allMatches.length, selectedMatchTypes]);

  // Memoized player statistics filtered by selected team - much faster than database queries
  const filteredPlayerStats = React.useMemo(() => {
    if (!allPlayerStats.loaded || selectedStatsTeam === 'all') {
      return allPlayerStats.data || { topScorers: [], topAssists: [], mostMatches: [] };
    }

    // Filter cached stats by team - this is much faster than database queries
    const teamMatchIds = allMatches
      .filter(match => match.teamId === selectedStatsTeam)
      .map(match => match.id);
    
    if (teamMatchIds.length === 0) {
      return { topScorers: [], topAssists: [], mostMatches: [] };
    }

    // Filter players who played in matches for the selected team
    const { topScorers, topAssists, mostMatches } = allPlayerStats.data;
    
    // This filtering logic would need the match data per player to be cached
    // For now, return all stats when team is selected - we can enhance this further
    return allPlayerStats.data;
  }, [selectedStatsTeam, allPlayerStats.data, allMatches]);

  // Update playerStats with filtered/cached data
  useEffect(() => {
    if (allPlayerStats.loaded) {
      setPlayerStats(filteredPlayerStats);
    }
  }, [filteredPlayerStats, allPlayerStats.loaded]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL hash without page reload
    window.history.replaceState(null, '', `#${tab}`);
  };

  const getMatchResult = (match: Match) => {
    if (match.homeScore === undefined || match.awayScore === undefined) {
      return { result: 'TBD', teamScore: 0, opponentScore: 0 };
    }
    
    const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
    const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
    
    let result = 'D';
    if (teamScore > opponentScore) result = 'W';
    if (teamScore < opponentScore) result = 'L';
    
    return { result, teamScore, opponentScore };
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading Match Central...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  // Authentication Gate
  // Always show content since authentication is handled by RequireAuth wrapper
  if (false) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md w-full mx-4"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl text-white">🔒</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Match Central</h1>
              <p className="text-gray-600">Authentication required for club management access</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Password
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter password..."
                />
              </div>

              <button
                onClick={handleAuth}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🔓 Access Match Central
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">
                  Looking for public match information?
                </p>
                <a
                  href="/matchday"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <span>⚽</span>
                  <span>View Public MatchDay</span>
                  <span>→</span>
                </a>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  Need an account? Contact the club administrator
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </StandardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Results', icon: '🏆', public: true, color: 'green' },
    { id: 'fixtures', label: 'Fixtures', icon: '📅', public: true, color: 'blue' },
    { id: 'statistics', label: 'Stats', icon: '📊', public: true, color: 'orange' },
    { id: 'management', label: 'Teams', icon: '👥', public: false, color: 'purple' }
  ];

  return (
    <div className="min-h-screen">
      {/* Mobile-Only Design */}
      <div className="block md:hidden bg-white pb-16">
        {/* Compact Mobile Header */}
        <div className="bg-club-primary text-white p-2">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold">Match Central</h1>
            <div className="flex gap-1">
              <a
                href="/match-recorder?mode=record"
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-all flex items-center gap-1"
                title="Record match"
              >
                <span>📝</span>
                <span>Record</span>
              </a>
              <a
                href="/match-recorder?mode=schedule"
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-all flex items-center gap-1"
                title="Schedule match"
              >
                <span>📅</span>
                <span>Schedule</span>
              </a>
              <div className="scale-75">
                <LoginButton />
              </div>
            </div>
          </div>
        </div>

        {/* Compact Tab Navigation */}
        <div className="bg-gray-50 border-b border-gray-200 px-2 py-2">
          <nav className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => handleTabChange('overview')}
              className={`px-3 py-1 rounded-lg font-medium text-xs transition-all flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <span>🏆</span>
              Results
            </button>
            <button
              onClick={() => handleTabChange('fixtures')}
              className={`px-3 py-1 rounded-lg font-medium text-xs transition-all flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'fixtures'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <span>📅</span>
              Fixtures
            </button>
            <button
              onClick={() => handleTabChange('statistics')}
              className={`px-3 py-1 rounded-lg font-medium text-xs transition-all flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'statistics'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              <span>📊</span>
              Stats
            </button>
          </nav>
        </div>

        {/* Mobile Content */}
        <div className="p-2 pb-20">
          {/* Mobile Overview */}
          {activeTab === 'overview' && (
            <div>
              {/* Advanced Filters for Mobile */}
              <div className="mb-4 space-y-3">
                <AdvancedTeamFilter
                  teams={teams}
                  selectedTeamId={advancedTeamFilter}
                  onSelectionChange={setAdvancedTeamFilter}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {['League', 'Cup', 'Friendly', 'Tournament'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        const newTypes = new Set(matchTypeFilter);
                        if (newTypes.has(type)) {
                          newTypes.delete(type);
                        } else {
                          newTypes.add(type);
                        }
                        setMatchTypeFilter(newTypes);
                      }}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        matchTypeFilter.has(type)
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Match Cards */}
              <div className="space-y-1">
                {filteredOverviewResults.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⚽</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">No Results Yet</h3>
                    <div className="flex gap-2">
                      <a
                        href="/match-recorder?mode=record"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl border-red-500 transform hover:scale-105 ring-4 ring-red-200 font-bold px-4 py-2 rounded-lg transition-all"
                        title="Record past or today's match"
                      >
                        <span>📝</span>
                        Record Match
                      </a>
                      <a
                        href="/match-recorder?mode=schedule"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl border-blue-500 transform hover:scale-105 ring-4 ring-blue-200 font-bold px-4 py-2 rounded-lg transition-all"
                        title="Schedule future match"
                      >
                        <span>📅</span>
                        Schedule Match
                      </a>
                    </div>
                  </div>
                ) : (
                  filteredOverviewResults.map((match) => {
                    const team = teams.find(t => t.id === match.teamId);
                    const result = getMatchResult(match);
                    const isExpanded = expandedResults[match.id];
                    const hasExtra = matchesWithExtra[match.id];
                    
                    if (!team) return null;

                    return (
                      <div
                        key={match.id}
                        className="bg-white rounded-lg border shadow-sm"
                      >
                        {/* Ultra Compact Mobile Card */}
                        <div 
                          className={`p-2 ${hasExtra ? 'cursor-pointer' : ''}`}
                          onClick={() => hasExtra && toggleMatchExpand(match.id)}
                        >
                          <div className="flex items-center justify-between">
                            {/* Teams & Date */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-gray-900 truncate">
                                {team.name} vs {match.opponent}
                              </div>
                              <div className="text-xs text-gray-600">
                                {new Date(match.scheduledDate).toLocaleDateString()}
                              </div>
                            </div>
                            
                            {/* Score */}
                            <div className="text-right ml-2">
                              <div className="text-lg font-black text-gray-900">
                                {result.teamScore} - {result.opponentScore}
                              </div>
                              <div className={`text-xs font-bold px-1 py-0.5 rounded ${
                                result.result === 'W' ? 'bg-green-100 text-green-700' :
                                result.result === 'L' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {result.result === 'W' ? 'W' : result.result === 'L' ? 'L' : 'D'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {hasExtra && isExpanded && (
                          <MatchExpandedDetails match={match} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Mobile Fixtures */}
          {activeTab === 'fixtures' && (
            <div className="space-y-3">
              {upcomingMatches.map((match) => {
                const team = teams.find(t => t.id === match.teamId);
                const needsRecording = isMatchUnrecorded(match);
                const matchTypeColors = getMatchTypeCardColors(match.matchType);
                return (
                  <div key={match.id} className={`rounded-lg border shadow-sm p-3 ${
                    needsRecording 
                      ? 'border-amber-400 bg-amber-50' 
                      : `${matchTypeColors.background} ${matchTypeColors.border}`
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className={`text-sm font-bold flex items-center gap-2 ${needsRecording ? 'text-amber-800' : 'text-gray-900'}`}>
                          {needsRecording && <span className="text-amber-600">⚠️</span>}
                          {team?.name || 'Unknown'} vs {match.opponent}
                          {needsRecording && (
                            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-semibold">
                              NEEDS RECORDING
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${needsRecording ? 'text-amber-700' : 'text-gray-600'}`}>
                          {match.scheduledDate.toLocaleDateString()} • {match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="mt-2">
                          <MatchStatusManager
                            match={match}
                            onStatusUpdate={handleMatchStatusUpdate}
                            teamName={team?.name}
                          />
                        </div>
                      </div>
                      <a
                        href={`/matches/${match.id}/record`}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Log
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile Statistics */}
          {activeTab === 'statistics' && (
            <div>
              {/* Team Selector */}
              <div className="mb-4">
                <select className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm">
                  <option value="">Select Team</option>
                  <option value="u16-boys">U16 Boys</option>
                  <option value="u14-girls">U14 Girls</option>
                  <option value="seniors">Senior Team</option>
                  <option value="u12-mixed">U12 Mixed</option>
                </select>
              </div>

              {/* Mobile Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">12</div>
                  <div className="text-xs text-gray-600">Played</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">8</div>
                  <div className="text-xs text-gray-600">Wins</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-yellow-600">2</div>
                  <div className="text-xs text-gray-600">Draws</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-red-600">2</div>
                  <div className="text-xs text-gray-600">Losses</div>
                </div>
              </div>

              {/* Goals & Performance */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">32</div>
                  <div className="text-xs text-gray-600">Goals For</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">18</div>
                  <div className="text-xs text-gray-600">Against</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-600">+14</div>
                  <div className="text-xs text-gray-600">Difference</div>
                </div>
              </div>

              {/* Recent Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">📈 Recent Form</h3>
                <div className="flex space-x-1 justify-center">
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                  <span className="w-8 h-8 bg-yellow-500 rounded text-white text-xs flex items-center justify-center">D</span>
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">⭐ Top Performers</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Most POTM:</span>
                    <span className="font-medium">Jamie O'Brien (3)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Scorer:</span>
                    <span className="font-medium">Alex Murphy (8)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Attendance:</span>
                    <span className="font-medium">450</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Design - Hidden on Mobile */}
      <div className="hidden md:block">
        <StandardLayout>
          <div className="min-h-screen bg-gray-50">
            {/* Simplified Mobile Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
                {/* Desktop Layout */}
                <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-club-primary rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white">⚽</span>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">Match Central</h1>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                      v{VERSION_CONFIG.current.version}
                    </span>
                    <Link 
                      href="/admin" 
                      className="text-black hover:text-gray-800 text-sm flex items-center space-x-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 px-4 py-2 rounded-full shadow-xl border-2 border-yellow-600 hover:border-yellow-700 hover:shadow-2xl transition-all animate-pulse font-bold"
                      title="Admin Tools & Diagnostics"
                      style={{
                        boxShadow: '0 0 20px rgba(255, 235, 59, 0.6), 0 4px 15px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <span className="animate-bounce text-lg">🛠️</span>
                      <span className="font-black uppercase tracking-wide">TOOLS</span>
                    </Link>
                  </div>
                  <p className="text-gray-600 mt-1">Complete football match management system</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Navigation Tabs - Colored Boxes */}
                <nav className="flex space-x-3">
                  {tabs.map((tab) => {
                    const getColorClasses = (color: string, isActive: boolean) => {
                      const colors: any = {
                        green: isActive 
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl border-green-500 transform scale-105 ring-4 ring-green-200 font-bold' 
                          : 'bg-white hover:bg-green-50 text-gray-700 border border-gray-300 shadow-lg hover:text-green-600 hover:shadow-xl hover:border-green-300',
                        blue: isActive 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl border-blue-500 transform scale-105 ring-4 ring-blue-200 font-bold' 
                          : 'bg-white hover:bg-blue-50 text-gray-700 border border-gray-300 shadow-lg hover:text-blue-600 hover:shadow-xl hover:border-blue-300',
                        orange: isActive 
                          ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-xl border-orange-500 transform scale-105 ring-4 ring-orange-200 font-bold' 
                          : 'bg-white hover:bg-orange-50 text-gray-700 border border-gray-300 shadow-lg hover:text-orange-600 hover:shadow-xl hover:border-orange-300',
                        purple: isActive 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xl border-purple-500 transform scale-105 ring-4 ring-purple-200 font-bold' 
                          : 'bg-white hover:bg-purple-50 text-gray-700 border border-gray-300 shadow-lg hover:text-purple-600 hover:shadow-xl hover:border-purple-300'
                      };
                      return colors[color] || colors.green;
                    };

                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center space-x-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg ${
                          getColorClasses(tab.color, activeTab === tab.id)
                        }`}
                      >
                        <span className="text-base">{tab.icon}</span>
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
                
                {/* Divider */}
                <div className="h-8 w-px bg-gray-300"></div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <div className="flex gap-2">
                    <a
                      href="/match-recorder?mode=record"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
                      title="Record past or today's match"
                    >
                      <span className="text-lg">📝</span>
                      <span className="hidden sm:inline">Record</span>
                    </a>
                    <a
                      href="/match-recorder?mode=schedule"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
                      title="Schedule future match"
                    >
                      <span className="text-lg">📅</span>
                      <span className="hidden sm:inline">Schedule</span>
                    </a>
                    <LoginButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-8">

        {/* Enhanced Team Filters (for management) */}
        {(activeTab === 'management') && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-wrap items-start gap-8">
              {/* Team Type Filters */}
              <div className="flex-shrink-0">
                <p className="text-sm font-semibold text-gray-700 mb-3">Team Type</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTeam('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTeam === 'all'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-blue-50'
                    }`}
                  >
                    All Teams ({teams.length})
                  </button>
                  <button
                    onClick={() => setSelectedTeam('rvr')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTeam === 'rvr'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-green-50'
                    }`}
                  >
                    ⚽ RVR Teams ({teams.filter(t => !t.isOpponent).length})
                  </button>
                  <button
                    onClick={() => setSelectedTeam('opponents')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTeam === 'opponents'
                        ? 'bg-orange-100 text-orange-800 border border-orange-300'
                        : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-orange-50'
                    }`}
                  >
                    🏟️ Opponents ({teams.filter(t => t.isOpponent).length})
                  </button>
                </div>
              </div>

              {/* League Filters */}
              {(() => {
                const uniqueLeagues = Array.from(new Set(teams.map(team => team.league).filter(Boolean)));
                return uniqueLeagues.length > 1 ? (
                  <div className="flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-700 mb-3">League</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedLeague('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedLeague === 'all'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-purple-50'
                        }`}
                      >
                        All Leagues
                      </button>
                      {uniqueLeagues.map(league => (
                        <button
                          key={league}
                          onClick={() => setSelectedLeague(league)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedLeague === league
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-purple-50'
                          }`}
                        >
                          🏆 {league} ({teams.filter(t => t.league === league).length})
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Age Group Filters */}
              {(() => {
                const uniqueAgeGroups = Array.from(new Set(teams.map(team => team.ageGroup).filter(Boolean))).sort();
                return uniqueAgeGroups.length > 1 ? (
                  <div className="flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Age Group</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedAgeGroup(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          !selectedAgeGroup
                            ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-indigo-50'
                        }`}
                      >
                        All Ages
                      </button>
                      {uniqueAgeGroups.map(ageGroup => (
                        <button
                          key={ageGroup}
                          onClick={() => setSelectedAgeGroup(ageGroup)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedAgeGroup === ageGroup
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-indigo-50'
                          }`}
                        >
                          🏃‍♂️ {ageGroup} ({teams.filter(t => t.ageGroup === ageGroup).length})
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Unrecorded Past Matches Alert */}
              {unrecordedMatches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg mb-8"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        ⚠️ {unrecordedMatches.length} Past Match{unrecordedMatches.length > 1 ? 'es' : ''} Need Recording
                      </h3>
                      <div className="mt-2 text-sm text-amber-700">
                        <p className="mb-3">The following matches have passed but haven't been recorded:</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {unrecordedMatches.slice(0, 5).map(match => (
                            <div key={match.id} className="bg-white bg-opacity-50 rounded p-2 flex justify-between items-center">
                              <span className="font-medium">
                                {match.isHomeMatch ? 'vs' : 'at'} {match.opponent}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-amber-600">
                                  {new Date(match.scheduledDate).toLocaleDateString()}
                                </span>
                                <button
                                  onClick={() => router.push(`/match-recorder?edit=${match.id}`)}
                                  className="text-xs bg-amber-600 text-white px-2 py-1 rounded hover:bg-amber-700 transition-colors"
                                >
                                  Record Now
                                </button>
                              </div>
                            </div>
                          ))}
                          {unrecordedMatches.length > 5 && (
                            <div className="text-xs text-amber-600 text-center py-1">
                              ...and {unrecordedMatches.length - 5} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto pl-3">
                      <div className="-mx-1.5 -my-1.5">
                        <button
                          onClick={() => setUnrecordedMatches([])}
                          className="inline-flex rounded-md p-1.5 text-amber-500 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-50 focus:ring-amber-600"
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Filter Bar - Enhanced Features Style */}
              <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6 mb-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">🏆</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Match Results</h2>
                      <p className="text-sm text-gray-600">Track your team's performance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="text-sm font-medium text-gray-700">Filter:</label>
                    <AdvancedTeamFilter
                      teams={teams}
                      selectedTeamId={advancedTeamFilter}
                      onSelectionChange={setAdvancedTeamFilter}
                      className="w-80"
                    />
                    <div className="flex flex-wrap gap-2">
                      {['League', 'Cup', 'Friendly', 'Tournament'].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            const newTypes = new Set(matchTypeFilter);
                            if (newTypes.has(type)) {
                              newTypes.delete(type);
                            } else {
                              newTypes.add(type);
                            }
                            setMatchTypeFilter(newTypes);
                          }}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            matchTypeFilter.has(type)
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    
                    {/* View Mode Switcher removed - only list view available */}
                  </div>
                </div>
              </div>

              {/* Results - List View Only */}
              <div className="space-y-4">
                {filteredOverviewResults.length === 0 ? (
                  <div className="col-span-full bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white text-3xl">⚽</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Results Yet!</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      {overviewFilter === 'all' 
                        ? 'Play some matches and results will appear here!' 
                        : `No results yet for ${teams.find(t => t.id === overviewFilter)?.name || 'this team'}`
                      }
                    </p>
                    <div className="flex gap-4 justify-center">
                      <a
                        href="/match-recorder?mode=record"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                        title="Record past or today's match"
                      >
                        <span className="text-xl">📝</span>
                        <span>Record Match</span>
                      </a>
                      <a
                        href="/match-recorder?mode=schedule"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                        title="Schedule future match"
                      >
                        <span className="text-xl">📅</span>
                        <span>Schedule Match</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  filteredOverviewResults.map((match, index) => {
                    const team = teams.find(t => t.id === match.teamId);
                    const result = getMatchResult(match);
                    const isExpanded = expandedResults[match.id];
                    const hasExtra = matchesWithExtra[match.id];
                    
                    if (!team) return null;

                    // LIST VIEW - MatchDay Style with Player Details (only view available)
                    // Removed cards view - always use list view
                    return (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className={`rounded-lg shadow-md border-2 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] overflow-hidden cursor-pointer ${
                            (() => {
                              const matchTypeColors = getMatchTypeCardColors(match.matchType);
                              return `${matchTypeColors.background} ${matchTypeColors.border}`;
                            })()
                          }`}
                          onClick={() => toggleMatchExpand(match.id)}
                        >
                          <div className={`h-2 shadow-sm ${
                            result.result === 'W' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                            result.result === 'L' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                          }`}></div>
                          
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-500">
                                  {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-gray-900">{team.name}</span>
                                  <span className="text-gray-400">vs</span>
                                  <span className="font-semibold text-gray-900">{match.opponent}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <div className={`text-lg font-bold ${
                                  result.result === 'W' ? 'text-green-600' : 
                                  result.result === 'L' ? 'text-red-600' : 'text-yellow-600'
                                }`}>
                                  {result.teamScore} - {result.opponentScore}
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                  result.result === 'W' ? 'bg-green-100 text-green-700' : 
                                  result.result === 'L' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {result.result === 'W' ? 'WIN' : result.result === 'L' ? 'LOSS' : 'DRAW'}
                                </div>
                                
                                {/* Action Buttons */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/match-recorder?edit=${match.id}`);
                                  }}
                                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium transition-all transform hover:scale-105"
                                  title="Edit match"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const team = teams.find(t => t.id === match.teamId);
                                    const matchName = `${team?.name || 'Unknown'} vs ${match.opponent}`;
                                    setDeleteModal({
                                      show: true,
                                      matchId: match.id,
                                      matchName: matchName,
                                      type: 'match'
                                    });
                                  }}
                                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-all transform hover:scale-105"
                                  title="Delete match"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-500 space-x-3">
                                <span className="font-medium text-gray-700">📍 {match.venue}</span>
                                <span className={`px-2 py-1 rounded ${
                                  match.isHomeMatch ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                }`}>
                                  {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                </span>
                                <MatchTypeBadge matchType={match.matchType} />
                                {match.selectedSquad && (
                                  <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                    {match.selectedSquad.length} players
                                  </span>
                                )}
                              </div>
                              
                              {/* Expand Arrow */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {expandedResults[match.id] ? '▲' : '▼'}
                              </button>
                            </div>

                            {/* Expanded Content */}
                            {expandedResults[match.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-3 pt-3 border-t border-gray-200 overflow-hidden"
                              >
                                {/* Clean Match Details - Goals, Squad & Notes Only */}
                                <MatchExpandedDetails match={match} />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* Management Tab - Requires Authentication */}
          {activeTab === 'management' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Team Management</h3>
                      <p className="text-gray-600">Manage River Valley Rangers teams</p>
                    </div>
                    <a
                      href="/match-admin"
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl border-green-500 transform hover:scale-105 ring-4 ring-green-200 font-bold px-6 py-3 rounded-lg transition-all flex items-center"
                    >
                      <span className="mr-2">➕</span>
                      Add New Team
                    </a>
                  </div>
                </div>

                {/* Teams List with Enhanced RVR Highlighting */}
                <div className="space-y-4">
                  {(() => {
                    // Filter teams based on current selection
                    const filteredTeams = teams.filter(team => {
                      // Team type filter
                      if (selectedTeam === 'rvr' && team.isOpponent) return false;
                      if (selectedTeam === 'opponents' && !team.isOpponent) return false;
                      
                      // Age group filter
                      if (selectedAgeGroup && team.ageGroup !== selectedAgeGroup) return false;
                      
                      // League filter
                      if (selectedLeague !== 'all' && team.league !== selectedLeague) return false;
                      
                      return true;
                    });

                    // Sort teams to show RVR teams first when viewing all teams
                    const sortedTeams = selectedTeam === 'all' 
                      ? [...filteredTeams].sort((a, b) => {
                          // RVR teams first
                          if (!a.isOpponent && b.isOpponent) return -1;
                          if (a.isOpponent && !b.isOpponent) return 1;
                          
                          // Then sort by league opponents vs others
                          if (a.isOpponent && b.isOpponent) {
                            if (a.league && !b.league) return -1;
                            if (!a.league && b.league) return 1;
                          }
                          
                          // Finally alphabetical
                          return a.name.localeCompare(b.name);
                        })
                      : filteredTeams;

                    // Group teams for All Teams view
                    if (selectedTeam === 'all') {
                      const rvrTeams = sortedTeams.filter(team => !team.isOpponent);
                      const leagueOpponents = sortedTeams.filter(team => team.isOpponent && team.league && !['No League', 'Friendly Only'].includes(team.league));
                      const friendlyOpponents = sortedTeams.filter(team => team.isOpponent && team.league === 'Friendly Only');
                      const otherOpponents = sortedTeams.filter(team => team.isOpponent && (!team.league || team.league === 'No League'));

                      return (
                        <>
                          {/* RVR Teams Section */}
                          {rvrTeams.length > 0 && (
                            <div className="mb-6">
                              <div 
                                className="relative mb-4 p-4 bg-gradient-to-r from-green-100 via-green-50 to-emerald-100 rounded-xl border-2 border-green-300 shadow-md cursor-pointer hover:shadow-lg transition-all duration-200"
                                onClick={() => toggleTeamSection('rvrTeams')}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-xl"></div>
                                <div className="relative flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-green-500 p-2 rounded-lg shadow-lg">
                                      <span className="text-white text-xl">⚽</span>
                                    </div>
                                    <div>
                                      <h4 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                                        River Valley Rangers Teams
                                      </h4>
                                      <p className="text-green-600 text-sm font-medium">{rvrTeams.length} teams</p>
                                    </div>
                                  </div>
                                  <div className="text-green-600 text-xl font-bold transition-transform duration-200" style={{
                                    transform: collapsedTeamSections.rvrTeams ? 'rotate(0deg)' : 'rotate(90deg)'
                                  }}>
                                    ▶
                                  </div>
                                </div>
                              </div>
                              {!collapsedTeamSections.rvrTeams && (
                                <div className="space-y-3">
                                  {rvrTeams.map((team) => (
                                    <CollapsibleTeamCard 
                                      key={team.id} 
                                      team={team} 
                                      onEdit={() => router.push(`/match-admin?edit=${team.id}`)}
                                      onDelete={async () => {
                                        if (confirm(`Are you sure you want to delete ${team.name}? This will also delete all associated players and matches.`)) {
                                          try {
                                            const { error } = await supabase.from('teams').delete().eq('id', team.id);
                                            if (error) throw error;
                                            await loadData();
                                          } catch (error) {
                                            console.error('Error deleting team:', error);
                                            alert('Error deleting team: ' + error);
                                          }
                                        }
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* League Opponents Section */}
                          {leagueOpponents.length > 0 && (
                            <div className="mb-6">
                              <div 
                                className="relative mb-4 p-4 bg-gradient-to-r from-blue-100 via-blue-50 to-cyan-100 rounded-xl border-2 border-blue-300 shadow-md cursor-pointer hover:shadow-lg transition-all duration-200"
                                onClick={() => toggleTeamSection('leagueOpponents')}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-xl"></div>
                                <div className="relative flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
                                      <span className="text-2xl text-white">🏆</span>
                                    </div>
                                    <div>
                                      <h4 className="text-xl font-bold text-blue-900 mb-1">
                                        League Opponents
                                      </h4>
                                      <p className="text-sm text-blue-700 font-medium">
                                        {leagueOpponents.length} competitive opponents
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-blue-600 text-xl font-bold transition-transform duration-200" style={{
                                    transform: collapsedTeamSections.leagueOpponents ? 'rotate(0deg)' : 'rotate(90deg)'
                                  }}>
                                    ▶
                                  </div>
                                </div>
                              </div>
                              {!collapsedTeamSections.leagueOpponents && (
                                <div className="space-y-3">
                                  {leagueOpponents.map((team) => (
                                    <CollapsibleTeamCard 
                                      key={team.id} 
                                      team={team} 
                                      onEdit={() => router.push(`/match-admin?edit=${team.id}`)}
                                      onDelete={async () => {
                                        if (confirm(`Are you sure you want to delete ${team.name}? This will also delete all associated players and matches.`)) {
                                          try {
                                            const { error } = await supabase.from('teams').delete().eq('id', team.id);
                                            if (error) throw error;
                                            await loadData();
                                          } catch (error) {
                                            console.error('Error deleting team:', error);
                                            alert('Error deleting team: ' + error);
                                          }
                                        }
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Friendly Opponents Section */}
                          {friendlyOpponents.length > 0 && (
                            <div className="mb-6">
                              <div 
                                className="relative mb-4 p-4 bg-gradient-to-r from-purple-100 via-purple-50 to-pink-100 rounded-xl border-2 border-purple-300 shadow-md cursor-pointer hover:shadow-lg transition-all duration-200"
                                onClick={() => toggleTeamSection('friendlyOpponents')}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-xl"></div>
                                <div className="relative flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-500 rounded-xl shadow-lg">
                                      <span className="text-2xl text-white">🤝</span>
                                    </div>
                                    <div>
                                      <h4 className="text-xl font-bold text-purple-900 mb-1">
                                        Friendly Opponents
                                      </h4>
                                      <p className="text-sm text-purple-700 font-medium">
                                        {friendlyOpponents.length} friendly match teams
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-purple-600 text-xl font-bold transition-transform duration-200" style={{
                                    transform: collapsedTeamSections.friendlyOpponents ? 'rotate(0deg)' : 'rotate(90deg)'
                                  }}>
                                    ▶
                                  </div>
                                </div>
                              </div>
                              {!collapsedTeamSections.friendlyOpponents && (
                                <div className="space-y-3">
                                  {friendlyOpponents.map((team) => (
                                    <CollapsibleTeamCard 
                                      key={team.id} 
                                      team={team} 
                                      onEdit={() => router.push(`/match-admin?edit=${team.id}`)}
                                      onDelete={async () => {
                                        if (confirm(`Are you sure you want to delete ${team.name}? This will also delete all associated players and matches.`)) {
                                          try {
                                            const { error } = await supabase.from('teams').delete().eq('id', team.id);
                                            if (error) throw error;
                                            await loadData();
                                          } catch (error) {
                                            console.error('Error deleting team:', error);
                                            alert('Error deleting team: ' + error);
                                          }
                                        }
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Other Opponents Section */}
                          {otherOpponents.length > 0 && (
                            <div className="mb-6">
                              <div 
                                className="relative mb-4 p-4 bg-gradient-to-r from-orange-100 via-orange-50 to-amber-100 rounded-xl border-2 border-orange-300 shadow-md cursor-pointer hover:shadow-lg transition-all duration-200"
                                onClick={() => toggleTeamSection('otherOpponents')}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 to-amber-200/20 rounded-xl"></div>
                                <div className="relative flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500 rounded-xl shadow-lg">
                                      <span className="text-2xl text-white">🏃</span>
                                    </div>
                                    <div>
                                      <h4 className="text-xl font-bold text-orange-900 mb-1">
                                        Other Opponents
                                      </h4>
                                      <p className="text-sm text-orange-700 font-medium">
                                        {otherOpponents.length} cup & other match teams
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-orange-600 text-xl font-bold transition-transform duration-200" style={{
                                    transform: collapsedTeamSections.otherOpponents ? 'rotate(0deg)' : 'rotate(90deg)'
                                  }}>
                                    ▶
                                  </div>
                                </div>
                              </div>
                              {!collapsedTeamSections.otherOpponents && (
                                <div className="space-y-3">
                                  {otherOpponents.map((team) => (
                                    <CollapsibleTeamCard 
                                      key={team.id} 
                                      team={team} 
                                      onEdit={() => router.push(`/match-admin?edit=${team.id}`)}
                                      onDelete={async () => {
                                        if (confirm(`Are you sure you want to delete ${team.name}? This will also delete all associated players and matches.`)) {
                                          try {
                                            const { error } = await supabase.from('teams').delete().eq('id', team.id);
                                            if (error) throw error;
                                            await loadData();
                                          } catch (error) {
                                            console.error('Error deleting team:', error);
                                            alert('Error deleting team: ' + error);
                                          }
                                        }
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      );
                    } else {
                      // Single category view (RVR or Opponents only)
                      return sortedTeams.map((team) => (
                        <CollapsibleTeamCard 
                          key={team.id} 
                          team={team} 
                          onEdit={() => router.push(`/match-admin?edit=${team.id}`)}
                          onDelete={async () => {
                            if (confirm(`Are you sure you want to delete ${team.name}? This will also delete all associated players and matches.`)) {
                              try {
                                const { error } = await supabase.from('teams').delete().eq('id', team.id);
                                if (error) throw error;
                                await loadData();
                              } catch (error) {
                                console.error('Error deleting team:', error);
                                alert('Error deleting team: ' + error);
                              }
                            }
                          }}
                        />
                      ));
                    }
                  })()}
                </div>

                {/* Empty State */}
                {teams.length === 0 && (
                  <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👥</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Teams Found</h3>
                    <p className="text-gray-600 mb-6">
                      Get started by creating your first team using the Match Admin wizard.
                    </p>
                    <a
                      href="/match-admin"
                      className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 text-white shadow-xl border-green-500 transform hover:scale-105 ring-4 ring-green-200 font-bold px-6 py-3 rounded-lg transition-all"
                    >
                      <span className="mr-2">🚀</span>
                      Create First Team
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Fixtures Tab */}
          {activeTab === 'fixtures' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">📅</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Upcoming Fixtures</h2>
                      <p className="text-sm text-gray-600">
                        {upcomingMatches.length} match{upcomingMatches.length !== 1 ? 'es' : ''} scheduled
                      </p>
                    </div>
                  </div>
                  
                  {/* Filter Toggle */}
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={showCancelledPostponed}
                        onChange={(e) => setShowCancelledPostponed(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span>Show cancelled/postponed</span>
                    </label>
                  </div>
                </div>
                  
                  <div className="space-y-4">
                    {upcomingMatches.length === 0 ? (
                      <div className="bg-gradient-to-br from-white via-gray-50 to-purple-50 rounded-xl p-8 text-center shadow-lg border border-purple-100">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <span className="text-white text-3xl">📅</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">No Fixtures Scheduled</h3>
                        <p className="text-gray-600 mb-6">
                          {selectedTeam === 'all' ? 'No upcoming fixtures scheduled' : 'No upcoming fixtures for selected team'}
                        </p>
                      </div>
                    ) : (
                      upcomingMatches.map((match, index) => {
                        const team = teams.find(t => t.id === match.teamId);
                        const needsRecording = isMatchUnrecorded(match);
                        const matchTypeColors = getMatchTypeCardColors(match.matchType);
                        return (
                          <motion.div 
                            key={match.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className={`rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 overflow-hidden relative ${
                              needsRecording 
                                ? 'bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50 border-amber-300 hover:border-amber-400' 
                                : `${matchTypeColors.background} ${matchTypeColors.border}`
                            }`}
                          >
                            {/* Match Indicator Strip */}
                            <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-xl ${
                              needsRecording 
                                ? 'bg-gradient-to-b from-amber-400 to-red-500' 
                                : matchTypeColors.accent
                            }`}></div>
                            
                            {/* Unrecorded Match Warning Badge */}
                            {needsRecording && (
                              <div className="absolute right-2 top-2">
                                <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                  <span>⚠️</span>
                                  <span>NEEDS RECORDING</span>
                                </div>
                              </div>
                            )}
                            
                            {/* Card Content */}
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                
                                {/* Left Side - Match Info */}
                                <div className="flex-1 pr-4">
                                  {/* Teams */}
                                  <div className="flex items-center gap-4 mb-3">
                                    <div className="text-xl font-bold text-gray-900">
                                      {team.name}
                                    </div>
                                    <span className="text-gray-400 font-bold text-lg">vs</span>
                                    <div className="text-xl font-bold text-gray-900">
                                      {match.opponent}
                                    </div>
                                  </div>
                                  
                                  {/* Match Details */}
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span className="font-semibold bg-white/70 px-2 py-1 rounded-lg">
                                      {match.scheduledDate.toLocaleDateString()}
                                    </span>
                                    <span className="font-semibold bg-white/70 px-2 py-1 rounded-lg">
                                      {match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg font-semibold shadow-sm ${
                                      match.isHomeMatch 
                                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700' 
                                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                                    }`}>
                                      {match.isHomeMatch ? '🏠 HOME' : '✈️ AWAY'}
                                    </span>
                                    <MatchTypeBadge matchType={match.matchType} className="shadow-sm" />
                                  </div>
                                </div>

                                {/* Right Side - Actions */}
                                <div className="flex items-center gap-4">
                                  {/* Edit Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/match-recorder?edit=${match.id}`);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                    title="Edit fixture"
                                  >
                                    ✏️
                                  </button>
                                  
                                  {/* Delete Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const team = teams.find(t => t.id === match.teamId);
                                      const matchName = `${team?.name || 'Unknown'} vs ${match.opponent}`;
                                      setDeleteModal({
                                        show: true,
                                        matchId: match.id,
                                        matchName: matchName,
                                        type: 'fixture'
                                      });
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                    title="Delete fixture"
                                  >
                                    🗑️
                                  </button>
                                  
                                  {/* Action Button */}
                                  <a
                                    href={`/matches/${match.id}/record`}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                                  >
                                    📝 Record
                                  </a>
                                  
                                  {/* Match Status Manager */}
                                  <MatchStatusManager
                                    match={match}
                                    onStatusUpdate={handleMatchStatusUpdate}
                                    teamName={team?.name}
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
            </motion.div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">📊</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Season Statistics</h2>
                      <p className="text-sm text-gray-600">Team performance analytics</p>
                    </div>
                  </div>
                  
                  {/* Filters for Stats */}
                  <div className="flex gap-3">
                    <select 
                      value={selectedStatsTeam}
                      onChange={(e) => setSelectedStatsTeam(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="all">All Teams</option>
                      {teams.filter(team => !team.isOpponent).map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                    
                    <div className="flex flex-wrap gap-2">
                      {['League', 'Cup', 'Friendly', 'Tournament'].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            const newTypes = new Set(selectedMatchTypes);
                            if (newTypes.has(type)) {
                              newTypes.delete(type);
                            } else {
                              newTypes.add(type);
                            }
                            setSelectedMatchTypes(newTypes);
                          }}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            selectedMatchTypes.has(type)
                              ? 'bg-purple-600 text-white shadow-md'
                              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3 Chart Boxes at Top - Smaller Size */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  
                  {/* Match Results Distribution */}
                  <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-xl p-4 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                      <span className="mr-2 text-lg">🎯</span>
                      Match Results
                    </h3>
                    <div className="h-48 flex items-center justify-center">
                      <Doughnut 
                        data={{
                          labels: ['Wins', 'Draws', 'Losses'],
                          datasets: [{
                            data: [currentStats.won, currentStats.drawn, currentStats.lost],
                            backgroundColor: [
                              '#10B981', // Green for wins
                              '#F59E0B', // Yellow for draws  
                              '#EF4444'  // Red for losses
                            ],
                            borderColor: [
                              '#059669',
                              '#D97706',
                              '#DC2626'
                            ],
                            borderWidth: 2,
                            hoverBorderWidth: 3,
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                padding: 20,
                                usePointStyle: true,
                                font: {
                                  size: 12,
                                  weight: 'bold'
                                }
                              }
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
                                  return `${context.label}: ${context.parsed} (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Goals Trend Over Time */}
                  <div className="bg-gradient-to-br from-white to-green-50 border border-green-200 rounded-xl p-4 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                      <span className="mr-2 text-lg">📈</span>
                      Goals Trend
                    </h3>
                    <div className="h-48">
                      <Line 
                        data={{
                          labels: (() => {
                            const teamMatches = getFilteredMatches(match => 
                              match.status === 'Finished' && match.homeScore !== undefined && match.awayScore !== undefined
                            )
                              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                              .slice(-10);
                            return teamMatches.map((match, index) => `Match ${index + 1}`);
                          })(),
                          datasets: [
                            {
                              label: 'Goals For',
                              data: (() => {
                                const teamMatches = getFilteredMatches(match => 
                                  match.status === 'Finished' && match.homeScore !== undefined && match.awayScore !== undefined
                                )
                                  .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                                  .slice(-10);
                                return teamMatches.map(match => match.isHomeMatch ? match.homeScore : match.awayScore);
                              })(),
                              borderColor: '#10B981',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              borderWidth: 3,
                              fill: true,
                              tension: 0.4,
                              pointBackgroundColor: '#10B981',
                              pointBorderColor: '#059669',
                              pointBorderWidth: 2,
                              pointRadius: 5,
                              pointHoverRadius: 8,
                            },
                            {
                              label: 'Goals Against',
                              data: (() => {
                                const teamMatches = getFilteredMatches(match => 
                                  match.status === 'Finished' && match.homeScore !== undefined && match.awayScore !== undefined
                                )
                                  .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                                  .slice(-10);
                                return teamMatches.map(match => match.isHomeMatch ? match.awayScore : match.homeScore);
                              })(),
                              borderColor: '#EF4444',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              borderWidth: 3,
                              fill: true,
                              tension: 0.4,
                              pointBackgroundColor: '#EF4444',
                              pointBorderColor: '#DC2626',
                              pointBorderWidth: 2,
                              pointRadius: 5,
                              pointHoverRadius: 8,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          interaction: {
                            intersect: false,
                            mode: 'index',
                          },
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                  size: 12,
                                  weight: 'bold'
                                }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              titleColor: 'white',
                              bodyColor: 'white',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              borderWidth: 1,
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                font: {
                                  size: 11
                                }
                              }
                            },
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                              },
                              ticks: {
                                font: {
                                  size: 11
                                },
                                stepSize: 1
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Home vs Away Performance Chart */}
                  <div className="bg-gradient-to-br from-white to-purple-50 border border-purple-200 rounded-xl p-4 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
                      <span className="mr-2 text-lg">🏠</span>
                      Home vs Away
                    </h3>
                    <div className="h-48">
                      <Bar 
                        data={{
                          labels: ['Home', 'Away'],
                          datasets: [
                            {
                              label: 'Wins',
                              data: [currentStats.homeWins, currentStats.awayWins],
                              backgroundColor: 'rgba(16, 185, 129, 0.8)',
                              borderColor: '#10B981',
                              borderWidth: 2,
                              borderRadius: 8,
                              borderSkipped: false,
                            },
                            {
                              label: 'Draws', 
                              data: [
                                (() => {
                                  const filteredMatches = getFilteredMatches(match => 
                                    match.status === 'Finished' && 
                                    match.isHomeMatch && 
                                    match.homeScore !== undefined && 
                                    match.awayScore !== undefined &&
                                    match.homeScore === match.awayScore
                                  );
                                  return filteredMatches.length;
                                })(),
                                (() => {
                                  const filteredMatches = getFilteredMatches(match => 
                                    match.status === 'Finished' && 
                                    !match.isHomeMatch && 
                                    match.homeScore !== undefined && 
                                    match.awayScore !== undefined &&
                                    match.homeScore === match.awayScore
                                  );
                                  return filteredMatches.length;
                                })()
                              ],
                              backgroundColor: 'rgba(245, 158, 11, 0.8)',
                              borderColor: '#F59E0B',
                              borderWidth: 2,
                              borderRadius: 8,
                              borderSkipped: false,
                            },
                            {
                              label: 'Losses',
                              data: [
                                currentStats.homeMatches - currentStats.homeWins - (() => {
                                  const homeDraws = allMatches
                                    .filter(match => selectedStatsTeam === 'all' || match.teamId === selectedStatsTeam)
                                    .filter(match => match.status === 'Finished' && match.isHomeMatch && match.homeScore === match.awayScore)
                                    .length;
                                  return homeDraws;
                                })(),
                                (() => {
                                  const awayDraws = getFilteredMatches(match => 
                                    match.status === 'Finished' && 
                                    !match.isHomeMatch && 
                                    match.homeScore !== undefined && 
                                    match.awayScore !== undefined &&
                                    match.homeScore === match.awayScore
                                  ).length;
                                  return currentStats.awayMatches - currentStats.awayWins - awayDraws;
                                })()
                              ],
                              backgroundColor: 'rgba(239, 68, 68, 0.8)',
                              borderColor: '#EF4444',
                              borderWidth: 2,
                              borderRadius: 8,
                              borderSkipped: false,
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                  size: 12,
                                  weight: 'bold'
                                }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              titleColor: 'white',
                              bodyColor: 'white',
                            }
                          },
                          scales: {
                            x: {
                              grid: {
                                display: false,
                              },
                              ticks: {
                                font: {
                                  size: 12,
                                  weight: 'bold'
                                }
                              }
                            },
                            y: {
                              beginAtZero: true,
                              grid: {
                                color: 'rgba(0, 0, 0, 0.1)',
                              },
                              ticks: {
                                font: {
                                  size: 11
                                },
                                stepSize: 1
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>


                </div>

                {/* Main Stats Grid - Real Data - Now Smaller Below Charts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-2">⚽</div>
                    <div className="text-2xl font-black text-green-600">{currentStats.played}</div>
                    <div className="text-xs text-gray-600 font-semibold">Matches Played</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-2xl font-black text-blue-600">{currentStats.won}</div>
                    <div className="text-xs text-gray-600 font-semibold">Wins</div>
                    {/* Win Percentage Gauge */}
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${currentStats.winPercentage}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{currentStats.winPercentage.toFixed(1)}%</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-2">🤝</div>
                    <div className="text-2xl font-black text-yellow-600">{currentStats.drawn}</div>
                    <div className="text-xs text-gray-600 font-semibold">Draws</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-2">💔</div>
                    <div className="text-2xl font-black text-red-600">{currentStats.lost}</div>
                    <div className="text-xs text-gray-600 font-semibold">Losses</div>
                  </motion.div>
                </div>

                {/* Goals Analysis */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="text-2xl mb-2">🥅</div>
                    <div className="text-2xl font-black text-emerald-600">{currentStats.goalsFor}</div>
                    <div className="text-xs text-gray-600 font-semibold">Goals For</div>
                    <div className="text-xs text-emerald-600 mt-1">{currentStats.avgGoalsFor.toFixed(1)} avg</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="text-2xl mb-2">🚫</div>
                    <div className="text-2xl font-black text-orange-600">{currentStats.goalsAgainst}</div>
                    <div className="text-xs text-gray-600 font-semibold">Goals Against</div>
                    <div className="text-xs text-orange-600 mt-1">{currentStats.avgGoalsAgainst.toFixed(1)} avg</div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="text-2xl mb-2">🛡️</div>
                    <div className="text-2xl font-black text-teal-600">{currentStats.cleanSheets}</div>
                    <div className="text-xs text-gray-600 font-semibold">Clean Sheets</div>
                    <div className="text-xs text-teal-600 mt-1">
                      {currentStats.played > 0 ? ((currentStats.cleanSheets / currentStats.played) * 100).toFixed(1) : 0}%
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="text-2xl mb-2">⚖️</div>
                    <div className="text-2xl font-black text-purple-600">{currentStats.goalsFor - currentStats.goalsAgainst > 0 ? '+' : ''}{currentStats.goalsFor - currentStats.goalsAgainst}</div>
                    <div className="text-xs text-gray-600 font-semibold">Goal Difference</div>
                  </motion.div>
                </div>

                {/* Performance Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  
                  {/* Home vs Away Performance */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-3 text-2xl">🏠</span>
                      Home vs Away
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Home Record:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-green-600">
                            {currentStats.homeWins}W-{currentStats.homeMatches - currentStats.homeWins}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${currentStats.homeMatches > 0 ? (currentStats.homeWins / currentStats.homeMatches) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Away Record:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">
                            {currentStats.awayWins}W-{currentStats.awayMatches - currentStats.awayWins}
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${currentStats.awayMatches > 0 ? (currentStats.awayWins / currentStats.awayMatches) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Form */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-3 text-2xl">📈</span>
                      Recent Form
                    </h3>
                    <div className="flex space-x-2 mb-3 justify-center">
                      {currentStats.form.length > 0 ? (
                        currentStats.form.map((result, index) => (
                          <motion.span 
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md ${
                              result === 'W' ? 'bg-green-500' : 
                              result === 'D' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          >
                            {result}
                          </motion.span>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm">No recent matches</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 text-center">Last {currentStats.form.length} matches</p>
                  </div>

                  {/* Performance Metrics */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-xl p-6 shadow-lg">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-3 text-2xl">📊</span>
                      Achievements
                    </h3>
                    <div className="space-y-3 text-sm">
                      {currentStats.biggestWin.margin > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Biggest Win:</span>
                          <span className="font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
                            {currentStats.biggestWin.score}
                          </span>
                        </div>
                      )}
                      {currentStats.biggestLoss.margin > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Biggest Loss:</span>
                          <span className="font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
                            {currentStats.biggestLoss.score}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Points (3-1-0):</span>
                        <span className="font-bold text-purple-600">
                          {(currentStats.won * 3) + currentStats.drawn}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Player Statistics Tables */}
                {statsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Loading placeholders */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm animate-pulse">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-300 rounded"></div>
                            <div className="w-20 h-4 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {[1, 2, 3].map((j) => (
                            <div key={j} className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                              </div>
                              <div className="text-right">
                                <div className="w-8 h-6 bg-gray-300 rounded mb-1"></div>
                                <div className="w-12 h-3 bg-gray-300 rounded"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Top Scorers */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center text-sm">
                        <span className="mr-2 text-lg">🥅</span>
                        Top Scorers
                      </h3>
                      {playerStats.topScorers.length > 5 && (
                        <button
                          onClick={() => togglePlayerSection('topScorers')}
                          className="text-xs text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                          {expandedSections.topScorers ? '▲ Show Less' : '▼ Show All'}
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {playerStats.topScorers.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-3xl mb-2">⚽</div>
                          <p className="text-gray-500 text-sm">No goals recorded yet</p>
                        </div>
                      ) : (
                        playerStats.topScorers
                          .slice(0, expandedSections.topScorers ? 10 : 5)
                          .map((player, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="font-semibold text-gray-900">{player.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-yellow-600 text-lg">{player.goals}</div>
                                <div className="text-xs text-gray-500">goals</div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Top Assists */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-100 border border-blue-200 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center text-sm">
                        <span className="mr-2 text-lg">🎯</span>
                        Top Assists
                      </h3>
                      {playerStats.topAssists.length > 5 && (
                        <button
                          onClick={() => togglePlayerSection('topAssists')}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {expandedSections.topAssists ? '▲ Show Less' : '▼ Show All'}
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {playerStats.topAssists.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-3xl mb-2">🎯</div>
                          <p className="text-gray-500 text-sm">No assists recorded yet</p>
                        </div>
                      ) : (
                        playerStats.topAssists
                          .slice(0, expandedSections.topAssists ? 10 : 5)
                          .map((player, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                  index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-cyan-400' : index === 2 ? 'bg-blue-600' : 'bg-gray-300'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="font-semibold text-gray-900">{player.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-blue-600 text-lg">{player.assists}</div>
                                <div className="text-xs text-gray-500">assists</div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Most Matches */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200 rounded-xl p-3 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center text-sm">
                        <span className="mr-2 text-lg">🏃</span>
                        Most Matches
                      </h3>
                      {playerStats.mostMatches.length > 5 && (
                        <button
                          onClick={() => togglePlayerSection('mostMatches')}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          {expandedSections.mostMatches ? '▲ Show Less' : '▼ Show All'}
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {playerStats.mostMatches.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-3xl mb-2">⚽</div>
                          <p className="text-gray-500 text-sm">No player data yet</p>
                        </div>
                      ) : (
                        playerStats.mostMatches
                          .slice(0, expandedSections.mostMatches ? 10 : 5)
                          .map((player, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/70 p-3 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                  index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-pink-400' : index === 2 ? 'bg-purple-600' : 'bg-gray-300'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="font-semibold text-gray-900">{player.name}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-purple-600 text-lg">{player.matches}</div>
                                <div className="text-xs text-gray-500">matches</div>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>
        </div>
          </div>
        </StandardLayout>
      </div>
      
      {/* Glass Effect Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setDeleteModal({ show: false, matchId: '', matchName: '', type: 'match' })}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full mx-4"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Warning Icon */}
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                Delete {deleteModal.type === 'fixture' ? 'Fixture' : 'Match'}?
              </h3>

              {/* Warning Message */}
              <div className="text-center mb-8">
                <p className="text-lg font-semibold text-gray-800 mb-3">
                  Are you sure you want to delete this {deleteModal.type}?
                </p>
                <p className="text-base text-gray-700 mb-2">
                  <strong>{deleteModal.matchName}</strong>
                </p>
                <p className="text-sm text-red-600 font-medium bg-red-50 rounded-lg p-3 border border-red-200">
                  ⚠️ This action cannot be undone
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteModal({ show: false, matchId: '', matchName: '', type: 'match' })}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all duration-200 border border-gray-300 hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteMatch(deleteModal.matchId)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Delete Forever
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightweight Match Details Overlay */}
      <AnimatePresence>
        {overlayMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setOverlayMatch(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const team = teams.find(t => t.id === overlayMatch.teamId);
                const result = getMatchResult(overlayMatch);
                
                return (
                  <div>
                    {/* Header */}
                    <div className={`p-4 text-white ${
                      result.result === 'W' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                      result.result === 'L' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
                      'bg-gradient-to-r from-yellow-500 to-yellow-600'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Match Details</h3>
                        <button
                          onClick={() => setOverlayMatch(null)}
                          className="text-white hover:text-gray-200 text-xl"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                      {/* Teams and Score */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {team?.name || 'Unknown'} vs {overlayMatch.opponent}
                        </div>
                        <div className="text-3xl font-bold text-gray-800 mb-2">
                          {result.teamScore} - {result.opponentScore}
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
                          result.result === 'W' ? 'bg-green-500' : 
                          result.result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}>
                          {result.result === 'W' ? '🏆 VICTORY' : 
                           result.result === 'L' ? '💪 DEFEAT' : '🤝 DRAW'}
                        </div>
                      </div>

                      {/* Match Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600 font-medium">Date</div>
                          <div className="text-base font-bold text-gray-900">
                            {overlayMatch.scheduledDate.toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600 font-medium">Time</div>
                          <div className="text-base font-bold text-gray-900">
                            {overlayMatch.scheduledDate.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600 font-medium">Venue</div>
                          <div className="text-base font-bold text-gray-900">
                            {overlayMatch.isHomeMatch ? 'HOME' : 'AWAY'}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600 font-medium">Competition</div>
                          <div className="text-base font-bold text-gray-900">
                            <MatchTypeBadge matchType={overlayMatch.matchType} />
                          </div>
                        </div>
                      </div>

                      {/* Squad Information */}
                      {overlayMatch.selectedSquad?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="text-lg font-bold text-gray-900 mb-3">👥 Squad & Match Details</h4>
                          
                          <div className="bg-purple-50 rounded-lg p-3 mb-3">
                            <div className="text-sm text-purple-700 font-medium mb-1">Selected Squad</div>
                            <div className="text-base font-bold text-purple-900">
                              {overlayMatch.selectedSquad.length} players selected
                            </div>
                          </div>
                          
                          {/* Detailed Match Information */}
                          <MatchExpandedDetails match={overlayMatch} />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <button
                          onClick={() => {
                            setOverlayMatch(null);
                            router.push(`/match-recorder?edit=${overlayMatch.id}`);
                          }}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                        >
                          ✏️ Edit Match
                        </button>
                        <button
                          onClick={() => setOverlayMatch(null)}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-all"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}