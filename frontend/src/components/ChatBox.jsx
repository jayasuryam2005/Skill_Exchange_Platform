import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Send, Image as ImageIcon, Smile, MoreHorizontal, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatBox = ({ activeConversation, currentUser, onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Compute selfId once — try all known formats
  // Note: currentUser comes from localStorage (JSON), so _id is always a plain string
  const selfId = currentUser?._id?.toString() || currentUser?.id?.toString() || '';
  
  // Debug log for ID comparison
  console.log('ChatBox Debug:', { selfId, currentUserName: currentUser?.name });

  const partner = activeConversation?.participants?.find(
    p => (p._id || p.id)?.toString() !== selfId
  ) || activeConversation?.participants?.[0];

  const partnerAvatar = partner?.profileImage && partner.profileImage !== 'no-photo.jpg'
    ? partner.profileImage
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.name || 'User'}`;

  const myAvatar = currentUser?.profileImage && currentUser.profileImage !== 'no-photo.jpg'
    ? currentUser.profileImage
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'Me'}`;

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, []);

  const fetchMessages = useCallback(async (showLoader = false) => {
    if (!activeConversation?._id && !activeConversation?.id) return;
    try {
      if (showLoader) setInitialLoading(true);
      const convId = activeConversation._id || activeConversation.id;
      const response = await api.get(`/chat/messages/${convId}`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (showLoader) setInitialLoading(false);
    }
  }, [activeConversation]);

  // Reset and load fresh messages when conversation changes
  useEffect(() => {
    setMessages([]);
    fetchMessages(true);
    // Poll every 5s but without showing loader on polls
    const interval = setInterval(() => fetchMessages(false), 5000);
    return () => clearInterval(interval);
  }, [activeConversation, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !partner) return;

    setNewMessage('');
    inputRef.current?.focus();

    // Optimistic update — add message immediately to UI
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      sender: { _id: selfId, name: currentUser?.name },
      text,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };
    setMessages(prev => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
      const response = await api.post('/chat/messages', {
        receiverId: partner._id?.toString() || partner.id?.toString(),
        text
      });
      if (response.data.success) {
        // Re-fetch to get real message with server timestamp
        fetchMessages(false);
        if (onMessageSent) onMessageSent();
      }
    } catch (error) {
      toast.error('Failed to send message');
      setNewMessage(text);
      // Remove optimistic message
      setMessages(prev => prev.filter(m => m._id !== optimisticMsg._id));
    }
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-[#0f172a]/20 text-center p-8">
        <div className="w-16 h-16 bg-primary-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-primary-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">No conversation selected</p>
        <p className="text-sm text-gray-400">Click ✏️ to start a new chat or select one from the sidebar</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#1e293b] transition-colors duration-300 min-w-0">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between flex-shrink-0 bg-white dark:bg-[#1e293b]">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src={partnerAvatar} alt={partner?.name} className="h-10 w-10 rounded-full object-cover border border-gray-100 dark:border-white/10" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white dark:border-[#1e293b] rounded-full"></span>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{partner?.name || 'Unknown'}</h4>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Online</p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-gray-400 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-gray-50/40 dark:bg-[#0a1628]/30"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(100,100,100,0.03) 1px, transparent 0)', backgroundSize: '20px 20px' }}
      >
        {initialLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <img src={partnerAvatar} alt={partner?.name} className="h-16 w-16 rounded-full mb-3 border-2 border-gray-200 dark:border-white/10" />
            <p className="font-bold text-gray-700 dark:text-gray-300">{partner?.name}</p>
            <p className="text-sm text-gray-400 mt-1">Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            // Determine if this message is from current user
            const senderId = (msg.sender?._id || msg.sender)?.toString?.() || '';
            const isMe = selfId !== '' && senderId !== '' && senderId === selfId;

            // Group consecutive messages from same sender (WhatsApp-style)
            const prevMsg = messages[index - 1];
            const nextMsg = messages[index + 1];
            const prevSenderId = (prevMsg?.sender?._id || prevMsg?.sender)?.toString?.();
            const nextSenderId = (nextMsg?.sender?._id || nextMsg?.sender)?.toString?.();
            const isFirst = !prevMsg || prevSenderId !== senderId;
            const isLast = !nextMsg || nextSenderId !== senderId;

            // Time separator — show date when day changes
            const msgDate = new Date(msg.createdAt);
            const prevDate = prevMsg ? new Date(prevMsg.createdAt) : null;
            const showDateSeparator = !prevDate || msgDate.toDateString() !== prevDate.toDateString();

            return (
              <React.Fragment key={msg._id || msg.id}>
                {/* Date separator */}
                {showDateSeparator && (
                  <div className="flex justify-center my-3">
                    <span className="px-3 py-1 bg-gray-200/70 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-[11px] font-medium rounded-full">
                      {msgDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}

                <div className={`flex items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'} ${isFirst ? 'mt-3' : 'mt-0.5'}`}>

                  {/* Partner avatar — only on last message in a group */}
                  {!isMe && (
                    <div className="flex-shrink-0 w-7">
                      {isLast ? (
                        <img
                          src={partnerAvatar}
                          alt={partner?.name}
                          className="h-7 w-7 rounded-full object-cover border border-gray-200 dark:border-white/10"
                        />
                      ) : null}
                    </div>
                  )}

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`} style={{ maxWidth: '65%' }}>
                    {/* Name label — only on first message in group */}
                    {!isMe && isFirst && (
                      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-0.5 ml-3">
                        {msg.sender?.name || partner?.name}
                      </span>
                    )}

                    {/* Message bubble */}
                    <div className={`relative px-3.5 py-2 shadow-sm transition-all duration-200 ${
                      isMe
                        ? `bg-[#005c4b] text-white ${
                            isFirst && isLast ? 'rounded-2xl rounded-tr-none'
                            : isFirst ? 'rounded-2xl rounded-tr-none'
                            : isLast ? 'rounded-2xl rounded-r-none'
                            : 'rounded-2xl rounded-r-none'
                          }`
                        : `bg-white dark:bg-[#202c33] text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-white/5 ${
                            isFirst && isLast ? 'rounded-2xl rounded-tl-none'
                            : isFirst ? 'rounded-2xl rounded-tl-none'
                            : isLast ? 'rounded-2xl rounded-l-none'
                            : 'rounded-2xl rounded-l-none'
                          }`
                    } ${msg.isOptimistic ? 'opacity-70' : ''}`}>
                      {/* Bubble Tail Replacement (simplified) */}
                      {isFirst && (
                        <div className={`absolute top-0 w-2 h-2 ${isMe ? '-right-1 bg-[#005c4b]' : '-left-1 bg-white dark:bg-[#202c33]'} transform rotate-45 hidden md:block`} style={{ borderRadius: isMe ? '0 2px 0 0' : '2px 0 0 0' }}></div>
                      )}
                      
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${
                        isMe ? 'text-gray-300' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && !msg.isOptimistic && (
                          <span className="text-blue-200">✓✓</span>
                        )}
                        {msg.isOptimistic && <span className="text-blue-200">⏳</span>}
                      </p>
                    </div>
                  </div>

                  {/* My avatar — only on last message in group */}
                  {isMe && (
                    <div className="flex-shrink-0 w-7">
                      {isLast ? (
                        <img
                          src={myAvatar}
                          alt="You"
                          className="h-7 w-7 rounded-full object-cover border border-primary-200 dark:border-blue-500/30"
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Input Bar */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#1e293b] flex-shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button type="button" className="p-2 text-gray-400 hover:text-primary-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 flex-shrink-0">
            <ImageIcon className="h-5 w-5" />
          </button>
          <button type="button" className="p-2 text-gray-400 hover:text-primary-500 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 flex-shrink-0">
            <Smile className="h-5 w-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-gray-100 dark:bg-white/5 rounded-full px-5 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary-500 dark:focus:ring-blue-500 outline-none transition-all border border-transparent focus:border-primary-300 dark:focus:border-blue-500/50"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(e)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2.5 bg-primary-600 dark:bg-blue-600 text-white rounded-full shadow-md hover:bg-primary-700 dark:hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
