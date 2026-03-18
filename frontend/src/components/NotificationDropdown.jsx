import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, BellOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const NotificationDropdown = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;

    try {
      await Promise.all(unread.map(n => api.put(`/notifications/${n._id || n.id}`)));
      fetchNotifications();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-2xl py-1 bg-white dark:bg-[#1e293b] ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-gray-100 dark:border-white/5 transition-colors duration-300">
      <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-[#1e293b]">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
        <button 
          onClick={markAllAsRead}
          className="text-xs text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300 font-medium"
        >
          Mark all as read
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto bg-white dark:bg-[#1e293b]">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif._id || notif.id} 
              onClick={() => markAsRead(notif._id || notif.id)}
              className={`px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-50 dark:border-white/5 cursor-pointer ${!notif.isRead ? 'bg-primary-50/30 dark:bg-blue-500/5' : ''}`}
            >
              <div className="flex items-start">
                <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-primary-600 dark:bg-blue-500' : 'bg-transparent'}`}></div>
                <div className="ml-3 font-inter">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">{notif.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1.5 uppercase font-medium tracking-wider">
                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-10 text-center flex flex-col items-center">
            <BellOff className="h-8 w-8 text-gray-200 dark:text-gray-700 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
        )}
      </div>
      <div className="px-4 py-2 bg-gray-50 dark:bg-[#0f172a]/20 text-center border-t border-gray-100 dark:border-white/10">
        <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">View all notifications</button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
