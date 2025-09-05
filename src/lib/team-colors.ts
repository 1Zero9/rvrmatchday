/**
 * Team Color Utility Functions
 * Determines appropriate colors for different teams and opponents
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

export interface TeamColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  border: string;
  gradient: string;
  lightBackground: string;
}

export type TeamType = 'rvr-main' | 'rvr-girls' | 'opponent';

/**
 * Determines team type based on team name
 */
export function getTeamType(teamName: string): TeamType {
  const name = teamName.toLowerCase();
  
  // Check for RVR Girls teams
  if (name.includes('rvr') && (name.includes('girls') || name.includes('ladies') || name.includes('women'))) {
    return 'rvr-girls';
  }
  
  // Check for main RVR teams
  if (name.includes('rvr') || name.includes('river valley rangers')) {
    return 'rvr-main';
  }
  
  // Everything else is an opponent
  return 'opponent';
}

/**
 * Gets the appropriate color scheme for a team
 */
export function getTeamColorScheme(teamName: string): TeamColorScheme {
  const teamType = getTeamType(teamName);
  
  switch (teamType) {
    case 'rvr-main':
      return {
        primary: 'var(--team-rvr-primary)',
        secondary: 'var(--team-rvr-secondary)',
        accent: 'var(--team-rvr-accent)',
        text: 'var(--team-rvr-text)',
        background: 'var(--team-rvr-bg)',
        border: 'var(--team-rvr-border)',
        gradient: 'var(--gradient-team-rvr)',
        lightBackground: 'bg-team-rvr-light'
      };
      
    case 'rvr-girls':
      return {
        primary: 'var(--team-rvr-girls-primary)',
        secondary: 'var(--team-rvr-girls-secondary)',
        accent: 'var(--team-rvr-girls-accent)',
        text: 'var(--team-rvr-girls-text)',
        background: 'var(--team-rvr-girls-bg)',
        border: 'var(--team-rvr-girls-border)',
        gradient: 'var(--gradient-team-rvr-girls)',
        lightBackground: 'bg-team-rvr-girls-light'
      };
      
    case 'opponent':
    default:
      return {
        primary: 'var(--team-opponent-primary)',
        secondary: 'var(--team-opponent-secondary)',
        accent: 'var(--team-opponent-accent)',
        text: 'var(--team-opponent-text)',
        background: 'var(--team-opponent-bg)',
        border: 'var(--team-opponent-border)',
        gradient: 'var(--gradient-team-opponent)',
        lightBackground: 'bg-team-opponent-light'
      };
  }
}

/**
 * Gets CSS classes for team colors
 */
export function getTeamColorClasses(teamName: string): {
  background: string;
  text: string;
  border: string;
  gradient: string;
  lightBackground: string;
} {
  const teamType = getTeamType(teamName);
  
  switch (teamType) {
    case 'rvr-main':
      return {
        background: 'bg-team-rvr',
        text: 'text-team-rvr',
        border: 'border-team-rvr',
        gradient: 'gradient-team-rvr',
        lightBackground: 'bg-team-rvr-light'
      };
      
    case 'rvr-girls':
      return {
        background: 'bg-team-rvr-girls',
        text: 'text-team-rvr-girls',
        border: 'border-team-rvr-girls',
        gradient: 'gradient-team-rvr-girls',
        lightBackground: 'bg-team-rvr-girls-light'
      };
      
    case 'opponent':
    default:
      return {
        background: 'bg-team-opponent',
        text: 'text-team-opponent',
        border: 'border-team-opponent',
        gradient: 'gradient-team-opponent',
        lightBackground: 'bg-team-opponent-light'
      };
  }
}

/**
 * Gets appropriate team indicator dot color
 */
export function getTeamIndicatorColor(teamName: string, isHome: boolean): string {
  const teamType = getTeamType(teamName);
  
  if (teamType === 'rvr-main') {
    return isHome ? 'bg-team-rvr' : 'bg-green-500';
  } else if (teamType === 'rvr-girls') {
    return isHome ? 'bg-team-rvr-girls' : 'bg-green-500';
  } else {
    return isHome ? 'bg-blue-500' : 'bg-team-opponent';
  }
}