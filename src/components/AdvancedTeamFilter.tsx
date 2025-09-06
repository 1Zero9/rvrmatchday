/**
 * Advanced Team Filter System - Enterprise Scale
 * Handles unlimited teams with search, categorization, and favorites
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team } from '../types/match-tracker';

interface FilterState {
  search: string;
  league: string;
  division: string;
  season: string;
  status: string;
  favorites: string[];
  recents: string[];
}

interface AdvancedTeamFilterProps {
  teams: Team[];
  selectedTeamId: string;
  onSelectionChange: (teamId: string) => void;
  className?: string;
}

export default function AdvancedTeamFilter({ 
  teams, 
  selectedTeamId, 
  onSelectionChange,
  className = ""
}: AdvancedTeamFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    league: '',
    division: '',
    season: '',
    status: 'active',
    favorites: JSON.parse(localStorage.getItem('team-favorites') || '[]'),
    recents: JSON.parse(localStorage.getItem('team-recents') || '[]')
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Get unique leagues, divisions, seasons
  const metadata = useMemo(() => {
    const leagues = [...new Set(teams.map(t => t.league).filter(Boolean))].sort();
    const divisions = [...new Set(teams.map(t => t.ageGroup).filter(Boolean))].sort();
    const seasons = [...new Set(teams.map(t => t.season).filter(Boolean))].sort();
    
    return { leagues, divisions, seasons };
  }, [teams]);

  // Fuzzy search implementation
  const fuzzySearch = (text: string, query: string): number => {
    if (!query) return 1;
    
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exact match gets highest score
    if (textLower.includes(queryLower)) {
      return textLower.indexOf(queryLower) === 0 ? 1.0 : 0.8;
    }
    
    // Character-by-character fuzzy matching
    let score = 0;
    let queryIndex = 0;
    
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        score += 1 / textLower.length;
        queryIndex++;
      }
    }
    
    return queryIndex === queryLower.length ? score : 0;
  };

  // Filter and sort teams
  const filteredTeams = useMemo(() => {
    let filtered = teams.filter(team => {
      // Basic filters
      if (filters.league && team.league !== filters.league) return false;
      if (filters.division && team.ageGroup !== filters.division) return false;
      if (filters.season && team.season !== filters.season) return false;
      if (filters.status === 'active' && team.isOpponent) return false;
      if (filters.status === 'opponents' && !team.isOpponent) return false;
      
      return true;
    });

    // Apply search with fuzzy matching
    if (filters.search) {
      filtered = filtered.map(team => ({
        ...team,
        searchScore: Math.max(
          fuzzySearch(team.name, filters.search),
          fuzzySearch(team.league || '', filters.search),
          fuzzySearch(team.ageGroup || '', filters.search)
        )
      }))
      .filter(team => (team as any).searchScore > 0)
      .sort((a, b) => (b as any).searchScore - (a as any).searchScore);
    }

    // Sort by: favorites first, then recent, then alphabetical
    return filtered.sort((a, b) => {
      const aIsFav = filters.favorites.includes(a.id);
      const bIsFav = filters.favorites.includes(b.id);
      const aIsRecent = filters.recents.includes(a.id);
      const bIsRecent = filters.recents.includes(b.id);

      if (aIsFav && !bIsFav) return -1;
      if (!aIsFav && bIsFav) return 1;
      if (aIsRecent && !bIsRecent) return -1;
      if (!aIsRecent && bIsRecent) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }, [teams, filters]);

  // Handle team selection
  const handleTeamSelect = (teamId: string) => {
    onSelectionChange(teamId);
    
    // Update recents
    const newRecents = [teamId, ...filters.recents.filter(id => id !== teamId)].slice(0, 10);
    setFilters(prev => ({ ...prev, recents: newRecents }));
    localStorage.setItem('team-recents', JSON.stringify(newRecents));
    
    setIsOpen(false);
  };

  // Toggle favorite
  const toggleFavorite = (teamId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newFavorites = filters.favorites.includes(teamId)
      ? filters.favorites.filter(id => id !== teamId)
      : [...filters.favorites, teamId];
    
    setFilters(prev => ({ ...prev, favorites: newFavorites }));
    localStorage.setItem('team-favorites', JSON.stringify(newFavorites));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters(prev => ({
      ...prev,
      search: '',
      league: '',
      division: '',
      season: ''
    }));
  };

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const hasActiveFilters = filters.search || filters.league || filters.division || filters.season;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {selectedTeamId !== 'all' && filters.favorites.includes(selectedTeamId) && (
              <span className="text-yellow-500">⭐</span>
            )}
            <span className="font-medium text-gray-900">
              {selectedTeamId === 'all' ? 'All Teams' : selectedTeam?.name || 'Select Team'}
            </span>
          </div>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              {filteredTeams.length} filtered
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear filters"
            >
              ✕
            </button>
          )}
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Search and Filters Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              {/* Search Input */}
              <div className="relative mb-3">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search teams, leagues, divisions..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.league}
                  onChange={(e) => setFilters(prev => ({ ...prev, league: e.target.value }))}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Leagues</option>
                  {metadata.leagues.map(league => (
                    <option key={league} value={league}>{league}</option>
                  ))}
                </select>

                <select
                  value={filters.division}
                  onChange={(e) => setFilters(prev => ({ ...prev, division: e.target.value }))}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Divisions</option>
                  {metadata.divisions.map(division => (
                    <option key={division} value={division}>{division}</option>
                  ))}
                </select>

                <select
                  value={filters.season}
                  onChange={(e) => setFilters(prev => ({ ...prev, season: e.target.value }))}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Seasons</option>
                  {metadata.seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="active">Active Teams</option>
                  <option value="opponents">Opponents</option>
                  <option value="all">All Teams</option>
                </select>
              </div>

              {/* Results Summary */}
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>{filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''} found</span>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {/* All Teams Option */}
            <div className="border-b border-gray-100">
              <button
                onClick={() => handleTeamSelect('all')}
                className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center justify-between ${
                  selectedTeamId === 'all' ? 'bg-blue-100 border-r-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🌟</span>
                  <div>
                    <div className="font-medium text-gray-900">All Teams</div>
                    <div className="text-sm text-gray-500">View data across all teams</div>
                  </div>
                </div>
                {selectedTeamId === 'all' && <span className="text-blue-600">✓</span>}
              </button>
            </div>

            {/* Team List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredTeams.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-4xl mb-2">🔍</div>
                  <div className="font-medium">No teams found</div>
                  <div className="text-sm">Try adjusting your search or filters</div>
                </div>
              ) : (
                filteredTeams.map((team, index) => {
                  const isFavorite = filters.favorites.includes(team.id);
                  const isRecent = filters.recents.includes(team.id);
                  const isSelected = team.id === selectedTeamId;

                  return (
                    <motion.button
                      key={team.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleTeamSelect(team.id)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group ${
                        isSelected ? 'bg-blue-100 border-r-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <button
                          onClick={(e) => toggleFavorite(team.id, e)}
                          className="text-lg hover:scale-110 transition-transform"
                        >
                          {isFavorite ? '⭐' : '☆'}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900 truncate">{team.name}</span>
                            {isRecent && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                Recent
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            {team.league && <span>{team.league}</span>}
                            {team.league && team.ageGroup && <span>•</span>}
                            {team.ageGroup && <span>{team.ageGroup}</span>}
                            {(team.league || team.ageGroup) && team.season && <span>•</span>}
                            {team.season && <span>{team.season}</span>}
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && <span className="text-blue-600 font-medium">✓</span>}
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Footer with keyboard shortcuts */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center justify-between">
                <span>⭐ Click star to favorite • ↑↓ Navigate • Enter Select</span>
                <span>{filteredTeams.length} / {teams.length} teams</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}