import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Edit3, Award, Settings, Shield, Search } from 'lucide-react';
import SkillTag from '../../components/SkillTag';
import StarRating from '../../components/StarRating';

const MyProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getAvatar = (user) => {
    return user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Profile Header Card */}
      <div className="card overflow-visible">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800 rounded-t-xl"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-6">
            <img 
              src={getAvatar(user)} 
              alt={user.name} 
              className="h-32 w-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
            />
            <Link 
              to="/profile/edit" 
              className="btn btn-primary flex items-center mb-2"
            >
              <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
            </Link>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-gray-900">{user.name}</h1>
            <div className="flex items-center space-x-4">
              <StarRating rating={user.rating || 0} count={user.reviews || 0} size="lg" />
              <div className="flex items-center text-gray-500 text-sm">
                <Mail className="h-4 w-4 mr-1" /> {user.email}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900 mb-2">About me</h3>
            <p className="text-gray-600 leading-relaxed max-w-2xl">{user.bio || "No bio added yet."}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills Section */}
        <div className="space-y-8">
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-100 rounded-lg mr-3">
                <Award className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Skills I Offer</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered?.map(skill => (
                <SkillTag key={skill} skill={skill} />
              )) || <p className="text-sm text-gray-400 font-medium">No skills offered yet.</p>}
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-secondary-100 rounded-lg mr-3">
                <Search className="h-5 w-5 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Skills I'm Looking For</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted?.map(skill => (
                <SkillTag key={skill} skill={skill} color="secondary" />
              )) || <p className="text-sm text-gray-400 font-medium">No skills wanted yet.</p>}
            </div>
          </div>
        </div>

        {/* Stats & badges */}
        <div className="space-y-8">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Expertise Level</h3>
            <div className="space-y-4">
              {user.skillsOffered?.map(skill => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{skill}</span>
                    <span className="text-primary-600 font-bold">Expert</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              ))}
              {(!user.skillsOffered || user.skillsOffered.length === 0) && (
                <p className="text-sm text-gray-400">Add skills to show expertise levels.</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Account Security</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-green-50 rounded-lg text-green-700">
                <Shield className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">Identity verified</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg text-gray-600">
                <Settings className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium underline cursor-pointer">Manage privacy settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
