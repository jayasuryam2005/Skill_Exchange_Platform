import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

const EmptyState = ({ title, message, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in duration-500 transition-colors duration-300">
      <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-6 mb-6">
        <SearchIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-8">{message}</p>
      {actionText && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
