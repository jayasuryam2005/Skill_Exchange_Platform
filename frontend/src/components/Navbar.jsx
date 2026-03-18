import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Search, Menu, X, LogOut, User, Settings, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav-bg sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">
                SkillSwap
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center px-8">
            <div className="max-w-xs w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-white/10 rounded-xl leading-5 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm transition-all"
                  placeholder="Search skills..."
                  type="search"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none transition-all duration-300 transform hover:rotate-12"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-[#0f172a]"></span>
              </button>
              {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-primary-500 transition"
                >
                  <img 
                    className="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-white/10" 
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || 'User'}`} 
                    alt={user.name} 
                  />
                </button>

                {showUserMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl py-2 bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 ring-1 ring-black ring-opacity-5 z-50 animate-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 mb-2">
                       <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                       <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <User className="h-4 w-4 mr-3 opacity-70" /> My Profile
                    </Link>
                    <Link to="/profile/edit" className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <Settings className="h-4 w-4 mr-3 opacity-70" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 mr-3 opacity-70" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary text-sm">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
