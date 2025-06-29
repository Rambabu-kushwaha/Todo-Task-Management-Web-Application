import React from 'react'
import { useParams } from 'react-router-dom'

const TaskDetail = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-secondary-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            Task Details
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Task ID: {id}
          </p>
          <p className="text-secondary-600 dark:text-secondary-400 mt-4">
            Task detail page coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail 