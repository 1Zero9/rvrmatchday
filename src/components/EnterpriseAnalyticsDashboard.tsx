/**
 * Enterprise Analytics Dashboard - Unlimited Scale Insights
 * Comprehensive analytics for managing thousands of teams, players, matches
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Team, Match, Player } from '../types/match-tracker';

interface AnalyticsData {
  teams: Team[];
  matches: Match[];
  players: Player[];
}

interface EnterpriseAnalyticsDashboardProps {
  data: AnalyticsData;
  selectedPeriod: 'week' | 'month' | 'season' | 'all';
  onPeriodChange: (period: 'week' | 'month' | 'season' | 'all') => void;
  className?: string;
}

export default function EnterpriseAnalyticsDashboard({
  data,
  selectedPeriod,
  onPeriodChange,
  className = ""
}: EnterpriseAnalyticsDashboardProps) {
  
  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const { teams, matches, players } = data;
    const now = new Date();
    
    // Filter matches by selected period
    const getFilteredMatches = () => {
      const cutoffDate = new Date();
      switch (selectedPeriod) {
        case 'week':
          cutoffDate.setDate(cutoffDate.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(cutoffDate.getMonth() - 1);
          break;
        case 'season':
          cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
          break;
        default:
          return matches;
      }
      return matches.filter(match => 
        new Date(match.scheduledDate) >= cutoffDate
      );
    };

    const filteredMatches = getFilteredMatches();
    const finishedMatches = filteredMatches.filter(m => m.status === 'Finished');
    
    // Team Analytics
    const teamStats = {
      total: teams.length,
      active: teams.filter(t => !t.isOpponent && t.isActive !== false).length,
      opponents: teams.filter(t => t.isOpponent).length,
      byLeague: teams.reduce((acc, team) => {
        const league = team.league || 'Unassigned';
        acc[league] = (acc[league] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byDivision: teams.reduce((acc, team) => {
        const division = team.ageGroup || 'Unknown';
        acc[division] = (acc[division] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      bySeason: teams.reduce((acc, team) => {
        const season = team.season || 'Unknown';
        acc[season] = (acc[season] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    // Player Analytics
    const playerStats = {
      total: players.length,
      active: players.filter(p => p.isActive !== false).length,
      byPosition: players.reduce((acc, player) => {
        const position = player.position || 'Unknown';
        acc[position] = (acc[position] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      avgPerTeam: Math.round(players.length / Math.max(teamStats.active, 1))
    };

    // Match Analytics
    const matchStats = {
      total: filteredMatches.length,
      finished: finishedMatches.length,
      scheduled: filteredMatches.filter(m => m.status === 'Scheduled').length,
      cancelled: filteredMatches.filter(m => m.status === 'Cancelled').length,
      winRate: finishedMatches.length > 0 
        ? Math.round((finishedMatches.filter(m => {
            const homeScore = m.homeScore || 0;
            const awayScore = m.awayScore || 0;
            return m.isHomeMatch ? homeScore > awayScore : awayScore > homeScore;
          }).length / finishedMatches.length) * 100)
        : 0,
      totalGoals: finishedMatches.reduce((sum, match) => 
        sum + (match.homeScore || 0) + (match.awayScore || 0), 0),
      avgGoalsPerMatch: finishedMatches.length > 0 
        ? Math.round((finishedMatches.reduce((sum, match) => 
            sum + (match.homeScore || 0) + (match.awayScore || 0), 0) / finishedMatches.length) * 10) / 10
        : 0
    };

    // Growth Analytics (comparing periods)
    const growthStats = {
      teamsGrowth: '+12%', // TODO: Calculate actual growth
      playersGrowth: '+8%',
      matchesGrowth: '+25%',
      engagementGrowth: '+15%'
    };

    // Performance Insights
    const insights = [
      {
        type: 'success',
        title: 'High Win Rate',
        description: `${matchStats.winRate}% win rate across all matches`,
        action: 'View match analysis',
        priority: 'high'
      },
      {
        type: 'warning',
        title: 'Squad Size Variation',
        description: `Average of ${playerStats.avgPerTeam} players per team`,
        action: 'Review team rosters',
        priority: 'medium'
      },
      {
        type: 'info',
        title: 'League Distribution',
        description: `Teams spread across ${Object.keys(teamStats.byLeague).length} leagues`,
        action: 'Optimize leagues',
        priority: 'low'
      }
    ];

    return {
      teamStats,
      playerStats,
      matchStats,
      growthStats,
      insights
    };
  }, [data, selectedPeriod]);

  const StatCard = ({ title, value, change, icon, color = 'blue' }: any) => (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="mr-1">
                {change.startsWith('+') ? '↗️' : '↘️'}
              </span>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header with Period Selection */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights across {analytics.teamStats.total.toLocaleString()} teams, 
            {analytics.playerStats.total.toLocaleString()} players, and 
            {analytics.matchStats.total.toLocaleString()} matches
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {(['week', 'month', 'season', 'all'] as const).map(period => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Teams"
          value={analytics.teamStats.active}
          change={analytics.growthStats.teamsGrowth}
          icon="⚽"
          color="blue"
        />
        <StatCard
          title="Total Players"
          value={analytics.playerStats.active}
          change={analytics.growthStats.playersGrowth}
          icon="👥"
          color="green"
        />
        <StatCard
          title="Matches Played"
          value={analytics.matchStats.finished}
          change={analytics.growthStats.matchesGrowth}
          icon="🏆"
          color="purple"
        />
        <StatCard
          title="Win Rate"
          value={analytics.matchStats.winRate}
          change="+3%"
          icon="🎯"
          color="orange"
        />
      </div>

      {/* Detailed Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        
        {/* League Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            League Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.teamStats.byLeague)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([league, count]) => (
                <div key={league} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate">{league}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(analytics.teamStats.byLeague))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Player Positions */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👥</span>
            Player Positions
          </h3>
          <div className="space-y-3">
            {Object.entries(analytics.playerStats.byPosition)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([position, count]) => (
                <div key={position} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{position}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(count / Math.max(...Object.values(analytics.playerStats.byPosition))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Key Insights
          </h3>
          <div className="space-y-4">
            {analytics.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success' ? 'bg-green-50 border-green-500' :
                  insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <h4 className="font-medium text-gray-900 text-sm">
                  {insight.title}
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  {insight.description}
                </p>
                <button className={`text-sm mt-2 font-medium ${
                  insight.type === 'success' ? 'text-green-700 hover:text-green-800' :
                  insight.type === 'warning' ? 'text-yellow-700 hover:text-yellow-800' :
                  'text-blue-700 hover:text-blue-800'
                }`}>
                  {insight.action} →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {analytics.matchStats.avgGoalsPerMatch}
            </div>
            <div className="text-sm text-blue-700">Avg Goals/Match</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {Object.keys(analytics.teamStats.byLeague).length}
            </div>
            <div className="text-sm text-blue-700">Active Leagues</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {analytics.playerStats.avgPerTeam}
            </div>
            <div className="text-sm text-blue-700">Avg Players/Team</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {((analytics.matchStats.finished / analytics.matchStats.total) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-blue-700">Match Completion</div>
          </div>
        </div>
      </div>

      {/* Export & Actions */}
      <div className="flex items-center justify-between p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">Export Analytics</h3>
          <p className="text-sm text-gray-600 mt-1">
            Generate reports for stakeholders and league officials
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
            📊 Export CSV
          </button>
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
            📋 Generate Report
          </button>
          <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
            📧 Email Report
          </button>
        </div>
      </div>
    </div>
  );
}