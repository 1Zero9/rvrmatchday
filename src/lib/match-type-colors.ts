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
        background: 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50',
        border: 'border-blue-200 hover:border-blue-300',
        accent: 'bg-gradient-to-b from-blue-400 to-blue-500'
      };
    case 'cup':
      return {
        background: 'bg-gradient-to-br from-yellow-50 via-yellow-100 to-amber-50',
        border: 'border-yellow-200 hover:border-yellow-300',
        accent: 'bg-gradient-to-b from-yellow-400 to-yellow-500'
      };
    case 'friendly':
      return {
        background: 'bg-gradient-to-br from-green-50 via-green-100 to-emerald-50',
        border: 'border-green-200 hover:border-green-300',
        accent: 'bg-gradient-to-b from-green-400 to-green-500'
      };
    case 'tournament':
      return {
        background: 'bg-gradient-to-br from-purple-50 via-purple-100 to-violet-50',
        border: 'border-purple-200 hover:border-purple-300',
        accent: 'bg-gradient-to-b from-purple-400 to-purple-500'
      };
    case 'training':
      return {
        background: 'bg-gradient-to-br from-orange-50 via-orange-100 to-red-50',
        border: 'border-orange-200 hover:border-orange-300',
        accent: 'bg-gradient-to-b from-orange-400 to-orange-500'
      };
    default:
      return {
        background: 'bg-gradient-to-br from-gray-50 via-gray-100 to-slate-50',
        border: 'border-gray-200 hover:border-gray-300',
        accent: 'bg-gradient-to-b from-gray-400 to-gray-500'
      };
  }
};

// MatchTypeBadge component moved to separate file due to JSX requirements