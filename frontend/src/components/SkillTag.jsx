import React from 'react';

const SkillTag = ({ skill, onRemove, color = 'primary' }) => {
  const colorClasses = color === 'primary' 
    ? 'bg-primary-100 text-primary-700 border-primary-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' 
    : 'bg-secondary-100 text-secondary-700 border-secondary-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClasses}`}>
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="ml-2 inline-flex items-center p-0.5 rounded-full hover:bg-white/50 focus:outline-none"
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default SkillTag;
