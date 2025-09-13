/**
 * Match Type Badge Component
 * Displays colorized badges for different match types
 */

import React from 'react';
import { getMatchTypeColors } from '../lib/match-type-colors';

interface MatchTypeBadgeProps {
  matchType: string;
  className?: string;
}

export const MatchTypeBadge: React.FC<MatchTypeBadgeProps> = ({ 
  matchType, 
  className = '' 
}) => {
  const colors = getMatchTypeColors(matchType);
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border} ${className}`}>
      <span className="text-sm">{colors.icon}</span>
      {matchType}
    </span>
  );
};

export default MatchTypeBadge;