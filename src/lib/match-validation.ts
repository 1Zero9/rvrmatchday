/**
 * Match Recording Data Validation and Security
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Comprehensive validation and security utilities for match recording data.
 */

import { Match, MatchEvent, EventType, MatchStats, Team, Player } from '../types/match-tracker';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SecurityContext {
  userId: string;
  userRole: 'admin' | 'coach' | 'manager';
  authorizedTeams: string[];
  sessionToken?: string;
}

/**
 * Validates match data integrity and business rules
 */
export class MatchValidator {
  
  static validateMatch(match: Partial<Match>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!match.teamId) {
      errors.push('Team ID is required');
    }
    if (!match.opponent) {
      errors.push('Opponent name is required');
    }
    if (!match.matchType) {
      errors.push('Match type is required');
    }
    if (!match.venue) {
      errors.push('Venue is required');
    }
    if (!match.scheduledDate) {
      errors.push('Scheduled date is required');
    }

    // Business rule validations
    if (match.scheduledDate && new Date(match.scheduledDate) < new Date()) {
      warnings.push('Match is scheduled in the past');
    }

    if (match.homeScore !== undefined && match.awayScore !== undefined) {
      if (match.homeScore < 0 || match.awayScore < 0) {
        errors.push('Scores cannot be negative');
      }
      if (match.homeScore > 50 || match.awayScore > 50) {
        warnings.push('Unusually high score detected');
      }
    }

    // Venue validation
    if (match.venue && match.venue.length > 100) {
      errors.push('Venue name too long (max 100 characters)');
    }

    // Opponent validation
    if (match.opponent && match.opponent.length > 50) {
      errors.push('Opponent name too long (max 50 characters)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateMatchEvent(event: Partial<MatchEvent>, match?: Match): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!event.matchId) {
      errors.push('Match ID is required for event');
    }
    if (!event.eventType) {
      errors.push('Event type is required');
    }
    if (event.minute === undefined || event.minute === null) {
      errors.push('Event minute is required');
    }
    if (!event.half) {
      errors.push('Event half is required');
    }

    // Business rules
    if (event.minute !== undefined) {
      if (event.minute < 0) {
        errors.push('Event minute cannot be negative');
      }
      if (event.minute > 120) {
        errors.push('Event minute cannot exceed 120 minutes');
      }
      if (event.half === 1 && event.minute > 60) {
        warnings.push('First half event after 60 minutes');
      }
      if (event.half === 2 && event.minute < 45) {
        warnings.push('Second half event before 45 minutes');
      }
    }

    // Event type specific validation
    if (event.eventType === 'Goal' || event.eventType === 'YellowCard' || event.eventType === 'RedCard') {
      if (!event.playerId && !event.playerName) {
        warnings.push(`${event.eventType} event should have a player assigned`);
      }
    }

    // Duplicate event check (if match provided)
    if (match && event.playerId && event.eventType === 'RedCard') {
      // Could check for duplicate red cards for same player
      warnings.push('Verify player is not already sent off');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static validateMatchStats(stats: Partial<MatchStats>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!stats.matchId) {
      errors.push('Match ID is required for stats');
    }

    // Possession validation
    if (stats.possession !== undefined) {
      if (stats.possession < 0 || stats.possession > 100) {
        errors.push('Possession must be between 0 and 100');
      }
    }

    // Shots validation
    if (stats.shotsOnTarget !== undefined && stats.shotsOnTarget < 0) {
      errors.push('Shots on target cannot be negative');
    }
    if (stats.shotsOffTarget !== undefined && stats.shotsOffTarget < 0) {
      errors.push('Shots off target cannot be negative');
    }

    // Logical validation
    if (stats.shotsOnTarget !== undefined && stats.shotsOnTarget > 50) {
      warnings.push('Unusually high shots on target count');
    }

    if (stats.corners !== undefined && stats.corners > 20) {
      warnings.push('Unusually high corner count');
    }

    if (stats.fouls !== undefined && stats.fouls > 30) {
      warnings.push('Unusually high foul count');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Security utilities for match recording
 */
export class MatchSecurity {
  
  static canAccessMatch(match: Match, context: SecurityContext): boolean {
    // Admin can access all matches
    if (context.userRole === 'admin') {
      return true;
    }

    // Check team authorization
    if (context.authorizedTeams.includes('*')) {
      return true;
    }

    return context.authorizedTeams.includes(match.teamId);
  }

  static canRecordEvents(match: Match, context: SecurityContext): boolean {
    // Must have match access first
    if (!this.canAccessMatch(match, context)) {
      return false;
    }

    // Only coaches and admins can record events
    return context.userRole === 'coach' || context.userRole === 'admin';
  }

  static canEditMatch(match: Match, context: SecurityContext): boolean {
    // Must have match access first
    if (!this.canAccessMatch(match, context)) {
      return false;
    }

    // Only coaches and admins can edit matches
    return context.userRole === 'coach' || context.userRole === 'admin';
  }

  static sanitizeEventData(event: MatchEvent): MatchEvent {
    return {
      ...event,
      // Remove any potential XSS vulnerabilities
      playerName: event.playerName ? this.sanitizeString(event.playerName) : event.playerName,
      // Ensure numeric values are actually numbers
      minute: Number(event.minute),
      half: Number(event.half) as 1 | 2
    };
  }

  static sanitizeMatchData(match: Match): Match {
    return {
      ...match,
      opponent: this.sanitizeString(match.opponent),
      venue: this.sanitizeString(match.venue),
      referee: match.referee ? this.sanitizeString(match.referee) : match.referee,
      weather: match.weather ? this.sanitizeString(match.weather) : match.weather,
      // Ensure numeric values
      homeScore: match.homeScore !== undefined ? Number(match.homeScore) : match.homeScore,
      awayScore: match.awayScore !== undefined ? Number(match.awayScore) : match.awayScore,
      temperature: match.temperature !== undefined ? Number(match.temperature) : match.temperature
    };
  }

  private static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .trim()
      .substring(0, 200); // Limit length
  }

  static generateSecureEventId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  static generateSecureMatchId(): string {
    return `match-${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  static logSecurityEvent(action: string, context: SecurityContext, details?: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId: context.userId,
      userRole: context.userRole,
      details: details || {},
      sessionToken: context.sessionToken ? context.sessionToken.substring(0, 8) + '...' : undefined
    };

    console.info('MATCH_SECURITY:', JSON.stringify(logEntry));
    
    // In production, this would send to a logging service
    // Example: await securityLogger.log(logEntry);
  }
}

/**
 * Real-time validation middleware
 */
export class RealtimeValidator {
  private static eventQueue: MatchEvent[] = [];
  private static processingQueue = false;

  static async queueEventValidation(event: MatchEvent, match: Match, context: SecurityContext): Promise<ValidationResult> {
    // Security check
    if (!MatchSecurity.canRecordEvents(match, context)) {
      return {
        isValid: false,
        errors: ['Insufficient permissions to record events'],
        warnings: []
      };
    }

    // Sanitize data
    const sanitizedEvent = MatchSecurity.sanitizeEventData(event);
    
    // Validate event
    const validation = MatchValidator.validateMatchEvent(sanitizedEvent, match);
    
    if (validation.isValid) {
      this.eventQueue.push(sanitizedEvent);
      this.processEventQueue();
    }

    // Log security event
    MatchSecurity.logSecurityEvent('EVENT_RECORD', context, {
      eventType: event.eventType,
      matchId: match.id,
      valid: validation.isValid
    });

    return validation;
  }

  private static async processEventQueue(): Promise<void> {
    if (this.processingQueue || this.eventQueue.length === 0) {
      return;
    }

    this.processingQueue = true;

    try {
      // Process events in batches
      const batch = this.eventQueue.splice(0, 10);
      
      // In a real implementation, this would sync to database
      // await database.saveEvents(batch);
      
      console.log(`Processed ${batch.length} events`);
      
    } catch (error) {
      console.error('Error processing event queue:', error);
      // Re-queue failed events
      this.eventQueue.unshift(...this.eventQueue.splice(-10));
    } finally {
      this.processingQueue = false;
      
      // Continue processing if more events queued
      if (this.eventQueue.length > 0) {
        setTimeout(() => this.processEventQueue(), 1000);
      }
    }
  }
}