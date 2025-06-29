import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskStats from '../components/tasks/TaskStats';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  completedAt?: string;
  owner: any;
  sharedWith: any[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  status: string;
  priority: string;
  search: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: '',
    priority: '',
    search: ''
  });
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalTasks: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchTasks();
    
    if (socket) {
      socket.on('taskCreated', handleTaskCreated);
      socket.on('taskUpdated', handleTaskUpdated);
      socket.on('taskDeleted', handleTaskDeleted);
      
      return () => {
        socket.off('taskCreated');
        socket.off('taskUpdated');
        socket.off('taskDeleted');
      };
    }
  }, [socket, filters, pagination.currentPage]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '20',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        ...filters
      });

      const response = await fetch(`/api/tasks?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(prev => prev.filter(task => task._id !== taskId));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  if (loading && tasks.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your tasks and stay organized
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <TaskStats />
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TaskFilters 
            filters={filters} 
            onFiltersChange={handleFiltersChange} 
          />
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Task
          </button>
        </div>

        {/* Task List */}
        <div className="bg-white shadow rounded-lg">
          <TaskList 
            tasks={tasks} 
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Task Form Modal */}
        {showForm && (
          <TaskForm 
            onClose={() => setShowForm(false)}
            onSuccess={() => {
              setShowForm(false);
              fetchTasks();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 