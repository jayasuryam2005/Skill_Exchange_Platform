import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import { Search as SearchIcon, Filter, X, Loader2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';

const SearchPage = () => {
  const { user: authUser } = useAuth();
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const [usersRes, meRes] = await Promise.all([
          api.get('/users'),
          api.get('/auth/me')
        ]);

        let fetchedCurrentUser = null;
        if (meRes.data.success) {
          fetchedCurrentUser = meRes.data.data;
          setCurrentUser(fetchedCurrentUser);
        }

        if (usersRes.data.success) {
          const selfId = fetchedCurrentUser?._id?.toString() || authUser?._id?.toString() || authUser?.id?.toString();
          const fetchedUsers = usersRes.data.data.filter(u => {
            const otherId = u._id?.toString() || u.id?.toString();
            return !selfId || otherId !== selfId;
          });
          setAllUsers(fetchedUsers);
          setResults(fetchedUsers);
        }
      } catch (error) {
        console.error('Error fetching users for search:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.trim() === '') {
      setResults(allUsers);
    } else {
      const filtered = allUsers.filter(u => 
        u.name?.toLowerCase().includes(val.toLowerCase()) ||
        u.skillsOffered?.some(s => s.toLowerCase().includes(val.toLowerCase())) ||
        u.skillsWanted?.some(s => s.toLowerCase().includes(val.toLowerCase())) ||
        u.bio?.toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(allUsers);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">Find your next skill partner</h1>
        
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full pl-14 pr-12 py-5 bg-white dark:bg-[#1e293b] border-2 border-transparent focus:border-primary-500 dark:focus:border-blue-500 rounded-3xl shadow-xl dark:shadow-2xl dark:shadow-blue-500/5 outline-none transition-all text-lg text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="Search by name or skill (React, Figma, Python...)"
            value={query}
            onChange={handleSearch}
          />
          {query && (
            <button 
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {['React', 'UI/UX', 'Python', 'Marketing', 'Photography'].map(tag => (
            <button 
              key={tag}
              onClick={() => handleSearch({ target: { value: tag } })}
              className="px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-primary-50 dark:hover:bg-blue-500/10 text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-blue-400 rounded-xl text-sm font-bold transition-all border border-transparent hover:border-primary-200 dark:hover:border-blue-500/30"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
            {query ? `Search results for "${query}"` : 'All Users'} 
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">({results.length} found)</span>
          </h2>
          <button className="flex items-center text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-blue-400 transition-colors">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </button>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(u => (
              <UserCard key={u._id || u.id} user={u} />
            ))}
          </div>
        ) : (
          <EmptyState 
            title="No results found" 
            message={`We couldn't find any users matching "${query}". Try a different search term.`}
            actionText="Clear Search"
            onAction={clearSearch}
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
