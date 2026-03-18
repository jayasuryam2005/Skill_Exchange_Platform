import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';
import { MessageSquare, Search, Loader2, SquarePen, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatPage = () => {
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New Chat modal state
  const [showNewChat, setShowNewChat] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/chat/conversations');
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchConversations();
      setIsLoading(false);
    };
    init();
  }, []);

  const openNewChat = async () => {
    setShowNewChat(true);
    setUserSearch('');
    try {
      const [usersRes, meRes] = await Promise.all([
        api.get('/users'),
        api.get('/auth/me')
      ]);
      if (usersRes.data.success) {
        const selfId = meRes.data.success ? meRes.data.data._id?.toString() : currentUser?._id?.toString();
        const others = usersRes.data.data.filter(u => u._id?.toString() !== selfId);
        setAllUsers(others);
      }
    } catch (err) {
      toast.error('Failed to load users');
    }
  };

  const startChat = async (targetUser) => {
    setIsStarting(true);
    try {
      const response = await api.post('/chat/conversations', {
        userId: targetUser._id || targetUser.id
      });
      if (response.data.success) {
        await fetchConversations();
        setSelectedConversation(response.data.data);
        setShowNewChat(false);
      }
    } catch (err) {
      toast.error('Failed to start conversation');
    } finally {
      setIsStarting(false);
    }
  };

  // Get the partner from a conversation using .toString() for reliable comparison
  const getPartner = (conversation) => {
    const selfId = currentUser?._id?.toString() || currentUser?.id?.toString();
    return conversation.participants?.find(p => (p._id || p.id)?.toString() !== selfId)
      || conversation.participants?.[0];
  };

  const filteredConversations = conversations.filter(conv => {
    const partner = getPartner(conv);
    return partner?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredUsers = allUsers.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="h-[calc(100vh-160px)] flex border border-gray-100 dark:border-white/5 rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-[#1e293b] animate-in fade-in duration-500">
        {/* Sidebar - Conversation List */}
        <div className="w-80 border-r border-gray-100 dark:border-white/5 flex flex-col bg-gray-50/30 dark:bg-[#0f172a]/20">
          <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e293b]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary-600 dark:text-blue-400" /> Messages
                </h1>
                <p className="text-[10px] text-gray-400 mt-0.5">Logged in as: <span className="text-primary-600 dark:text-blue-400 font-medium">{currentUser?.name}</span></p>
              </div>
              <button
                onClick={openNewChat}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors text-primary-600 dark:text-blue-400"
                title="New conversation"
              >
                <SquarePen className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-white/5 border-transparent rounded-lg text-sm focus:bg-white dark:focus:bg-white/10 focus:ring-1 focus:ring-primary-500 dark:text-white outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-400 mb-3">No conversations yet</p>
                <button
                  onClick={openNewChat}
                  className="text-sm font-bold text-primary-600 dark:text-blue-400 hover:underline"
                >
                  Start a new chat
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const partner = getPartner(conv);
                const avatar = partner?.profileImage && partner.profileImage !== 'no-photo.jpg'
                  ? partner.profileImage
                  : `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.name || 'User'}`;
                const isSelected = selectedConversation?._id?.toString() === conv._id?.toString();

                return (
                  <button
                    key={conv._id || conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 flex items-center space-x-3 border-b border-gray-50 dark:border-white/5 transition-colors ${
                      isSelected
                        ? 'bg-primary-50 dark:bg-blue-500/10 border-l-4 border-l-primary-600 dark:border-l-blue-500'
                        : 'hover:bg-gray-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img src={avatar} alt={partner?.name} className="h-12 w-12 rounded-full object-cover" />
                      <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full"></span>
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate">{partner?.name || 'Unknown'}</h4>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">
                          {conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{conv.lastMessage || 'No messages yet'}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Window */}
        <ChatBox
          activeConversation={selectedConversation}
          currentUser={currentUser}
          onMessageSent={fetchConversations}
        />
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewChat(false)}>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-white/10 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white">New Conversation</h3>
              <button onClick={() => setShowNewChat(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 border-b border-gray-100 dark:border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  autoFocus
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-500 transition-all"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {allUsers.length === 0 ? (
                <div className="flex justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-400">No users found</p>
              ) : (
                filteredUsers.map(u => {
                  const avatar = u.profileImage && u.profileImage !== 'no-photo.jpg'
                    ? u.profileImage
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`;
                  return (
                    <button
                      key={u._id || u.id}
                      onClick={() => startChat(u)}
                      disabled={isStarting}
                      className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0 disabled:opacity-60"
                    >
                      <img src={avatar} alt={u.name} className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                      <div className="text-left">
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[220px]">
                          {u.bio || (u.skillsOffered?.[0] ? `Offers: ${u.skillsOffered[0]}` : 'No bio yet')}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPage;
