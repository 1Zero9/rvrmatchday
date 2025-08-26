/**
 * Todo Sync API Endpoint
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * API endpoint for syncing Claude todos with admin dashboard
 */

import type { NextApiRequest, NextApiResponse } from 'next';

interface ClaudeTodo {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface TodoSyncRequest {
  claudeTodos: ClaudeTodo[];
  sessionId?: string;
}

interface TodoSyncResponse {
  success: boolean;
  message: string;
  syncedCount: number;
  sessionReview?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<TodoSyncResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      syncedCount: 0
    });
  }

  try {
    const { claudeTodos, sessionId }: TodoSyncRequest = req.body;

    if (!claudeTodos || !Array.isArray(claudeTodos)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todos data',
        syncedCount: 0
      });
    }

    // For now, we'll return the session review prompt
    // In a real implementation, this would sync with a database
    const sessionReview = generateSessionReview(claudeTodos);

    return res.status(200).json({
      success: true,
      message: `Successfully processed ${claudeTodos.length} todos`,
      syncedCount: claudeTodos.length,
      sessionReview
    });

  } catch (error) {
    console.error('Todo sync error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      syncedCount: 0
    });
  }
}

function generateSessionReview(claudeTodos: ClaudeTodo[]): string {
  const pendingTodos = claudeTodos.filter(t => t.status === 'pending');
  const inProgressTodos = claudeTodos.filter(t => t.status === 'in_progress');
  const completedTodos = claudeTodos.filter(t => t.status === 'completed');
  
  let review = '📋 **SESSION TODO REVIEW**\n\n';
  
  if (inProgressTodos.length > 0) {
    review += `🔄 **In Progress (${inProgressTodos.length}):**\n`;
    inProgressTodos.forEach(todo => {
      review += `• ${todo.content}\n`;
    });
    review += '\n';
  }
  
  if (pendingTodos.length > 0) {
    review += `⏳ **Pending (${pendingTodos.length}):**\n`;
    pendingTodos.slice(0, 5).forEach(todo => {
      review += `• ${todo.content}\n`;
    });
    if (pendingTodos.length > 5) {
      review += `• ... and ${pendingTodos.length - 5} more\n`;
    }
    review += '\n';
  }

  if (completedTodos.length > 0) {
    review += `✅ **Recently Completed (${completedTodos.length}):**\n`;
    completedTodos.slice(0, 3).forEach(todo => {
      review += `• ${todo.content}\n`;
    });
    review += '\n';
  }

  review += '💡 **Admin Dashboard:** http://localhost:3000/admin (admin/rvrfc2025)\n';
  review += '🎯 **Ready to work on tasks or add new ones!**';
  
  return review;
}