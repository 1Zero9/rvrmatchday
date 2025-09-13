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

// MatchTypeBadge component moved to separate file due to JSX requirements