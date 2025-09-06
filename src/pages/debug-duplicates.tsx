/**
 * Debug Duplicates Page
 * Simple page to identify and clean up duplicate players
 */

import React, { useState, useEffect } from 'react';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';

interface Player {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  position: string;
  is_captain: boolean;
  is_vice_captain: boolean;
  is_active: boolean;
  created_at: string;
  teams?: { name: string };
}

interface DuplicateSet {
  key: string;
  teamName: string;
  playerName: string;
  players: Player[];
}

export default function DebugDuplicates() {
  const [duplicates, setDuplicates] = useState<DuplicateSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);

  const findDuplicates = async () => {
    try {
      setLoading(true);

      // Get all players with team information
      const { data: players, error } = await supabase
        .from('players')
        .select(`
          id,
          team_id,
          first_name,
          last_name,
          position,
          is_captain,
          is_vice_captain,
          is_active,
          created_at,
          teams(name)
        `)
        .order('team_id')
        .order('first_name');

      if (error) {
        console.error('Error fetching players:', error);
        return;
      }

      if (!players) return;

      // Group players by team_id and name combination
      const playerGroups: { [key: string]: Player[] } = {};
      
      players.forEach(player => {
        const key = `${player.team_id}_${player.first_name?.trim()}_${player.last_name?.trim()}`;
        if (!playerGroups[key]) {
          playerGroups[key] = [];
        }
        playerGroups[key].push(player);
      });

      // Find duplicates
      const duplicatesList: DuplicateSet[] = [];
      
      Object.entries(playerGroups).forEach(([key, playerList]) => {
        if (playerList.length > 1) {
          const teamName = playerList[0].teams?.name || 'Unknown Team';
          const playerName = `${playerList[0].first_name || ''} ${playerList[0].last_name || ''}`.trim() || 'Unknown Player';
          
          duplicatesList.push({
            key,
            teamName,
            playerName,
            players: playerList.sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )
          });
        }
      });

      setDuplicates(duplicatesList);
    } catch (error) {
      console.error('Error finding duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupPlayer = async (duplicateSet: DuplicateSet) => {
    if (!confirm(`Are you sure you want to clean up duplicates for ${duplicateSet.playerName}? This will keep the oldest record and delete ${duplicateSet.players.length - 1} duplicates.`)) {
      return;
    }

    try {
      setCleaning(true);
      
      // Keep the oldest (first in sorted array), delete the rest
      const keepPlayer = duplicateSet.players[0];
      const deletePlayerIds = duplicateSet.players.slice(1).map(p => p.id);

      console.log(`Keeping player: ${keepPlayer.id}, Deleting: ${deletePlayerIds.join(', ')}`);

      const { error } = await supabase
        .from('players')
        .delete()
        .in('id', deletePlayerIds);

      if (error) {
        console.error('Error deleting duplicates:', error);
        alert(`Error cleaning up duplicates: ${error.message}`);
      } else {
        alert(`Successfully cleaned up ${deletePlayerIds.length} duplicate records for ${duplicateSet.playerName}`);
        // Refresh the list
        findDuplicates();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert(`Unexpected error: ${error}`);
    } finally {
      setCleaning(false);
    }
  };

  const cleanupAllDuplicates = async () => {
    if (!confirm(`Are you sure you want to clean up ALL duplicates? This will delete ${duplicates.reduce((sum, d) => sum + (d.players.length - 1), 0)} duplicate records.`)) {
      return;
    }

    try {
      setCleaning(true);
      let totalCleaned = 0;

      for (const duplicateSet of duplicates) {
        const deletePlayerIds = duplicateSet.players.slice(1).map(p => p.id);
        
        const { error } = await supabase
          .from('players')
          .delete()
          .in('id', deletePlayerIds);

        if (error) {
          console.error(`Error cleaning ${duplicateSet.playerName}:`, error);
        } else {
          totalCleaned += deletePlayerIds.length;
        }
      }

      alert(`Successfully cleaned up ${totalCleaned} duplicate records!`);
      findDuplicates();
    } catch (error) {
      console.error('Error in bulk cleanup:', error);
      alert(`Error in bulk cleanup: ${error}`);
    } finally {
      setCleaning(false);
    }
  };

  useEffect(() => {
    findDuplicates();
  }, []);

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Player Duplicates Debug</h1>
                <p className="text-gray-600">Identify and clean up duplicate player records</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={findDuplicates}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Scanning...' : 'Refresh Scan'}
                </button>
                {duplicates.length > 0 && (
                  <button
                    onClick={cleanupAllDuplicates}
                    disabled={cleaning}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {cleaning ? 'Cleaning...' : 'Clean All'}
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Scanning for duplicates...</p>
              </div>
            ) : duplicates.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-600 mb-2">No Duplicates Found!</h3>
                <p className="text-gray-600">All player records are clean.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    ⚠️ Found {duplicates.length} sets of duplicate players
                  </h3>
                  <p className="text-red-700">
                    Total duplicate records: {duplicates.reduce((sum, d) => sum + (d.players.length - 1), 0)}
                  </p>
                </div>

                <div className="space-y-4">
                  {duplicates.map((duplicateSet, index) => (
                    <div key={duplicateSet.key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {duplicateSet.playerName} ({duplicateSet.teamName})
                          </h4>
                          <p className="text-sm text-gray-600">
                            {duplicateSet.players.length} duplicate records found
                          </p>
                        </div>
                        <button
                          onClick={() => cleanupPlayer(duplicateSet)}
                          disabled={cleaning}
                          className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                          Clean Up
                        </button>
                      </div>

                      <div className="space-y-2">
                        {duplicateSet.players.map((player, playerIndex) => (
                          <div
                            key={player.id}
                            className={`p-3 rounded-md text-sm ${
                              playerIndex === 0 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">
                                  {playerIndex === 0 ? '✅ KEEP' : '❌ DELETE'}
                                </span>
                                <span className="ml-2">ID: {player.id}</span>
                                {player.is_captain && <span className="ml-2 text-yellow-600">[CAPTAIN]</span>}
                                {player.is_vice_captain && <span className="ml-2 text-blue-600">[VICE-CAPTAIN]</span>}
                              </div>
                              <div className="text-gray-600">
                                Created: {new Date(player.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}