import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-6">
            Profile
          </h1>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Name
              </label>
              <p className="mt-1 text-secondary-900 dark:text-secondary-100">
                {user?.name || 'Not provided'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Email
              </label>
              <p className="mt-1 text-secondary-900 dark:text-secondary-100">
                {user?.email || 'Not provided'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Username
              </label>
              <p className="mt-1 text-secondary-900 dark:text-secondary-100">
                {user?.username || 'Not provided'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Member Since
              </label>
              <p className="mt-1 text-secondary-900 dark:text-secondary-100">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 