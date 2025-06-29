import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import {
  User,
  Task,
  TaskFilters,
  TaskStats,
  TasksResponse,
  TaskResponse,
  UserSearchResponse,
  LoginResponse,
  RegisterResponse,
  TaskCreateData,
  TaskUpdateData,
  CommentData,
  ShareTaskData,
  ProfileUpdateData,
  PasswordChangeData,
  AccountDeleteData,
} from '@/types'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    
    // Show error toast for non-401 errors
    if (error.response?.status !== 401) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (identifier: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/login', { identifier, password })
    return response.data
  },

  register: async (data: {
    name: string
    email: string
    password: string
    username?: string
  }): Promise<RegisterResponse> => {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post('/api/auth/refresh')
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout')
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/api/auth/forgot-password', { email })
    return response.data
  },
}

// Tasks API
export const tasksApi = {
  getTasks: async (filters?: TaskFilters): Promise<TasksResponse> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','))
          } else {
            params.append(key, String(value))
          }
        }
      })
    }
    
    const response = await api.get(`/api/tasks?${params.toString()}`)
    return response.data
  },

  getTask: async (id: string): Promise<TaskResponse> => {
    const response = await api.get(`/api/tasks/${id}`)
    return response.data
  },

  createTask: async (data: TaskCreateData): Promise<TaskResponse> => {
    const response = await api.post('/api/tasks', data)
    return response.data
  },

  updateTask: async (id: string, data: TaskUpdateData): Promise<TaskResponse> => {
    const response = await api.put(`/api/tasks/${id}`, data)
    return response.data
  },

  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/tasks/${id}`)
    return response.data
  },

  shareTask: async (id: string, data: ShareTaskData): Promise<TaskResponse> => {
    const response = await api.post(`/api/tasks/${id}/share`, data)
    return response.data
  },

  removeSharedUser: async (taskId: string, userId: string): Promise<TaskResponse> => {
    const response = await api.delete(`/api/tasks/${taskId}/share/${userId}`)
    return response.data
  },

  addComment: async (id: string, data: CommentData): Promise<TaskResponse> => {
    const response = await api.post(`/api/tasks/${id}/comments`, data)
    return response.data
  },

  getStats: async (): Promise<TaskStats> => {
    const response = await api.get('/api/tasks/stats/overview')
    return response.data
  },
}

// Users API
export const usersApi = {
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/api/users/profile')
    return response.data
  },

  updateProfile: async (data: ProfileUpdateData): Promise<{ user: User; message: string }> => {
    const response = await api.put('/api/users/profile', data)
    return response.data
  },

  searchUsers: async (query: string): Promise<UserSearchResponse> => {
    const response = await api.get(`/api/users/search?query=${encodeURIComponent(query)}`)
    return response.data
  },

  getUser: async (id: string): Promise<{ user: User }> => {
    const response = await api.get(`/api/users/${id}`)
    return response.data
  },

  getSharedTasks: async (): Promise<{ sharedTasks: Task[] }> => {
    const response = await api.get('/api/users/shared-tasks')
    return response.data
  },

  changePassword: async (data: PasswordChangeData): Promise<{ message: string }> => {
    const response = await api.put('/api/users/change-password', data)
    return response.data
  },

  deleteAccount: async (data: AccountDeleteData): Promise<{ message: string }> => {
    const response = await api.delete('/api/users/account', { data })
    return response.data
  },
}

export default api 