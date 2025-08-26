/**
 * Project Metrics API
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * API endpoint for retrieving project and task metrics.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getTaskManager } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const taskManager = await getTaskManager();
    const metrics = await taskManager.getProjectMetrics();
    
    // Add additional computed metrics
    const enhancedMetrics = {
      ...metrics,
      completionRate: metrics.totalTasks > 0 ? 
        Math.round((metrics.completedTasks / metrics.totalTasks) * 100) : 0,
      activeTasks: metrics.pendingTasks + metrics.inProgressTasks,
      weeklyGrowth: metrics.tasksThisWeek,
      monthlyGrowth: metrics.tasksThisMonth,
      avgCompletionDays: Math.round(metrics.avgCompletionTime / 24 * 10) / 10,
      timestamp: new Date().toISOString()
    };

    res.json(enhancedMetrics);
  } catch (error: any) {
    console.error('Metrics API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}