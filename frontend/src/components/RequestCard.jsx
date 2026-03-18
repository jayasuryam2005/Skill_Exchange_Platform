import React from 'react';
import { Check, X, Clock } from 'lucide-react';

const RequestCard = ({ request, onAccept, onReject, activeTab }) => {
  // Determine if we show sender or receiver info based on tab
  const displayUser = activeTab === 'sent' ? request.receiver : request.sender;
  const isReceived = activeTab === 'received' && request.status === 'pending';
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvatar = (user) => {
    return user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`;
  };

  return (
    <div className="card p-4 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={getAvatar(displayUser)} 
            alt={displayUser?.name} 
            className="h-10 w-10 rounded-2xl border border-gray-100 dark:border-white/10" 
          />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">{displayUser?.name || 'Unknown User'}</h4>
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              {formatDate(request.createdAt)}
            </div>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
          request.status === 'pending' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 
          request.status === 'accepted' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' :
          'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'
        }`}>
          {request.status}
        </span>
      </div>

      <div className="mt-4 p-3 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-100/50 dark:border-white/5">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tight mb-0.5">Offers</p>
            <p className="font-bold text-primary-700 dark:text-blue-400">{request.skillOffered}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tight mb-0.5">Wants</p>
            <p className="font-bold text-secondary-700 dark:text-teal-400">{request.skillWanted}</p>
          </div>
        </div>
        {request.message && (
          <p className="mt-2 text-xs text-gray-500 italic">"{request.message}"</p>
        )}
      </div>

      {request.status === 'accepted' && (
        <button 
          onClick={() => window.location.href = `/schedule?requestId=${request._id || request.id}`}
          className="mt-4 w-full flex items-center justify-center py-2.5 bg-green-600 dark:bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 dark:hover:bg-green-500 shadow-md hover:shadow-green-500/20 transition-all font-inter"
        >
          <Clock className="h-4 w-4 mr-2" /> Schedule Session
        </button>
      )}

      {isReceived && (
        <div className="mt-4 flex space-x-2">
          <button 
            onClick={() => onAccept && onAccept(request._id || request.id)}
            className="flex-1 flex items-center justify-center py-2 bg-primary-600 dark:bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 dark:hover:bg-blue-500 shadow-md hover:shadow-primary-500/20 transition-all font-inter"
          >
            <Check className="h-4 w-4 mr-1.5" /> Accept
          </button>
          <button 
            onClick={() => onReject && onReject(request._id || request.id)}
            className="flex-1 flex items-center justify-center py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/10 transition-all font-inter"
          >
            <X className="h-4 w-4 mr-1.5" /> Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
