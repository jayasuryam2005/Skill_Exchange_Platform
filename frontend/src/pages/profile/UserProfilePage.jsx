import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Mail, MessageSquare, Send, ArrowLeft, Award, Search as SearchIcon, Loader2 } from 'lucide-react';
import SkillTag from '../../components/SkillTag';
import StarRating from '../../components/StarRating';
import { toast } from 'react-hot-toast';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/users/${id}`);
        if (response.data.success) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('User not found');
        navigate('/search');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleSendRequest = () => {
    // This would eventually open a modal or navigate to a request creation page
    toast.success(`Opening skill exchange request for ${user.name}!`);
  };

  const getAvatar = (u) => {
    return u?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u?.name || 'User'}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 font-medium transition-colors">
        <ArrowLeft className="h-5 w-5 mr-1" /> Back
      </button>

      <div className="card overflow-visible shadow-xl">
        <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-2xl"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <img 
              src={getAvatar(user)} 
              alt={user.name} 
              className="h-32 w-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
            />
            <div className="flex space-x-3 mb-2">
              <button 
                onClick={() => navigate('/chat')}
                className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              <button 
                onClick={handleSendRequest}
                className="btn btn-primary flex items-center shadow-lg hover:shadow-primary-500/25"
              >
                <Send className="h-4 w-4 mr-2" /> Send Request
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">{user.name}</h1>
            <StarRating rating={user.rating || 0} count={user.reviews || 0} size="lg" />
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors">Bio</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl transition-colors">{user.bio || "No bio information provided."}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-6 border-transparent shadow-lg bg-white dark:bg-[#1e293b]">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary-100 dark:bg-blue-500/10 rounded-lg mr-3">
              <Award className="h-5 w-5 text-primary-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Skills Offered</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered?.map(skill => (
              <SkillTag key={skill} skill={skill} />
            )) || <p className="text-sm text-gray-400">No skills listed.</p>}
          </div>
        </div>

        <div className="card p-6 border-transparent shadow-lg bg-white dark:bg-[#1e293b]">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-secondary-100 dark:bg-teal-500/10 rounded-lg mr-3">
              <SearchIcon className="h-5 w-5 text-secondary-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">Looking For</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted?.map(skill => (
              <SkillTag key={skill} skill={skill} color="secondary" />
            )) || <p className="text-sm text-gray-400">No skills listed.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
