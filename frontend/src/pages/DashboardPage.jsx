import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import UserCard from '../components/UserCard';
import RequestCard from '../components/RequestCard';
import SessionCard from '../components/SessionCard';
import { Flame, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [usersRes, requestsRes, sentRequestsRes, sessionsRes] = await Promise.all([
          api.get('/users'),
          api.get('/requests/received'),
          api.get('/requests/sent'),
          api.get('/sessions')
        ]);

        if (usersRes.data.success) {
          const selfId = user?._id?.toString() || user?.id?.toString();
          const filtered = usersRes.data.data.filter(u => {
            const otherId = u._id?.toString() || u.id?.toString();
            return !selfId || otherId !== selfId;
          });
          setUsers(filtered.slice(0, 2));
        }
        if (requestsRes.data.success || sentRequestsRes.data.success) {
          const received = requestsRes.data.success ? requestsRes.data.data : [];
          const sent = sentRequestsRes.data.success ? sentRequestsRes.data.data : [];
          // Combine and sort by newest first
          const combined = [...received, ...sent].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRequests(combined.slice(0, 3));
        }
        if (sessionsRes.data.success) {
          setSessions(sessionsRes.data.data.filter(s => s.status === 'scheduled').slice(0, 2));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-bg p-8 sm:p-12 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">Welcome back, {user?.name}! 👋</h1>
          <p className="text-indigo-100 text-lg mb-8">Ready to share your {user?.skillsOffered?.[0] || 'skills'} or learn something new today?</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/search" className="py-3 px-6 bg-white text-primary-700 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all flex items-center">
              Find a Mentor <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/matches" className="py-3 px-6 bg-primary-500/30 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
              View Matches
            </Link>
          </div>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400 opacity-20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Suggested Matches */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center transition-colors">
              <Flame className="h-6 w-6 text-red-500 mr-2" /> Suggested for you
            </h2>
            <Link to="/matches" className="text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-500 font-bold text-sm transition-colors">View all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {users.length > 0 ? (
              users.map(suggestedUser => (
                <UserCard key={suggestedUser._id || suggestedUser.id} user={suggestedUser} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No suggestions available right now.</p>
            )}
          </div>
        </div>

        {/* Sidebar Content: Requests and Sessions */}
        <div className="space-y-8">
          {/* Recent Requests */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Recent Requests</h3>
              <Link to="/requests" className="text-xs font-bold text-gray-400 hover:text-primary-600 dark:hover:text-blue-400 uppercase tracking-wider transition-colors">See all</Link>
            </div>
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map(request => (
                  <RequestCard key={request._id || request.id} request={request} />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No pending requests.</p>
              )}
            </div>
          </section>

          {/* Upcoming Sessions */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Upcoming Sessions</h3>
              <Link to="/sessions" className="text-xs font-bold text-gray-400 hover:text-primary-600 dark:hover:text-blue-400 uppercase tracking-wider transition-colors">Calendar</Link>
            </div>
            <div className="space-y-4">
              {sessions.length > 0 ? (
                sessions.map(session => (
                  <SessionCard key={session._id || session.id} session={session} />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">No upcoming sessions.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
