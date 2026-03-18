import React from 'react';
import { Calendar, Clock, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SessionCard = ({ session }) => {
  const { user: currentUser } = useAuth();
  
  // Find the partner user
  const partner = session.users?.find(u => u._id !== currentUser?._id && u.id !== currentUser?.id) || session.users?.[0];
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvatar = (user) => {
    return user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`;
  };

  const topic = session.details || (session.request ? `${session.request.skillOffered} swap` : 'Skill Exchange');

  return (
    <div className="card p-4 transition-colors duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={getAvatar(partner)} 
            alt={partner?.name} 
            className="h-10 w-10 rounded-2xl border border-gray-100 dark:border-white/10" 
          />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">{partner?.name || 'Unknown User'}</h4>
            <p className="text-sm text-primary-600 dark:text-blue-400 font-bold">{topic}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
          session.status === 'scheduled' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400'
        }`}>
          {session.status}
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4 text-[11px] text-gray-400">
        <div className="flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          {formatDate(session.dateTime)}
        </div>
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1.5 opacity-70" />
          {formatTime(session.dateTime)}
        </div>
      </div>

      {session.status === 'scheduled' && (
        <button className="w-full mt-4 py-2 flex items-center justify-center bg-primary-50 dark:bg-white/5 text-primary-700 dark:text-blue-400 rounded-xl text-xs font-bold hover:bg-primary-100 dark:hover:bg-white/10 transition-all font-inter">
          <Video className="h-4 w-4 mr-2" /> Join Session
        </button>
      )}
    </div>
  );
};

export default SessionCard;
