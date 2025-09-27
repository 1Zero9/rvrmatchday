/**
 * Card Management System for Match Recorder
 * Handles yellow cards, red cards, automatic red logic, and authority submission
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import { supabase } from './supabase';

export interface Card {
  id: string;
  match_id: string;
  minute: number;
  player_id?: string;
  player_name?: string;
  team_side: 'ours' | 'theirs';
  card: 'yellow' | 'red';
  reason?: string;
  is_automatic_red?: boolean; // Two yellows = automatic red
  is_straight_red?: boolean;
  submitted_to_authority?: boolean;
  submission_date?: string;
  ban_games?: number;
  created_at?: string;
}

export interface CardSummary {
  yellowCards: Card[];
  redCards: Card[];
  playersWithTwoYellows: string[];
  automaticReds: Card[];
  straightReds: Card[];
  pendingSubmissions: Card[];
}

export class CardManager {
  
  /**
   * Add a card to the match
   */
  async addCard(card: Omit<Card, 'id' | 'created_at'>): Promise<Card | null> {
    try {
      // Check if this would be a second yellow for the player
      if (card.card === 'yellow' && card.player_id) {
        const existingYellows = await this.getPlayerYellowCards(card.match_id, card.player_id);
        
        if (existingYellows.length >= 1) {
          // This would be a second yellow - convert to automatic red
          const redCard: Omit<Card, 'id' | 'created_at'> = {
            ...card,
            card: 'red',
            is_automatic_red: true,
            is_straight_red: false,
            reason: `Second yellow card (${card.reason || 'Automatic red'})`
          };
          
          return await this.addRedCard(redCard);
        }
      }

      const { data, error } = await supabase
        .from('cards')
        .insert([{
          match_id: card.match_id,
          minute: card.minute,
          player_id: card.player_id,
          player_name: card.player_name,
          team_side: card.team_side,
          card: card.card,
          reason: card.reason,
          is_automatic_red: card.is_automatic_red || false,
          is_straight_red: card.is_straight_red || false,
          submitted_to_authority: false
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding card to database:', error);
        console.error('Card data attempted:', {
          match_id: card.match_id,
          minute: card.minute,
          player_id: card.player_id,
          team_side: card.team_side,
          card: card.card,
          reason: card.reason
        });
        
        // Check for specific error types
        if (error.message?.includes('relation "cards" does not exist') || error.code === '42P01') {
          console.error('🚨 CARDS TABLE MISSING: Please create the cards table in your Supabase database:');
          console.error(`
CREATE TABLE public.cards (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  match_id uuid NULL,
  minute integer NULL,
  player_id uuid NULL,
  player_name text NULL,
  team_side text NOT NULL,
  card text NOT NULL,
  reason text NULL,
  is_automatic_red boolean DEFAULT false,
  is_straight_red boolean DEFAULT false,
  submitted_to_authority boolean DEFAULT false,
  submission_date timestamp NULL,
  ban_games integer NULL,
  created_at timestamp DEFAULT NOW(),
  CONSTRAINT cards_pkey PRIMARY KEY (id),
  CONSTRAINT cards_card_check CHECK ((card = ANY (ARRAY['yellow'::text, 'red'::text]))),
  CONSTRAINT cards_team_side_check CHECK ((team_side = ANY (ARRAY['ours'::text, 'theirs'::text])))
);
          `);
        }
        
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in addCard:', error);
      return null;
    }
  }

  /**
   * Add a red card with special handling
   */
  private async addRedCard(card: Omit<Card, 'id' | 'created_at'>): Promise<Card | null> {
    const redCardData = {
      ...card,
      card: 'red' as const,
      submitted_to_authority: false,
      ban_games: card.is_straight_red ? this.calculateBanGames(card.reason) : 1
    };

    const { data, error } = await supabase
      .from('cards')
      .insert([redCardData])
      .select()
      .single();

    if (error) {
      console.error('Error adding red card:', error);
      return null;
    }

    return data;
  }

  /**
   * Get all cards for a match
   */
  async getMatchCards(matchId: string): Promise<Card[]> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('match_id', matchId)
        .order('minute');

      if (error) {
        console.error('Error fetching match cards:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMatchCards:', error);
      return [];
    }
  }

  /**
   * Get yellow cards for a specific player in a match
   */
  async getPlayerYellowCards(matchId: string, playerId: string): Promise<Card[]> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('match_id', matchId)
        .eq('player_id', playerId)
        .eq('card', 'yellow')
        .order('minute');

      if (error) {
        console.error('Error fetching player yellow cards:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPlayerYellowCards:', error);
      return [];
    }
  }

  /**
   * Get comprehensive card summary for a match
   */
  async getMatchCardSummary(matchId: string): Promise<CardSummary> {
    const cards = await this.getMatchCards(matchId);
    
    const yellowCards = cards.filter(card => card.card === 'yellow');
    const redCards = cards.filter(card => card.card === 'red');
    const automaticReds = redCards.filter(card => card.is_automatic_red);
    const straightReds = redCards.filter(card => card.is_straight_red);
    const pendingSubmissions = redCards.filter(card => !card.submitted_to_authority);

    // Find players with two yellows (who should have automatic reds)
    const yellowsByPlayer = yellowCards.reduce((acc, card) => {
      if (card.player_id) {
        acc[card.player_id] = (acc[card.player_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const playersWithTwoYellows = Object.keys(yellowsByPlayer).filter(
      playerId => yellowsByPlayer[playerId] >= 2
    );

    return {
      yellowCards,
      redCards,
      playersWithTwoYellows,
      automaticReds,
      straightReds,
      pendingSubmissions
    };
  }

  /**
   * Remove a card
   */
  async removeCard(cardId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        console.error('Error removing card:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in removeCard:', error);
      return false;
    }
  }

  /**
   * Mark red card as submitted to football authority
   */
  async markSubmittedToAuthority(cardId: string, banGames?: number): Promise<boolean> {
    try {
      const updateData: any = {
        submitted_to_authority: true,
        submission_date: new Date().toISOString()
      };

      if (banGames !== undefined) {
        updateData.ban_games = banGames;
      }

      const { error } = await supabase
        .from('cards')
        .update(updateData)
        .eq('id', cardId);

      if (error) {
        console.error('Error marking card as submitted:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markSubmittedToAuthority:', error);
      return false;
    }
  }

  /**
   * Calculate suggested ban games for straight red cards
   */
  private calculateBanGames(reason?: string): number {
    if (!reason) return 1;
    
    const lowerReason = reason.toLowerCase();
    
    // Serious offenses get longer bans
    if (lowerReason.includes('violent conduct') || 
        lowerReason.includes('serious foul play') ||
        lowerReason.includes('assault')) {
      return 3;
    }
    
    if (lowerReason.includes('abusive language') ||
        lowerReason.includes('referee abuse') ||
        lowerReason.includes('dissent')) {
      return 2;
    }
    
    // Default red card ban
    return 1;
  }

  /**
   * Get cards requiring authority submission
   */
  async getPendingSubmissions(): Promise<Card[]> {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select(`
          *,
          matches!inner(
            opponent,
            scheduled_date,
            match_type
          )
        `)
        .eq('card', 'red')
        .eq('submitted_to_authority', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching pending submissions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPendingSubmissions:', error);
      return [];
    }
  }

  /**
   * Export cards for authority submission
   */
  exportForAuthority(cards: Card[]): string {
    const submissions = cards.map(card => {
      return [
        `Match: ${(card as any).matches?.opponent || 'Unknown'} (${(card as any).matches?.scheduled_date || 'No date'})`,
        `Player: ${card.player_name || 'Unknown'}`,
        `Card: ${card.card.toUpperCase()}`,
        `Minute: ${card.minute}'`,
        `Reason: ${card.reason || 'No reason specified'}`,
        `Type: ${card.is_straight_red ? 'Straight Red' : card.is_automatic_red ? 'Second Yellow (Automatic Red)' : 'Yellow Card'}`,
        `Suggested Ban: ${card.ban_games || 1} game(s)`,
        '---'
      ].join('\n');
    }).join('\n\n');

    return `CARD SUBMISSION REPORT\nGenerated: ${new Date().toLocaleString()}\n\n${submissions}`;
  }
}

export const cardManager = new CardManager();