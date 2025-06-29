import React from 'react';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
}

const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Tasks */}
      <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-lg border border-primary-200 dark:border-primary-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100">
              Total Tasks
            </h3>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {stats.total}
            </p>
          </div>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-success-50 dark:bg-success-900/20 p-6 rounded-lg border border-success-200 dark:border-success-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-success-900 dark:text-success-100">
              Completed
            </h3>
            <p className="text-3xl font-bold text-success-600 dark:text-success-400">
              {stats.completed}
            </p>
            <p className="text-sm text-success-700 dark:text-success-300">
              {completionRate}% completion rate
            </p>
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-warning-50 dark:bg-warning-900/20 p-6 rounded-lg border border-warning-200 dark:border-warning-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-warning-900 dark:text-warning-100">
              Pending
            </h3>
            <p className="text-3xl font-bold text-warning-600 dark:text-warning-400">
              {stats.pending}
            </p>
            <p className="text-sm text-warning-700 dark:text-warning-300">
              In progress & to do
            </p>
          </div>
        </div>
      </div>

      {/* Overdue Tasks */}
      <div className="bg-error-50 dark:bg-error-900/20 p-6 rounded-lg border border-error-200 dark:border-error-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-error-600 dark:text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-error-900 dark:text-error-100">
              Overdue
            </h3>
            <p className="text-3xl font-bold text-error-600 dark:text-error-400">
              {stats.overdue}
            </p>
            <p className="text-sm text-error-700 dark:text-error-300">
              Past due date
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats; 