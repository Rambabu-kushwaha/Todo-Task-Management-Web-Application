import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-hot-toast'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { loginWithToken } = useAuth()

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const error = urlParams.get('error')

    if (error) {
      console.error('OAuth error:', error)
      toast.error('Authentication failed. Please try again.')
      navigate('/login')
      return
    }

    if (token) {
      // Store the token and update auth context
      try {
        loginWithToken(token)
        toast.success('Successfully signed in with Google!')
        navigate('/dashboard', { replace: true })
      } catch (error) {
        console.error('Token processing error:', error)
        toast.error('Authentication failed. Please try again.')
        navigate('/login')
      }
    } else {
      // No token found, redirect to login
      toast.error('Authentication failed. Please try again.')
      navigate('/login')
    }
  }, [navigate, loginWithToken])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Completing authentication...
        </p>
      </div>
    </div>
  )
}

export default AuthCallback 