/**
 * Match Type Color Utility
 * Provides consistent color schemes for different match types
 */

export interface MatchTypeColors {
  bg: string;
  text: string;
  border: string;
  icon: string;
}

export interface MatchTypeCardColors {
  background: string;
  border: string;
  accent: string;
}

export const getMatchTypeColors = (matchType: string): MatchTypeColors => {
  switch (matchType.toLowerCase()) {
    case 'league':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200',
        icon: '🏆'
      };
    case 'cup':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        icon: '🏅'
      };
    case 'friendly':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        icon: '🤝'
      };
    case 'tournament':
      return {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
        border: 'border-purple-200',
        icon: '🎯'
      };
    case 'training':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200',
        icon: '⚽'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        icon: '⚽'
      };
  }
};

export const getMatchTypeCardColors = (matchType: string): MatchTypeCardColors => {
  switch (matchType.toLowerCase()) {
    case 'league':
      return {
        background: 'bg-gradient-to-br from-white via-blue-50/30 to-blue-50/20',
        border: 'border-blue-100/50 hover:border-blue-200/60',
        accent: 'bg-gradient-to-b from-blue-400 to-blue-500'
      };
    case 'cup':
      return {
        background: 'bg-gradient-to-br from-white via-yellow-50/30 to-yellow-50/20',
        border: 'border-yellow-100/50 hover:border-yellow-200/60',
        accent: 'bg-gradient-to-b from-yellow-400 to-yellow-500'
      };
    case 'friendly':
      return {
        background: 'bg-gradient-to-br from-white via-green-50/30 to-green-50/20',
        border: 'border-green-100/50 hover:border-green-200/60',
        accent: 'bg-gradient-to-b from-green-400 to-green-500'
      };
    case 'tournament':
      return {
        background: 'bg-gradient-to-br from-white via-purple-50/30 to-purple-50/20',
        border: 'border-purple-100/50 hover:border-purple-200/60',
        accent: 'bg-gradient-to-b from-purple-400 to-purple-500'
      };
    case 'training':
      return {
        background: 'bg-gradient-to-br from-white via-orange-50/30 to-orange-50/20',
        border: 'border-orange-100/50 hover:border-orange-200/60',
        accent: 'bg-gradient-to-b from-orange-400 to-orange-500'
      };
    default:
      return {
        background: 'bg-gradient-to-br from-white via-gray-50/30 to-gray-50/20',
        border: 'border-gray-100/50 hover:border-gray-200/60',
        accent: 'bg-gradient-to-b from-gray-400 to-gray-500'
      };
  }
};

// MatchTypeBadge component moved to separate file due to JSX requirements