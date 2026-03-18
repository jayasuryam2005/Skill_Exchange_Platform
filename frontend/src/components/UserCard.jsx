import React, { useState } from 'react';
import { Star, Send, X, ChevronDown } from 'lucide-react';
import SkillTag from './SkillTag';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const UserCard = ({ user }) => {
  const { user: currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillWanted, setSkillWanted] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const avatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'User'}`;

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!skillOffered || !skillWanted) {
      toast.error('Please select both skills');
      return;
    }
    setIsSending(true);
    try {
      const response = await api.post('/requests', {
        receiver: user._id || user.id,
        skillOffered,
        skillWanted,
        message
      });
      if (response.data.success) {
        toast.success(`Request sent to ${user.name}!`);
        setShowModal(false);
        setSkillOffered('');
        setSkillWanted('');
        setMessage('');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send request');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="card group">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <img
              src={avatar}
              alt={user.name}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-primary-100 dark:border-white/10 group-hover:border-primary-300 transition-colors"
            />
            <div className="flex items-center bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-lg">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="ml-1 text-sm font-bold text-yellow-700 dark:text-yellow-500">{user.rating || 0}</span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-blue-400 transition-colors">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{user.bio}</p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Offers</p>
            <div className="flex flex-wrap gap-1.5">
              {(user.skillsOffered || []).slice(0, 3).map(skill => (
                <SkillTag key={skill} skill={skill} />
              ))}
              {(user.skillsOffered || []).length > 3 && (
                <span className="text-xs text-gray-400 self-center">+{user.skillsOffered.length - 3} more</span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-primary-50 dark:bg-white/5 text-primary-700 dark:text-blue-400 font-bold hover:bg-primary-100 dark:hover:bg-white/10 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Send Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Send Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Send Request to {user.name}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Skill You Offer</label>
                <div className="relative">
                  <select
                    value={skillOffered}
                    onChange={e => setSkillOffered(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white appearance-none focus:outline-none focus:border-primary-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="">Select a skill you offer...</option>
                    {(currentUser?.skillsOffered || []).map(s => (
                      <option key={s} value={s} className="dark:bg-[#1e293b]">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Skill You Want from {user.name}</label>
                <div className="relative">
                  <select
                    value={skillWanted}
                    onChange={e => setSkillWanted(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white appearance-none focus:outline-none focus:border-primary-500 dark:focus:border-blue-500"
                    required
                  >
                    <option value="">Select a skill they offer...</option>
                    {(user.skillsOffered || []).map(s => (
                      <option key={s} value={s} className="dark:bg-[#1e293b]">{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Message <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Introduce yourself and explain why you want to exchange skills..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-blue-500 min-h-[80px] resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 py-2.5 bg-primary-600 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-primary-700 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isSending ? (
                    <span className="inline-block h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserCard;
