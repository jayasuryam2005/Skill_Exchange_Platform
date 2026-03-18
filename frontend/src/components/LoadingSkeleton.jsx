import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="card p-6 animate-pulse transition-colors duration-300">
        <div className="flex items-start justify-between">
          <div className="h-16 w-16 bg-gray-100 dark:bg-white/5 rounded-2xl"></div>
          <div className="h-6 w-12 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-5 w-3/4 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
          <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-lg"></div>
          <div className="h-4 w-5/6 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-gray-100 dark:bg-white/5 rounded-full"></div>
          <div className="h-6 w-16 bg-gray-100 dark:bg-white/5 rounded-full"></div>
        </div>
        <div className="mt-6 h-10 w-full bg-gray-100 dark:bg-white/5 rounded-xl"></div>
      </div>
    );
  }

  if (type === 'hero') {
    return (
      <div className="h-64 bg-gray-100 dark:bg-white/5 rounded-3xl animate-pulse"></div>
    );
  }

  return (
    <div className="h-4 bg-gray-100 dark:bg-white/5 rounded animate-pulse w-full"></div>
  );
};

export default LoadingSkeleton;
