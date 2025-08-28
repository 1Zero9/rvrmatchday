/**
 * Match Celebration Engine
 * Transforms boring scores into dynamic celebrations!
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import { Match } from '../types/match-tracker';

export interface MatchPersonality {
  type: 'thriller' | 'dominant' | 'comeback' | 'battle' | 'goalfest' | 'fighting' | 'clean';
  celebration: string;
  description: string;
  emoji: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  intensity: 'high' | 'medium' | 'low';
}

export interface MatchStory {
  personality: MatchPersonality;
  headline: string;
  subtitle: string;
  opponentRecognition: string;
  socialText: string;
  keyMoments: string[];
}

// Match personality definitions
const PERSONALITIES: { [key: string]: MatchPersonality } = {
  thriller: {
    type: 'thriller',
    celebration: 'WHAT A THRILLER!',
    description: 'Edge-of-seat drama that had everyone cheering!',
    emoji: '🔥⚡',
    bgGradient: 'from-orange-400/20 via-red-400/20 to-pink-400/20',
    borderColor: 'border-orange-300/50',
    textColor: 'text-orange-800',
    intensity: 'high'
  },
  dominant: {
    type: 'dominant',
    celebration: 'DOMINANT PERFORMANCE!',
    description: 'Pure class and skill on display today!',
    emoji: '⚡🏆',
    bgGradient: 'from-blue-400/20 via-purple-400/20 to-indigo-400/20',
    borderColor: 'border-blue-300/50',
    textColor: 'text-blue-800',
    intensity: 'high'
  },
  comeback: {
    type: 'comeback',
    celebration: 'INCREDIBLE COMEBACK!',
    description: 'Never give up attitude - pure RVR spirit!',
    emoji: '💪🌟',
    bgGradient: 'from-green-400/20 via-emerald-400/20 to-teal-400/20',
    borderColor: 'border-green-300/50',
    textColor: 'text-green-800',
    intensity: 'high'
  },
  battle: {
    type: 'battle',
    celebration: 'EPIC BATTLE!',
    description: 'Both teams gave everything - football wins!',
    emoji: '🤝⚔️',
    bgGradient: 'from-yellow-400/20 via-amber-400/20 to-orange-400/20',
    borderColor: 'border-yellow-300/50',
    textColor: 'text-yellow-800',
    intensity: 'medium'
  },
  goalfest: {
    type: 'goalfest',
    celebration: 'GOAL FEST!',
    description: 'Goals, goals, goals - pure entertainment!',
    emoji: '⚽🎉',
    bgGradient: 'from-pink-400/20 via-rose-400/20 to-red-400/20',
    borderColor: 'border-pink-300/50',
    textColor: 'text-pink-800',
    intensity: 'high'
  },
  fighting: {
    type: 'fighting',
    celebration: 'FIGHTING SPIRIT!',
    description: 'Heads held high - we are proud of this effort!',
    emoji: '💪❤️',
    bgGradient: 'from-purple-400/20 via-violet-400/20 to-purple-400/20',
    borderColor: 'border-purple-300/50',
    textColor: 'text-purple-800',
    intensity: 'medium'
  },
  clean: {
    type: 'clean',
    celebration: 'SOLID PERFORMANCE!',
    description: 'Professional football at its finest!',
    emoji: '🛡️⭐',
    bgGradient: 'from-slate-400/20 via-gray-400/20 to-slate-400/20',
    borderColor: 'border-slate-300/50',
    textColor: 'text-slate-800',
    intensity: 'low'
  }
};

// Celebration phrases for different scenarios
const CELEBRATION_PHRASES = {
  win: {
    dominant: [
      "Absolutely brilliant performance!",
      "Class act from start to finish!",
      "Pure footballing poetry!",
      "Masterclass in beautiful football!"
    ],
    thriller: [
      "Hearts were racing until the final whistle!",
      "Drama, excitement, and pure joy!",
      "The kind of match legends are made of!",
      "Absolutely nail-biting from start to finish!"
    ],
    comeback: [
      "Never give up - that's the RVR way!",
      "Down but never out - incredible spirit!",
      "This is what happens when heart meets talent!",
      "Belief and determination paid off!"
    ]
  },
  draw: [
    "Both teams earned this point!",
    "Football was the real winner today!",
    "A fair result after great efforts!",
    "Honor and respect to both sides!"
  ],
  loss: [
    "Every player gave their absolute all!",
    "Results don't tell the whole story!",
    "Head high, RVR - you played with heart!",
    "We're proud of this fighting performance!"
  ]
};

const OPPONENT_RECOGNITION = [
  "Fantastic effort from both teams!",
  "Great sporting behavior all around!",
  "Quality opposition - well played!",
  "Both teams showed real class today!",
  "Respect to our opponents - great match!",
  "The beautiful game at its best!"
];

/**
 * Analyzes a match and determines its personality
 */
export function analyzeMatchPersonality(
  match: Match, 
  teamScore: number, 
  opponentScore: number
): MatchPersonality {
  const goalDifference = Math.abs(teamScore - opponentScore);
  const totalGoals = teamScore + opponentScore;
  const isWin = teamScore > opponentScore;
  const isDraw = teamScore === opponentScore;
  const isLoss = teamScore < opponentScore;

  // Determine personality based on match characteristics
  if (totalGoals >= 6) {
    return PERSONALITIES.goalfest;
  }
  
  if (isDraw) {
    return PERSONALITIES.battle;
  }
  
  if (isWin) {
    if (goalDifference >= 3) {
      return PERSONALITIES.dominant;
    } else if (goalDifference === 1 && totalGoals >= 3) {
      return PERSONALITIES.thriller;
    } else if (goalDifference <= 2) {
      return PERSONALITIES.comeback;
    }
  }
  
  if (isLoss) {
    if (goalDifference >= 3) {
      return PERSONALITIES.fighting;
    } else {
      return PERSONALITIES.fighting;
    }
  }
  
  return PERSONALITIES.clean;
}

/**
 * Generates a complete match story with celebration elements
 */
export function generateMatchStory(
  match: Match,
  teamName: string,
  teamScore: number,
  opponentScore: number
): MatchStory {
  const personality = analyzeMatchPersonality(match, teamScore, opponentScore);
  const isWin = teamScore > opponentScore;
  const isDraw = teamScore === opponentScore;
  const isLoss = teamScore < opponentScore;

  // Generate headline
  let headline = `${personality.emoji} ${personality.celebration} ${personality.emoji}`;
  
  // Generate subtitle based on result
  let subtitle = '';
  if (isWin) {
    const phrases = CELEBRATION_PHRASES.win[personality.type as keyof typeof CELEBRATION_PHRASES.win] || 
                   CELEBRATION_PHRASES.win.dominant;
    subtitle = phrases[Math.floor(Math.random() * phrases.length)];
  } else if (isDraw) {
    subtitle = CELEBRATION_PHRASES.draw[Math.floor(Math.random() * CELEBRATION_PHRASES.draw.length)];
  } else {
    subtitle = CELEBRATION_PHRASES.loss[Math.floor(Math.random() * CELEBRATION_PHRASES.loss.length)];
  }

  // Generate opponent recognition
  const opponentRecognition = OPPONENT_RECOGNITION[Math.floor(Math.random() * OPPONENT_RECOGNITION.length)];

  // Generate social media text
  const socialText = `${teamName} ${isWin ? 'victory' : isDraw ? 'draws' : 'battles'} ${teamScore}-${opponentScore} vs ${match.opponent}! ${subtitle} #RVRfc #Football`;

  // Generate key moments (placeholder for now)
  const keyMoments = [
    `${teamScore > 0 ? '⚽ Goals from our talented squad!' : '🛡️ Solid defensive work!'}`,
    `🏃‍♂️ Great effort from every player on the pitch!`,
    `👏 Fantastic team spirit throughout the match!`
  ];

  return {
    personality,
    headline,
    subtitle,
    opponentRecognition,
    socialText,
    keyMoments
  };
}

/**
 * Gets celebration colors for a result
 */
export function getCelebrationColors(result: 'W' | 'L' | 'D') {
  switch (result) {
    case 'W':
      return {
        bg: 'bg-gradient-to-br from-green-100/90 to-emerald-100/90',
        border: 'border-green-200',
        text: 'text-green-800',
        accent: 'text-green-600'
      };
    case 'L':
      return {
        bg: 'bg-gradient-to-br from-purple-100/90 to-violet-100/90',
        border: 'border-purple-200',
        text: 'text-purple-800',
        accent: 'text-purple-600'
      };
    case 'D':
      return {
        bg: 'bg-gradient-to-br from-yellow-100/90 to-amber-100/90',
        border: 'border-yellow-200',
        text: 'text-yellow-800',
        accent: 'text-yellow-600'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-gray-100/90 to-slate-100/90',
        border: 'border-gray-200',
        text: 'text-gray-800',
        accent: 'text-gray-600'
      };
  }
}

/**
 * Generates match emoji based on result and context
 */
export function getMatchEmojis(result: 'W' | 'L' | 'D', goalDifference: number) {
  if (result === 'W') {
    if (goalDifference >= 3) return '🏆⚡';
    if (goalDifference === 2) return '🌟⚽';
    return '🔥💪';
  } else if (result === 'D') {
    return '🤝⚔️';
  } else {
    return '💪❤️';
  }
}