import React, { createContext, useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { authApi } from '@/lib/api'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (identifier: string, password: string) => Promise<void>
  loginWithToken: (token: string) => void
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  username?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const queryClient = useQueryClient()

  // Fetch user profile
  const { data: userData, isLoading, error } = useQuery(
    ['user', token],
    () => authApi.getProfile(),
    {
      enabled: !!token,
      retry: false,
      onError: () => {
        // Clear invalid token
        setToken(null)
        localStorage.removeItem('token')
      },
    }
  )

  // Extract user from the response
  const user = userData?.user || null

  const login = async (identifier: string, password: string) => {
    try {
      const response = await authApi.login(identifier, password)
      const { token: newToken, user: userData } = response
      
      setToken(newToken)
      localStorage.setItem('token', newToken)
      
      // Update query cache
      queryClient.setQueryData(['user', newToken], userData)
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const loginWithToken = (newToken: string) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
    // The user data will be fetched automatically by the useQuery hook
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await authApi.register(data)
      const { token: newToken, user: userData } = response
      
      setToken(newToken)
      localStorage.setItem('token', newToken)
      
      // Update query cache
      queryClient.setQueryData(['user', newToken], userData)
      
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
    queryClient.clear()
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      queryClient.setQueryData(['user', token], { ...user, ...data })
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    loginWithToken,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 