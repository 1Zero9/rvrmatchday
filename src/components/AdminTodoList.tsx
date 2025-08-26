/**
 * Admin Todo List Component
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Administrative todo list for site management tasks.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TodoSyncService } from '../utils/todoSync';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'content' | 'design' | 'development' | 'maintenance' | 'marketing';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  createdDate: string;
  dueDate?: string;
}

export default function AdminTodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    const storedTodos = TodoSyncService.getAdminTodos();
    setTodos(storedTodos);
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (todos.length > 0) {
      TodoSyncService.saveAdminTodos(todos);
    }
  }, [todos]);

  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'content' as const,
    assignedTo: '',
    dueDate: ''
  });

  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const addTodo = () => {
    if (!newTodo.title || !newTodo.assignedTo) return;

    const todo: TodoItem = {
      id: Date.now().toString(),
      ...newTodo,
      status: 'pending',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setTodos([todo, ...todos]);
    setNewTodo({
      title: '',
      description: '',
      priority: 'medium',
      category: 'content',
      assignedTo: '',
      dueDate: ''
    });
    setShowAddForm(false);
  };

  const updateTodoStatus = (id: string, status: TodoItem['status']) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, status } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'pending') return todo.status === 'pending';
    if (filter === 'in_progress') return todo.status === 'in_progress';
    if (filter === 'completed') return todo.status === 'completed';
    return todo.category === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = {
    total: todos.length,
    pending: todos.filter(t => t.status === 'pending').length,
    inProgress: todos.filter(t => t.status === 'in_progress').length,
    completed: todos.filter(t => t.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </motion.div>

      {/* Filters and Add Button */}
      <motion.div 
        className="bg-white rounded-lg shadow p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'in_progress', 'completed', 'content', 'design', 'development', 'maintenance', 'marketing'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption.replace('_', ' ')}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            ➕ Add Task
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <motion.div 
            className="mt-6 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To *</label>
                <input
                  type="text"
                  value={newTodo.assignedTo}
                  onChange={(e) => setNewTodo({ ...newTodo, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Team or person"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newTodo.category}
                  onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="content">Content</option>
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Task description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addTodo}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Task
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Todo List */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredTodos.map((todo, index) => (
          <motion.div
            key={todo.id}
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{todo.title}</h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                      {todo.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(todo.status)}`}>
                      {todo.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{todo.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span>📝 {todo.category}</span>
                  <span>👤 {todo.assignedTo}</span>
                  <span>📅 Created: {todo.createdDate}</span>
                  {todo.dueDate && <span>⏰ Due: {todo.dueDate}</span>}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                {todo.status !== 'completed' && (
                  <>
                    {todo.status === 'pending' && (
                      <button
                        onClick={() => updateTodoStatus(todo.id, 'in_progress')}
                        className="px-3 py-1 text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors text-sm"
                      >
                        Start
                      </button>
                    )}
                    <button
                      onClick={() => updateTodoStatus(todo.id, 'completed')}
                      className="px-3 py-1 text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors text-sm"
                    >
                      Complete
                    </button>
                  </>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-600">No tasks found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}