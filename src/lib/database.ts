/**
 * Database Integration for Task Management
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Supabase database integration for task logging and management.
 * Provides real-time updates and scalable cloud database.
 */

import { supabase } from './supabase';

export interface TaskRecord {
  id?: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'content' | 'design' | 'development' | 'maintenance' | 'marketing';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string;
  createdBy: string;
  createdDate: string;
  completedDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  changes?: ChangeRecord[];
  created_at?: string;
  updated_at?: string;
}

export interface ChangeRecord {
  id?: number;
  taskId: number;
  timestamp: string;
  changedBy: string;
  changeType: 'created' | 'updated' | 'status_change' | 'assignment' | 'comment';
  oldValue?: string;
  newValue?: string;
  comment?: string;
  created_at?: string;
}

export interface ProjectMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  tasksThisWeek: number;
  tasksThisMonth: number;
  avgCompletionTime: number;
  productivityScore: number;
}

// Supabase table creation SQL (run these in your Supabase SQL editor)
export const SETUP_SQL = `
-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  category TEXT CHECK (category IN ('content', 'design', 'development', 'maintenance', 'marketing')) DEFAULT 'development',
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  "assignedTo" TEXT NOT NULL,
  "createdBy" TEXT NOT NULL,
  "createdDate" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "completedDate" TIMESTAMPTZ,
  "dueDate" TIMESTAMPTZ,
  "estimatedHours" REAL,
  "actualHours" REAL,
  tags JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create task_changes table
CREATE TABLE IF NOT EXISTS task_changes (
  id BIGSERIAL PRIMARY KEY,
  "taskId" BIGINT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "changedBy" TEXT NOT NULL,
  "changeType" TEXT CHECK ("changeType" IN ('created', 'updated', 'status_change', 'assignment', 'comment')) NOT NULL,
  "oldValue" TEXT,
  "newValue" TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indices
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignedTo ON tasks("assignedTo");
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_createdDate ON tasks("createdDate");
CREATE INDEX IF NOT EXISTS idx_changes_taskId ON task_changes("taskId");
CREATE INDEX IF NOT EXISTS idx_changes_timestamp ON task_changes(timestamp);

-- Enable RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_changes ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed for your auth setup)
CREATE POLICY "Enable read access for all users" ON tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON tasks FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON task_changes FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON task_changes FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

export async function initializeDatabase(): Promise<boolean> {
  // In Supabase, tables should be created via the dashboard or SQL editor
  // This function just validates the connection
  const { data, error } = await supabase
    .from('tasks')
    .select('count', { count: 'exact', head: true });
    
  if (error && error.code === 'PGRST116') {
    console.warn('Tasks table not found. Please run the SETUP_SQL in your Supabase SQL editor.');
    return false;
  }
  
  return true;
}

export class TaskManager {
  async createTask(task: Omit<TaskRecord, 'id' | 'changes' | 'created_at' | 'updated_at'>): Promise<number> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title: task.title,
        description: task.description,
        priority: task.priority,
        category: task.category,
        status: task.status,
        assignedTo: task.assignedTo,
        createdBy: task.createdBy,
        createdDate: task.createdDate,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
        tags: task.tags
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    const taskId = data.id;

    // Log creation
    await this.logChange(taskId, task.createdBy, 'created', null, task.status, 'Task created');

    return taskId;
  }

  async updateTaskStatus(
    taskId: number, 
    newStatus: TaskRecord['status'], 
    updatedBy: string,
    actualHours?: number
  ): Promise<void> {
    const currentTask = await this.getTask(taskId);
    if (!currentTask) {
      throw new Error(`Task ${taskId} not found`);
    }

    const updates: any = { status: newStatus };
    
    if (newStatus === 'completed') {
      updates.completedDate = new Date().toISOString();
      if (actualHours) {
        updates.actualHours = actualHours;
      }
    }

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    // Log status change
    await this.logChange(taskId, updatedBy, 'status_change', currentTask.status, newStatus);
  }

  async assignTask(taskId: number, assignedTo: string, updatedBy: string): Promise<void> {
    const currentTask = await this.getTask(taskId);
    if (!currentTask) {
      throw new Error(`Task ${taskId} not found`);
    }

    const { error } = await supabase
      .from('tasks')
      .update({ assignedTo })
      .eq('id', taskId);

    if (error) {
      throw new Error(`Failed to assign task: ${error.message}`);
    }
    
    // Log assignment change
    await this.logChange(taskId, updatedBy, 'assignment', currentTask.assignedTo, assignedTo);
  }

  async getTask(taskId: number): Promise<TaskRecord | null> {
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw new Error(`Failed to get task: ${error.message}`);
    }

    const { data: changes } = await supabase
      .from('task_changes')
      .select('*')
      .eq('taskId', taskId)
      .order('timestamp', { ascending: false });

    return {
      ...task,
      changes: changes || []
    } as TaskRecord;
  }

  async getTasks(filters?: {
    status?: TaskRecord['status'];
    assignedTo?: string;
    category?: TaskRecord['category'];
    priority?: TaskRecord['priority'];
    limit?: number;
    offset?: number;
  }): Promise<TaskRecord[]> {
    let query = supabase
      .from('tasks')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.assignedTo) {
      query = query.eq('assignedTo', filters.assignedTo);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }

    query = query.order('createdDate', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 100)) - 1);
    }

    const { data: tasks, error } = await query;

    if (error) {
      throw new Error(`Failed to get tasks: ${error.message}`);
    }
    
    return (tasks || []).map(task => ({
      ...task,
      changes: [] // Load changes separately if needed
    })) as TaskRecord[];
  }

  async getProjectMetrics(): Promise<ProjectMetrics> {
    // Get task counts by status
    const { data: taskCounts, error: countsError } = await supabase
      .from('tasks')
      .select('status')
      .then(({ data, error }) => {
        if (error) throw error;
        const counts = {
          total: data.length,
          completed: data.filter(t => t.status === 'completed').length,
          pending: data.filter(t => t.status === 'pending').length,
          in_progress: data.filter(t => t.status === 'in_progress').length
        };
        return { data: counts, error: null };
      });

    if (countsError) {
      throw new Error(`Failed to get task counts: ${countsError.message}`);
    }

    // Get tasks created this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data: weekTasks, error: weekError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .gte('createdDate', weekAgo.toISOString());

    // Get tasks created this month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const { data: monthTasks, error: monthError } = await supabase
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .gte('createdDate', monthAgo.toISOString());

    // Get average completion time for completed tasks
    const { data: completedTasks, error: completedError } = await supabase
      .from('tasks')
      .select('createdDate, completedDate')
      .eq('status', 'completed')
      .not('completedDate', 'is', null);

    let avgCompletionTime = 0;
    if (completedTasks && completedTasks.length > 0) {
      const totalHours = completedTasks.reduce((sum, task) => {
        const created = new Date(task.createdDate);
        const completed = new Date(task.completedDate);
        const hours = (completed.getTime() - created.getTime()) / (1000 * 60 * 60);
        return sum + hours;
      }, 0);
      avgCompletionTime = totalHours / completedTasks.length;
    }

    const completionRate = taskCounts.total > 0 ? taskCounts.completed / taskCounts.total : 0;
    const productivityScore = Math.round(completionRate * 100);

    return {
      totalTasks: taskCounts.total,
      completedTasks: taskCounts.completed,
      pendingTasks: taskCounts.pending,
      inProgressTasks: taskCounts.in_progress,
      tasksThisWeek: weekTasks?.length || 0,
      tasksThisMonth: monthTasks?.length || 0,
      avgCompletionTime,
      productivityScore
    };
  }

  private async logChange(
    taskId: number,
    changedBy: string,
    changeType: ChangeRecord['changeType'],
    oldValue?: string,
    newValue?: string,
    comment?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('task_changes')
      .insert([{
        taskId,
        timestamp: new Date().toISOString(),
        changedBy,
        changeType,
        oldValue,
        newValue,
        comment
      }]);

    if (error) {
      console.error('Failed to log change:', error);
      // Don't throw error for logging failures
    }
  }
}

// Utility functions for easy access
export async function getTaskManager(): Promise<TaskManager> {
  await initializeDatabase(); // Validate connection
  return new TaskManager();
}

export async function createTask(task: Omit<TaskRecord, 'id' | 'changes' | 'created_at' | 'updated_at'>): Promise<number> {
  const manager = await getTaskManager();
  return manager.createTask(task);
}

export async function updateTaskStatus(
  taskId: number, 
  status: TaskRecord['status'], 
  updatedBy: string,
  actualHours?: number
): Promise<void> {
  const manager = await getTaskManager();
  return manager.updateTaskStatus(taskId, status, updatedBy, actualHours);
}

export async function getTasks(filters?: {
  status?: TaskRecord['status'];
  assignedTo?: string;
  category?: TaskRecord['category'];
  priority?: TaskRecord['priority'];
  limit?: number;
  offset?: number;
}): Promise<TaskRecord[]> {
  const manager = await getTaskManager();
  return manager.getTasks(filters);
}

export async function getProjectMetrics(): Promise<ProjectMetrics> {
  const manager = await getTaskManager();
  return manager.getProjectMetrics();
}