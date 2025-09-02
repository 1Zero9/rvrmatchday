/**
 * Data Migration Tool - Move localStorage to Supabase
 * One-time migration for moving to production
 */

import React, { useState } from 'react';
import StandardLayout from '../components/StandardLayout';
import { supabase } from '../lib/supabase';

export default function MigrateData() {
  const [migrating, setMigrating] = useState(false);
  const [results, setResults] = useState<any>(null);

  const migrateToSupabase = async () => {
    setMigrating(true);
    const migration: any = {};

    try {
      // 1. Get localStorage data
      const localTeams = JSON.parse(localStorage.getItem('teams') || '[]');
      const localMatches = JSON.parse(localStorage.getItem('matches') || '[]');
      const localMatchEvents = JSON.parse(localStorage.getItem('match_events') || '[]');

      migration.localStorage = {
        teams: localTeams.length,
        matches: localMatches.length,
        events: localMatchEvents.length
      };

      // 2. Migrate Teams
      if (localTeams.length > 0) {
        const supabaseTeams = localTeams.map((team: any) => ({
          id: team.id,
          name: team.name,
          short_name: team.name,
          season: team.season || '2024-25',
          home_colors: team.homeKit || { primary: '#00A651', secondary: '#FFFFFF' },
          away_colors: team.awayKit || { primary: '#001F3F', secondary: '#FFFFFF' },
          is_opponent: team.isOpponent || false,
          age_group: team.ageGroup,
          gender: team.gender,
          league: team.league,
          home_venue: team.homeVenue,
          contact_email: team.contactEmail,
          contact_phone: team.contactPhone,
          notes: team.notes,
          is_active: true,
          is_public: true
        }));

        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .upsert(supabaseTeams, { onConflict: 'id' })
          .select();

        migration.teams = { success: !teamError, count: teamData?.length || 0, error: teamError?.message };

        // 3. Migrate Players (from team.players)
        const allPlayers: any[] = [];
        localTeams.forEach((team: any) => {
          if (team.players && team.players.length > 0) {
            team.players.forEach((player: any) => {
              allPlayers.push({
                id: player.id,
                team_id: team.id,
                first_name: player.name,
                position: player.position,
                jersey_number: player.number || player.jerseyNumber,
                is_active: player.isActive !== false
              });
            });
          }
        });

        if (allPlayers.length > 0) {
          const { data: playerData, error: playerError } = await supabase
            .from('players')
            .upsert(allPlayers, { onConflict: 'id' })
            .select();

          migration.players = { success: !playerError, count: playerData?.length || 0, error: playerError?.message };
        }
      }

      // 4. Migrate Matches
      if (localMatches.length > 0) {
        const supabaseMatches = localMatches.map((match: any) => ({
          id: match.id,
          team_id: match.teamId,
          opponent: match.opponent,
          match_type: match.matchType || 'League',
          is_home_match: match.isHomeMatch,
          venue: match.venue,
          scheduled_date: new Date(match.scheduledDate).toISOString(),
          actual_kick_off: match.actualKickOff ? new Date(match.actualKickOff).toISOString() : null,
          status: match.status,
          home_score: match.homeScore || 0,
          away_score: match.awayScore || 0,
          referee: match.referee,
          weather: match.weather,
          temperature: match.temperature,
          pitch_condition: match.pitchCond || 'Good',
          player_of_match: match.playerOfTheMatch,
          yellow_cards: match.yellowCards,
          red_cards: match.redCards,
          attendance: match.attendance,
          notes: match.notes,
          selected_squad: match.selectedSquad || [],
          recorded_by: match.recordedBy || 'migration'
        }));

        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .upsert(supabaseMatches, { onConflict: 'id' })
          .select();

        migration.matches = { success: !matchError, count: matchData?.length || 0, error: matchError?.message };
      }

      // 5. Migrate Match Events
      if (localMatchEvents.length > 0) {
        const supabaseEvents = localMatchEvents.map((event: any) => ({
          id: event.id,
          match_id: event.matchId,
          player_id: event.playerId,
          player_name: event.playerName,
          event_type: event.eventType,
          event_minute: event.minute,
          additional_time: event.additionalTime || 0,
          event_half: event.half,
          event_data: event.eventData || {},
          notes: event.notes,
          is_our_team: true,
          created_by: event.recordedBy || 'migration'
        }));

        const { data: eventData, error: eventError } = await supabase
          .from('match_events')
          .upsert(supabaseEvents, { onConflict: 'id' })
          .select();

        migration.events = { success: !eventError, count: eventData?.length || 0, error: eventError?.message };
      }

      setResults(migration);

    } catch (error) {
      console.error('Migration error:', error);
      migration.error = (error as Error).message;
      setResults(migration);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Migration Tool</h1>
            <p className="text-gray-600">Migrate localStorage data to Supabase production database</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Migration Steps</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Run <code>sql/10_create_match_tracking_tables.sql</code> in Supabase SQL Editor</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Click the migration button below</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Set <code>NEXT_PUBLIC_USE_SUPABASE=true</code> in production</span>
              </div>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Current localStorage Data:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Teams: {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('teams') || '[]').length : 'Loading...'}</div>
                <div>Matches: {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('matches') || '[]').length : 'Loading...'}</div>
                <div>Events: {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('match_events') || '[]').length : 'Loading...'}</div>
              </div>
            </div>

            <button
              onClick={migrateToSupabase}
              disabled={migrating}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-bold transition-colors"
            >
              {migrating ? 'Migrating Data...' : '🚀 Start Migration'}
            </button>
          </div>

          {results && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Migration Results</h2>
              
              {results.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">Migration Failed</p>
                  <p className="text-red-600 text-sm mt-1">{results.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Source Data */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Source (localStorage)</h3>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>Teams: {results.localStorage?.teams || 0}</div>
                      <div>Matches: {results.localStorage?.matches || 0}</div>
                      <div>Events: {results.localStorage?.events || 0}</div>
                    </div>
                  </div>

                  {/* Migration Results */}
                  {Object.entries(results).filter(([key]) => key !== 'localStorage').map(([table, info]: [string, any]) => (
                    <div key={table} className={`p-4 rounded-lg ${info.success ? 'bg-green-50' : 'bg-red-50'}`}>
                      <h3 className={`font-medium mb-2 ${info.success ? 'text-green-900' : 'text-red-900'}`}>
                        {info.success ? '✅' : '❌'} {table}
                      </h3>
                      <div className={`text-sm ${info.success ? 'text-green-800' : 'text-red-800'}`}>
                        {info.success ? (
                          <div>Successfully migrated {info.count} records</div>
                        ) : (
                          <div>Error: {info.error}</div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Next Steps */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-900 mb-2">Next Steps</h3>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <div>1. Set NEXT_PUBLIC_USE_SUPABASE=true in production environment</div>
                      <div>2. Deploy to production</div>
                      <div>3. Test that teams and matches appear correctly</div>
                      <div>4. Remove this migration page</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </StandardLayout>
  );
}