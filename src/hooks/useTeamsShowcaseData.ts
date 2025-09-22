/**
 * Teams Showcase Data Hook
 * Fetches real team data for the homepage Teams Showcase section
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface TeamCategory {
  name: string;
  description: string;
  color: string;
  buttonColor: string;
  link: string;
  ageGroups: string;
  teamCount: number;
  playerCount: number;
  loading: boolean;
}

interface TeamsShowcaseData {
  youth: TeamCategory;
  girls: TeamCategory;
  senior: TeamCategory;
  loading: boolean;
  error: string | null;
}

export function useTeamsShowcaseData(): TeamsShowcaseData {
  const [data, setData] = useState<TeamsShowcaseData>({
    youth: {
      name: 'Youth Teams',
      description: 'Building skills, character, and friendships through football. Professional coaching for all abilities.',
      color: 'green',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      link: '/teams/boys',
      ageGroups: 'U8 - U18',
      teamCount: 0,
      playerCount: 0,
      loading: true
    },
    girls: {
      name: 'Girls Teams',
      description: 'Our fastest growing section! Empowering girls through sport in a supportive environment.',
      color: 'pink',
      buttonColor: 'bg-pink-600 hover:bg-pink-700',
      link: '/teams/girls',
      ageGroups: 'U8 - U16',
      teamCount: 0,
      playerCount: 0,
      loading: true
    },
    senior: {
      name: 'Senior Teams',
      description: 'League and cup competitions. Experience the thrill of adult football with a welcoming club.',
      color: 'blue',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      link: '/teams/seniors',
      ageGroups: 'Adult',
      teamCount: 0,
      playerCount: 0,
      loading: true
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchTeamsShowcaseData() {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Get team counts by category
        const { data: teams, error: teamsError } = await supabase
          .from('teams')
          .select('id, age_group, gender')
          .eq('is_active', true)
          .eq('is_opponent', false);

        // Get player counts by joining with teams to get team demographics
        const { data: players, error: playersError } = await supabase
          .from('players')
          .select(`
            id, 
            team_id,
            teams!players_team_id_fkey(id, age_group, gender)
          `)
          .eq('is_active', true);

        if (teamsError) {
          console.error('Error fetching teams:', teamsError);
        }

        if (playersError) {
          console.error('Error fetching players:', playersError);
        }

        // Categorize teams and players
        const teamsData = teams || [];
        const playersData = players || [];

        // Youth teams (U8-U18, Boys)
        const youthTeams = teamsData.filter(team => 
          team.age_group && 
          team.age_group.includes('U') && 
          (team.gender === 'Male' || team.gender === 'Boys' || !team.gender)
        );
        const youthPlayers = playersData.filter(player => 
          player.teams && 
          player.teams.age_group && 
          player.teams.age_group.includes('U') && 
          (player.teams.gender === 'Male' || player.teams.gender === 'Boys' || !player.teams.gender)
        );

        // Girls teams
        const girlsTeams = teamsData.filter(team => 
          team.gender === 'Female' || team.gender === 'Girls'
        );
        const girlsPlayers = playersData.filter(player => 
          player.teams && 
          (player.teams.gender === 'Female' || player.teams.gender === 'Girls')
        );

        // Senior teams (Adult or no age group specified and not girls)
        const seniorTeams = teamsData.filter(team => 
          (!team.age_group || team.age_group === 'Adult' || team.age_group === 'Senior') &&
          team.gender !== 'Female' && team.gender !== 'Girls'
        );
        const seniorPlayers = playersData.filter(player => 
          player.teams && 
          (!player.teams.age_group || player.teams.age_group === 'Adult' || player.teams.age_group === 'Senior') &&
          player.teams.gender !== 'Female' && player.teams.gender !== 'Girls'
        );

        setData(prev => ({
          ...prev,
          youth: {
            ...prev.youth,
            teamCount: youthTeams.length,
            playerCount: youthPlayers.length,
            loading: false
          },
          girls: {
            ...prev.girls,
            teamCount: girlsTeams.length,
            playerCount: girlsPlayers.length,
            loading: false
          },
          senior: {
            ...prev.senior,
            teamCount: seniorTeams.length,
            playerCount: seniorPlayers.length,
            loading: false
          },
          loading: false,
          error: null
        }));

      } catch (error) {
        console.error('Error fetching teams showcase data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load teams data'
        }));
      }
    }

    fetchTeamsShowcaseData();
  }, []);

  return data;
}