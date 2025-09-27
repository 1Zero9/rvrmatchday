/**
 * Cards API - Match Card Management
 * Handles CRUD operations for yellow and red cards
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { cardManager } from '../../../lib/card-manager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGet(req, res);
        break;
      case 'POST':
        await handlePost(req, res);
        break;
      case 'DELETE':
        await handleDelete(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Cards API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { match_id, pending_submissions } = req.query;

  if (pending_submissions === 'true') {
    // Get cards requiring authority submission
    const pendingCards = await cardManager.getPendingSubmissions();
    return res.status(200).json({ cards: pendingCards });
  }

  if (match_id) {
    // Get cards for specific match
    const cards = await cardManager.getMatchCards(match_id as string);
    const summary = await cardManager.getMatchCardSummary(match_id as string);
    return res.status(200).json({ cards, summary });
  }

  res.status(400).json({ error: 'match_id parameter required' });
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const {
    match_id,
    minute,
    player_id,
    player_name,
    team_side,
    card,
    reason,
    is_straight_red,
    action
  } = req.body;

  if (action === 'submit_to_authority') {
    // Mark card as submitted to authority
    const { card_id, ban_games } = req.body;
    const success = await cardManager.markSubmittedToAuthority(card_id, ban_games);
    
    if (success) {
      return res.status(200).json({ message: 'Card marked as submitted to authority' });
    } else {
      return res.status(500).json({ error: 'Failed to update card submission status' });
    }
  }

  // Validate required fields
  if (!match_id || !minute || !player_name || !team_side || !card) {
    return res.status(400).json({ 
      error: 'Missing required fields: match_id, minute, player_name, team_side, card' 
    });
  }

  // Validate enum values
  if (!['ours', 'theirs'].includes(team_side)) {
    return res.status(400).json({ error: 'team_side must be "ours" or "theirs"' });
  }

  if (!['yellow', 'red'].includes(card)) {
    return res.status(400).json({ error: 'card must be "yellow" or "red"' });
  }

  if (minute < 1 || minute > 120) {
    return res.status(400).json({ error: 'minute must be between 1 and 120' });
  }

  // Add the card
  const cardData = {
    match_id,
    minute: parseInt(minute),
    player_id: player_id || undefined,
    team_side,
    card,
    reason: reason || '',
    is_straight_red: card === 'red' ? Boolean(is_straight_red) : false
  };

  const newCard = await cardManager.addCard(cardData);

  if (newCard) {
    // Return updated cards and summary
    const cards = await cardManager.getMatchCards(match_id);
    const summary = await cardManager.getMatchCardSummary(match_id);
    
    res.status(201).json({ 
      message: 'Card added successfully', 
      card: newCard,
      cards,
      summary
    });
  } else {
    res.status(500).json({ error: 'Failed to add card' });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { card_id } = req.body;

  if (!card_id) {
    return res.status(400).json({ error: 'card_id is required' });
  }

  const success = await cardManager.removeCard(card_id);

  if (success) {
    res.status(200).json({ message: 'Card removed successfully' });
  } else {
    res.status(500).json({ error: 'Failed to remove card' });
  }
}