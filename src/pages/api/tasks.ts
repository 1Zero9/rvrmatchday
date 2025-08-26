/**
 * Task Management API
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * REST API for task management with database integration.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { getTaskManager, TaskRecord } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const taskManager = await getTaskManager();

    switch (req.method) {
      case 'GET':
        await handleGet(req, res, taskManager);
        break;
      case 'POST':
        await handlePost(req, res, taskManager);
        break;
      case 'PUT':
        await handlePut(req, res, taskManager);
        break;
      case 'DELETE':
        await handleDelete(req, res, taskManager);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, taskManager: any) {
  const { id, status, assignedTo, category, priority, limit, offset } = req.query;

  if (id) {
    // Get single task
    const task = await taskManager.getTask(parseInt(id as string));
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json(task);
  }

  // Get filtered tasks
  const filters = {
    status: status as TaskRecord['status'],
    assignedTo: assignedTo as string,
    category: category as TaskRecord['category'],
    priority: priority as TaskRecord['priority'],
    limit: limit ? parseInt(limit as string) : undefined,
    offset: offset ? parseInt(offset as string) : undefined,
  };

  // Remove undefined values
  Object.keys(filters).forEach(key => {
    if (filters[key as keyof typeof filters] === undefined) {
      delete filters[key as keyof typeof filters];
    }
  });

  const tasks = await taskManager.getTasks(filters);
  res.json(tasks);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse, taskManager: any) {
  const {
    title,
    description,
    priority = 'medium',
    category = 'development',
    status = 'pending',
    assignedTo,
    createdBy = 'system',
    dueDate,
    estimatedHours,
    tags = []
  } = req.body;

  // Validation
  if (!title || !description || !assignedTo) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['title', 'description', 'assignedTo']
    });
  }

  const task = {
    title,
    description,
    priority,
    category,
    status,
    assignedTo,
    createdBy,
    createdDate: new Date().toISOString(),
    dueDate,
    estimatedHours,
    tags: Array.isArray(tags) ? tags : []
  };

  const taskId = await taskManager.createTask(task);
  const createdTask = await taskManager.getTask(taskId);

  res.status(201).json(createdTask);
}

async function handlePut(req: NextApiRequest, res: NextApiResponse, taskManager: any) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Task ID required' });
  }

  const { status, assignedTo, actualHours, updatedBy = 'system' } = req.body;

  if (status) {
    await taskManager.updateTaskStatus(
      parseInt(id as string),
      status,
      updatedBy,
      actualHours
    );
  }

  if (assignedTo) {
    await taskManager.assignTask(
      parseInt(id as string),
      assignedTo,
      updatedBy
    );
  }

  const updatedTask = await taskManager.getTask(parseInt(id as string));
  res.json(updatedTask);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, taskManager: any) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: 'Task ID required' });
  }

  // For now, we'll just mark as cancelled instead of deleting
  await taskManager.updateTaskStatus(
    parseInt(id as string),
    'cancelled',
    'system'
  );

  res.json({ message: 'Task cancelled successfully' });
}