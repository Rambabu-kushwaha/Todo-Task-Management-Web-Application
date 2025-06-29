import React from 'react';
import { format } from 'date-fns';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  tags: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
    picture?: string;
  };
  sharedWith: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
      picture?: string;
    };
    permission: 'read' | 'write' | 'admin';
  }>;
  subtasks: Array<{
    _id: string;
    title: string;
    completed: boolean;
  }>;
  estimatedTime?: number;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusUpdate: (taskId: string, status: Task['status']) => void;
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
  onStatusUpdate,
  pagination,
  onPageChange
}) => {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-400';
      case 'high': return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400';
      case 'medium': return 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400';
      case 'low': return 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400';
      default: return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-400';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed': return 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400';
      case 'in-progress': return 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400';
      case 'archived': return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/20 dark:text-secondary-400';
      default: return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400';
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getCompletedSubtasks = (subtasks: Task['subtasks']) => {
    return subtasks.filter(subtask => subtask.completed).length;
  };

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-secondary-400 dark:text-secondary-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
          No tasks found
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400">
          {pagination.totalItems === 0 
            ? "Create your first task to get started!"
            : "No tasks match your current filters."
          }
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Task Cards */}
      <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
        {tasks.map((task) => (
          <div key={task._id} className="p-6 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 truncate">
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {isOverdue(task.dueDate) && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-400">
                      Overdue
                    </span>
                  )}
                </div>

                {task.description && (
                  <p className="text-secondary-600 dark:text-secondary-400 mb-3 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-sm text-secondary-500 dark:text-secondary-400 mb-3">
                  {task.dueDate && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className={isOverdue(task.dueDate) ? 'text-error-600 dark:text-error-400' : ''}>
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  
                  {task.estimatedTime && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{task.estimatedTime}h</span>
                    </div>
                  )}

                  {task.subtasks.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>{getCompletedSubtasks(task.subtasks)}/{task.subtasks.length}</span>
                    </div>
                  )}
                </div>

                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-secondary-100 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <img
                      src={task.owner.picture || `https://ui-avatars.com/api/?name=${task.owner.name}&background=random`}
                      alt={task.owner.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {task.owner.name}
                    </span>
                  </div>
                  
                  {task.sharedWith.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-secondary-500 dark:text-secondary-400">•</span>
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        Shared with {task.sharedWith.length} user{task.sharedWith.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {/* Status Dropdown */}
                <select
                  value={task.status}
                  onChange={(e) => onStatusUpdate(task._id, e.target.value as Task['status'])}
                  className="px-3 py-1 text-sm border border-secondary-300 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Action Buttons */}
                <button
                  onClick={() => onEdit(task)}
                  className="p-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors"
                  title="Edit task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={() => onDelete(task._id)}
                  className="p-2 text-secondary-600 dark:text-secondary-400 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-md transition-colors"
                  title="Delete task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)} of{' '}
              {pagination.totalItems} tasks
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-md hover:bg-secondary-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <span className="px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 text-sm font-medium text-secondary-600 dark:text-secondary-400 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-md hover:bg-secondary-50 dark:hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList; 