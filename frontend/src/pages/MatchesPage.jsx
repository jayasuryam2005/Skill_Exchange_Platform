import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import { Sparkles, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const MatchesPage = () => {
  const { user: authUser } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filterRating, setFilterRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch fresh user data from API (localStorage may be stale/missing skills)
        const [usersRes, meRes] = await Promise.all([
          api.get('/users'),
          api.get('/auth/me')
        ]);

        if (meRes.data.success) {
          setCurrentUser(meRes.data.data);
          console.log('Current user from API:', meRes.data.data);
          console.log('skillsOffered:', meRes.data.data.skillsOffered);
          console.log('skillsWanted:', meRes.data.data.skillsWanted);
        }
        if (usersRes.data.success) {
          setAllUsers(usersRes.data.data);
          console.log('All users from API:', usersRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching data for matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use freshly fetched currentUser or fall back to authUser
  const user = currentUser || authUser;

  // Case-insensitive skill intersection check
  const hasIntersection = (arr1, arr2) => {
    if (!arr1 || !arr2 || !Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length === 0 || arr2.length === 0) return false;
    const normalizedArr2 = arr2.map(s => s.toLowerCase().trim());
    return arr1.some(skill => normalizedArr2.includes(skill.toLowerCase().trim()));
  };

  const matches = allUsers.filter(u => {
    // Exclude self
    const selfId = user?._id?.toString() || user?.id?.toString();
    const otherId = u._id?.toString() || u.id?.toString();
    if (selfId && otherId && selfId === otherId) return false;

    const offersWhatIWant = hasIntersection(u.skillsOffered, user?.skillsWanted);
    const wantsWhatIOffer = hasIntersection(u.skillsWanted, user?.skillsOffered);

    return offersWhatIWant || wantsWhatIOffer;
  });

  const filteredMatches = matches.filter(m => (m.rating || 0) >= filterRating);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
            <Sparkles className="h-7 w-7 text-primary-600 dark:text-blue-400 mr-2" /> Perfect Matches
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Users whose skills align perfectly with yours.</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 shadow-sm transition-all duration-300">
            <Filter className="h-4 w-4 text-gray-400 mr-2" />
            <select
              className="bg-transparent border-none text-sm font-bold text-gray-700 dark:text-gray-300 focus:ring-0 outline-none cursor-pointer"
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
            >
              <option value="0" className="dark:bg-[#1e293b]">All Ratings</option>
              <option value="4" className="dark:bg-[#1e293b]">4.0+ Stars</option>
              <option value="4.5" className="dark:bg-[#1e293b]">4.5+ Stars</option>
            </select>
          </div>
          <button className="p-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm">
            <SlidersHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map(matchedUser => (
            <UserCard key={matchedUser._id || matchedUser.id} user={matchedUser} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matches found"
          message="Try broadening your skills wanted list or lowering filters."
          actionText="Update Profile"
          onAction={() => window.location.href = '/profile/edit'}
        />
      )}
    </div>
  );
};

export default MatchesPage;
