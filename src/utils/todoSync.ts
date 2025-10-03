/**
 * Todo Sync Utility
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Syncs Claude Code TodoWrite with admin todo list
 */

interface ClaudeTodo {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface AdminTodo {
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

export class TodoSyncService {
  private static readonly STORAGE_KEY = 'admin_todos';
  private static readonly CLAUDE_SYNC_KEY = 'claude_todo_sync';

  // Get current admin todos from localStorage
  static getAdminTodos(): AdminTodo[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.getDefaultTodos();
  }

  // Save admin todos to localStorage
  static saveAdminTodos(todos: AdminTodo[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
  }

  // Convert Claude todo to Admin todo format
  static claudeToAdmin(claudeTodo: ClaudeTodo): AdminTodo {
    const now = new Date().toISOString().split('T')[0];
    
    // Infer category and priority from content
    const content = claudeTodo.content.toLowerCase();
    let category: AdminTodo['category'] = 'development';
    let priority: AdminTodo['priority'] = 'medium';

    if (content.includes('image') || content.includes('design') || content.includes('hero') || content.includes('background')) {
      category = 'design';
    } else if (content.includes('content') || content.includes('text') || content.includes('copy')) {
      category = 'content';
    } else if (content.includes('nav') || content.includes('link') || content.includes('page') || content.includes('route')) {
      category = 'development';
    } else if (content.includes('backup') || content.includes('maintenance') || content.includes('update')) {
      category = 'maintenance';
    } else if (content.includes('seo') || content.includes('social') || content.includes('marketing')) {
      category = 'marketing';
    }

    if (content.includes('critical') || content.includes('urgent') || content.includes('break') || content.includes('error')) {
      priority = 'critical';
    } else if (content.includes('important') || content.includes('high') || content.includes('major')) {
      priority = 'high';
    } else if (content.includes('minor') || content.includes('low') || content.includes('nice')) {
      priority = 'low';
    }

    return {
      id: `claude_${claudeTodo.id}`,
      title: claudeTodo.content.length > 50 ? claudeTodo.content.substring(0, 50) + '...' : claudeTodo.content,
      description: claudeTodo.content,
      priority,
      category,
      status: claudeTodo.status,
      assignedTo: 'Claude AI',
      createdDate: now,
      dueDate: this.calculateDueDate(priority)
    };
  }

  // Calculate due date based on priority
  private static calculateDueDate(priority: AdminTodo['priority']): string {
    const now = new Date();
    let daysToAdd = 7; // default medium priority

    switch (priority) {
      case 'critical':
        daysToAdd = 1;
        break;
      case 'high':
        daysToAdd = 3;
        break;
      case 'medium':
        daysToAdd = 7;
        break;
      case 'low':
        daysToAdd = 14;
        break;
    }

    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString().split('T')[0];
  }

  // Sync Claude todos with admin todos
  static syncClaudeTodos(claudeTodos: ClaudeTodo[]): void {
    const currentAdminTodos = this.getAdminTodos();
    const lastSyncData = this.getLastSyncData();
    
    // Find new Claude todos
    const newClaudeTodos = claudeTodos.filter(ct => 
      !lastSyncData.claudeIds.includes(ct.id)
    );

    // Convert new Claude todos to admin format
    const newAdminTodos = newClaudeTodos.map(ct => this.claudeToAdmin(ct));

    // Update existing Claude-synced todos
    const updatedAdminTodos = currentAdminTodos.map(adminTodo => {
      if (adminTodo.id.startsWith('claude_')) {
        const claudeId = adminTodo.id.replace('claude_', '');
        const claudeTodo = claudeTodos.find(ct => ct.id === claudeId);
        if (claudeTodo && claudeTodo.status !== adminTodo.status) {
          return { ...adminTodo, status: claudeTodo.status };
        }
      }
      return adminTodo;
    });

    // Combine all todos
    const allTodos = [...updatedAdminTodos, ...newAdminTodos];
    
    // Save updated todos
    this.saveAdminTodos(allTodos);
    
    // Update sync tracking
    this.saveLastSyncData({
      lastSync: new Date().toISOString(),
      claudeIds: claudeTodos.map(ct => ct.id)
    });
  }

  // Get last sync data
  private static getLastSyncData(): { lastSync: string; claudeIds: string[] } {
    if (typeof window === 'undefined') return { lastSync: '', claudeIds: [] };
    const stored = localStorage.getItem(this.CLAUDE_SYNC_KEY);
    return stored ? JSON.parse(stored) : { lastSync: '', claudeIds: [] };
  }

  // Save sync data
  private static saveLastSyncData(data: { lastSync: string; claudeIds: string[] }): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.CLAUDE_SYNC_KEY, JSON.stringify(data));
  }

  // Get default todos (initial state)
  private static getDefaultTodos(): AdminTodo[] {
    return [
      {
        id: '1',
        title: 'Add hero images to 9 glass morphism pages',
        description: 'Missing backgroundImage props: join/inclusive, get-involved/events, members/feedback, members/faq, club/values, members/parents, fundraising, shop, members/index',
        priority: 'high',
        category: 'design',
        status: 'pending',
        assignedTo: 'Design Team',
        createdDate: '2025-01-26',
        dueDate: '2025-01-28'
      },
      {
        id: '2', 
        title: 'Update sponsor logos section',
        description: 'Replace placeholder sponsor logos with actual partner logos',
        priority: 'medium',
        category: 'content',
        status: 'pending',
        assignedTo: 'Content Team',
        createdDate: '2025-01-25',
        dueDate: '2025-01-30'
      },
      {
        id: '3',
        title: 'Implement proper authentication system',
        description: 'Replace demo login with proper JWT/session-based authentication',
        priority: 'critical',
        category: 'development',
        status: 'pending',
        assignedTo: 'Dev Team',
        createdDate: '2025-01-24',
        dueDate: '2025-02-15'
      },
      {
        id: '4',
        title: 'Configure social media links',
        description: 'Update Facebook/Instagram links with actual club social media accounts',
        priority: 'medium',
        category: 'marketing',
        status: 'completed',
        assignedTo: 'Marketing Team',
        createdDate: '2025-01-20'
      },
      {
        id: '5',
        title: 'Database backup automation',
        description: 'Set up automated daily backups for site content and user data',
        priority: 'high',
        category: 'maintenance',
        status: 'in_progress',
        assignedTo: 'Dev Team',
        createdDate: '2025-01-23',
        dueDate: '2025-02-01'
      },
      {
        id: '6',
        title: 'Mobile navigation improvements',
        description: 'Enhance mobile menu with better touch targets and accessibility',
        priority: 'medium',
        category: 'development',
        status: 'completed',
        assignedTo: 'Dev Team',
        createdDate: '2025-01-21'
      },
      {
        id: '7',
        title: 'SEO optimization audit',
        description: 'Review and optimize meta tags, alt texts, and structured data',
        priority: 'medium',
        category: 'marketing',
        status: 'pending',
        assignedTo: 'Marketing Team',
        createdDate: '2025-01-26',
        dueDate: '2025-02-05'
      }
    ];
  }

  // Generate session review prompt
  static generateSessionReviewPrompt(): string {
    const todos = this.getAdminTodos();
    const pendingTodos = todos.filter(t => t.status === 'pending');
    const inProgressTodos = todos.filter(t => t.status === 'in_progress');
    
    let prompt = '📋 **SESSION START: Todo List Review**\n\n';
    
    if (inProgressTodos.length > 0) {
      prompt += `🔄 **In Progress Tasks (${inProgressTodos.length}):**\n`;
      inProgressTodos.forEach(todo => {
        prompt += `• ${todo.title} (${todo.priority} priority)\n`;
      });
      prompt += '\n';
    }
    
    if (pendingTodos.length > 0) {
      prompt += `⏳ **Pending Tasks (${pendingTodos.length}):**\n`;
      pendingTodos.slice(0, 5).forEach(todo => { // Show top 5
        prompt += `• ${todo.title} (${todo.priority} priority)\n`;
      });
      if (pendingTodos.length > 5) {
        prompt += `• ... and ${pendingTodos.length - 5} more\n`;
      }
      prompt += '\n';
    }

    prompt += '💡 **Ready to work on any of these tasks or add new ones?**\n';
    prompt += 'Access the full todo list at: http://localhost:3000/admin';
    
    return prompt;
  }
}