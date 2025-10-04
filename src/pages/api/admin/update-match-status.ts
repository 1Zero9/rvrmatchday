/**
 * API endpoint to update match status with cancellation/postponement
 * Works with existing database structure
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { matchId, status, cancellationReason, postponedToDate } = req.body;

  if (!matchId || !status) {
    return res.status(400).json({ error: 'Match ID and status are required' });
  }

  try {
    console.log('🔧 Updating match status:', { matchId, status, cancellationReason, postponedToDate });

    // First, check if the match exists
    const { data: existingMatch, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (fetchError || !existingMatch) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Prepare update data - only include fields that exist in the database
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    // Store cancellation reason in notes field for now (since cancellation_reason column doesn't exist)
    if (cancellationReason && (status === 'Cancelled' || status === 'Postponed')) {
      const existingNotes = existingMatch.notes || '';
      const reasonNote = `\n\n[${status.toUpperCase()}] ${cancellationReason}`;
      updateData.notes = existingNotes + reasonNote;
    }

    // For postponed matches, store the new date in notes as well
    if (postponedToDate && status === 'Postponed') {
      const postponedNote = `\n[NEW DATE] ${new Date(postponedToDate).toLocaleString()}`;
      updateData.notes = (updateData.notes || existingMatch.notes || '') + postponedNote;
    }

    // Update the match
    const { data: updatedMatch, error: updateError } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', matchId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating match:', updateError);
      return res.status(500).json({ error: updateError.message });
    }

    console.log('✅ Match updated successfully');

    res.status(200).json({ 
      success: true, 
      match: updatedMatch,
      message: `Match status updated to ${status}`,
      note: 'Cancellation details stored in notes field until database schema is updated'
    });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: error.message });
  }
}