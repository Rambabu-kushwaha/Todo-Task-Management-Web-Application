export interface User {
  id: string
  name: string
  email: string
  username?: string
  picture?: string
  isEmailVerified: boolean
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    notifications: {
      email: boolean
      push: boolean
    }
    timezone: string
  }
  lastLogin: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'completed' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  completedAt?: string
  owner: User
  sharedWith: Array<{
    user: User
    permission: 'read' | 'write' | 'admin'
    sharedAt: string
  }>
  tags: string[]
  attachments: Array<{
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
    uploadedAt: string
  }>
  subtasks: Array<{
    id: string
    title: string
    completed: boolean
    completedAt?: string
  }>
  comments: Array<{
    id: string
    user: User
    content: string
    createdAt: string
  }>
  isPublic: boolean
  estimatedTime?: {
    hours: number
    minutes: number
  }
  actualTime?: {
    hours: number
    minutes: number
  }
  recurring?: {
    isRecurring: boolean
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
  }
  createdAt: string
  updatedAt: string
}

export interface TaskFilters {
  status?: Task['status']
  priority?: Task['priority']
  tags?: string[]
  search?: string
  dueDate?: string
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title' | 'status'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface TaskStats {
  total: number
  overdue: number
  dueToday: number
  byStatus: {
    todo: number
    'in-progress': number
    completed: number
    archived: number
  }
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
  details?: any[]
}

export interface LoginResponse {
  token: string
  user: User
  message: string
}

export interface RegisterResponse {
  token: string
  user: User
  message: string
}

export interface TasksResponse {
  tasks: Task[]
  pagination: PaginationInfo
}

export interface TaskResponse {
  task: Task
}

export interface UserSearchResponse {
  users: Array<{
    id: string
    name: string
    email: string
    username?: string
    picture?: string
  }>
}

export interface SocketEvent {
  type: string
  data: any
}

export interface TaskCreateData {
  title: string
  description?: string
  status?: Task['status']
  priority?: Task['priority']
  dueDate?: string
  tags?: string[]
  sharedWith?: Array<{
    email: string
    permission?: 'read' | 'write' | 'admin'
  }>
  subtasks?: Array<{
    title: string
  }>
  estimatedTime?: {
    hours: number
    minutes: number
  }
  recurring?: {
    isRecurring: boolean
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
  }
}

export interface TaskUpdateData extends Partial<TaskCreateData> {}

export interface CommentData {
  content: string
}

export interface ShareTaskData {
  email: string
  permission?: 'read' | 'write' | 'admin'
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto'
  notifications?: {
    email?: boolean
    push?: boolean
  }
  timezone?: string
}

export interface ProfileUpdateData {
  name?: string
  username?: string
  preferences?: UserPreferences
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
}

export interface AccountDeleteData {
  password: string
} 