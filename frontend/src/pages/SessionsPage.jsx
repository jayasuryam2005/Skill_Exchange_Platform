import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SessionCard from '../components/SessionCard';
import { Calendar, History, Video, CheckCircle, Loader2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-hot-toast';

const SessionsPage = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/sessions');
        if (response.data.success) {
          setSessions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
        toast.error('Failed to load sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getPartner = (session) => {
    return session.users?.find(u => u._id !== currentUser?._id && u.id !== currentUser?.id);
  };

  const filteredSessions = sessions.filter(sess => {
    if (activeTab === 'upcoming') {
      return sess.status === 'scheduled';
    } else {
      return sess.status === 'completed' || sess.status === 'cancelled';
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors flex items-center">
            <Calendar className="h-7 w-7 text-primary-600 dark:text-blue-400 mr-2" /> My Sessions
          </h1>
          <p className="text-gray-500 mt-1 transition-colors">Keep track of your learning and teaching sessions.</p>
        </div>
        
        <button className="btn btn-primary flex items-center self-start md:self-auto shadow-lg hover:shadow-primary-500/25">
          <Video className="h-4 w-4 mr-2" /> Start Instant Session
        </button>
      </div>

      <div className="flex bg-white dark:bg-[#1e293b] p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 max-w-md transition-colors">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'upcoming' 
              ? 'bg-primary-600 dark:bg-blue-600 text-white shadow-md' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          <Calendar className="h-4 w-4 mr-2" /> Upcoming
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'completed' 
              ? 'bg-primary-600 dark:bg-blue-600 text-white shadow-md' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-white/5'
          }`}
        >
          <History className="h-4 w-4 mr-2" /> History
        </button>
      </div>

      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map(sess => {
            const partner = getPartner(sess);
            return (
              <div key={sess._id || sess.id} className="relative group">
                <SessionCard session={sess} />
                {sess.status === 'completed' && partner && (
                  <button 
                    onClick={() => window.location.href = `/review?sessionId=${sess._id || sess.id}&partnerId=${partner._id || partner.id}`}
                    className="mt-3 w-full py-2 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm font-bold hover:bg-yellow-100 dark:hover:bg-yellow-500/20 transition-all flex items-center justify-center border border-yellow-200/50 dark:border-yellow-500/20"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Leave Review
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState 
          title={`No ${activeTab} sessions`}
          message={activeTab === 'upcoming' 
            ? "You don't have any sessions scheduled yet. Time to reach out to some partners!" 
            : "You haven't completed any sessions yet. Once you do, they'll appear here for review."}
          actionText={activeTab === 'upcoming' ? "Find Partners" : null}
          onAction={() => window.location.href = '/matches'}
        />
      )}
    </div>
  );
};

export default SessionsPage;
