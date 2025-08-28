/**
 * Celebration Result Card Component
 * Dynamic, celebratory match result display that promotes every team!
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Match, Team } from '../types/match-tracker';
import { generateMatchStory, getCelebrationColors, getMatchEmojis } from '../lib/match-celebration';

interface CelebrationResultCardProps {
  match: Match;
  team: Team;
  teamScore: number;
  opponentScore: number;
  result: 'W' | 'L' | 'D';
  expanded: boolean;
  onToggleExpanded: () => void;
  index: number;
}

export default function CelebrationResultCard({
  match,
  team,
  teamScore,
  opponentScore,
  result,
  expanded,
  onToggleExpanded,
  index
}: CelebrationResultCardProps) {
  const story = generateMatchStory(match, team.name, teamScore, opponentScore);
  const colors = getCelebrationColors(result);
  const goalDifference = Math.abs(teamScore - opponentScore);
  const matchEmojis = getMatchEmojis(result, goalDifference);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={onToggleExpanded}
    >
      <div className={`relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/30 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:bg-white/80 hover:scale-[1.02] ${story.personality.borderColor}`}>
        
        {/* Match Header */}
        <div className="text-center mb-6">
          <div className="text-lg font-semibold text-gray-700 mb-2">
            {match.matchType} • {new Date(match.scheduledDate).toLocaleDateString()}
          </div>
          <div className="text-sm text-gray-600">
            {story.opponentRecognition}
          </div>
        </div>

        {/* Main Score Display */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${match.isHomeMatch ? 'bg-blue-500' : 'bg-green-500'}`}></div>
              <div className="font-bold text-lg text-gray-900">{team.name}</div>
              {match.isHomeMatch && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">🏠 Home</span>}
            </div>
            <div className="text-gray-600 text-sm">vs {match.opponent}</div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <span className="mr-1">📅</span>
              {new Date(match.scheduledDate).toLocaleDateString()}
            </div>
          </div>

          {/* Dynamic Score Display */}
          <div className="text-center mx-6">
            <motion.div 
              className="text-4xl font-black mb-2"
              animate={{ 
                scale: expanded ? 1.1 : 1,
                rotate: expanded ? [0, 2, -2, 0] : 0 
              }}
              transition={{ duration: 0.4 }}
            >
              <span className={result === 'W' ? 'text-green-600' : result === 'L' ? 'text-purple-600' : 'text-yellow-600'}>
                {teamScore}
              </span>
              <span className="text-gray-400 mx-2">-</span>
              <span className="text-gray-700">{opponentScore}</span>
            </motion.div>
            
            {/* Result Badge */}
            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${colors.bg} ${colors.border} ${colors.text}`}>
              {result === 'W' ? '✓ Win' : result === 'L' ? '○ Loss' : '= Draw'}
            </div>
          </div>

          <div className="flex-1 text-right">
            <div className="flex items-center justify-end space-x-3 mb-2">
              <div className="font-bold text-lg text-gray-900">{match.opponent}</div>
              <div className={`w-3 h-3 rounded-full ${!match.isHomeMatch ? 'bg-blue-500' : 'bg-green-500'}`}></div>
              {!match.isHomeMatch && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✈️ Away</span>}
            </div>
            <div className="text-xs text-gray-500 text-right">
              {match.matchType} • {match.venue || (match.isHomeMatch ? 'Home Ground' : 'Away Ground')}
            </div>
          </div>
        </div>

        {/* Opponent Recognition */}
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 italic">
            👏 {story.opponentRecognition}
          </div>
        </div>

        {/* Expand Indicator */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-gray-400 text-xl"
        >
          ⌄
        </motion.div>

        {/* Expandable Content */}
        <motion.div
          initial={false}
          animate={{
            height: expanded ? 'auto' : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="pt-6 border-t border-gray-200/50 mt-4">
            
            {/* Match Summary */}
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  A {result === 'W' ? 'well-earned victory' : result === 'L' ? 'hard-fought match' : 'competitive draw'} for {team.name} against {match.opponent}. 
                  {result === 'W' && goalDifference >= 2 && ' Excellent team performance.'}
                  {result === 'D' && ' Both teams played with great spirit.'}
                  {result === 'L' && ' The team showed great determination throughout.'}
                </p>
              </div>
            </div>

            {/* Match Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-gray-500">Competition</span>
                <div className="font-medium text-gray-900">{match.matchType}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-xs text-gray-500">Time</span>
                <div className="font-medium text-gray-900">
                  {new Date(match.scheduledDate).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500/20 backdrop-blur-sm border border-blue-200/50 text-blue-700 px-6 py-3 rounded-xl font-medium hover:bg-blue-500/30 transition-all flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(`${team.name} ${result === 'W' ? 'beat' : result === 'D' ? 'drew with' : 'played'} ${match.opponent} ${teamScore}-${opponentScore}`);
                  alert('Match result copied to clipboard! 📋');
                }}
              >
                <span className="mr-2">📋</span>
                Copy Result
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Celebration Background Effect */}
        {story.personality.intensity === 'high' && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${story.personality.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none`}
            animate={{ 
              scale: expanded ? [1, 1.02, 1] : 1,
            }}
            transition={{ 
              duration: 2, 
              repeat: expanded ? Infinity : 0,
              repeatType: 'reverse'
            }}
          />
        )}
      </div>
    </motion.div>
  );
}