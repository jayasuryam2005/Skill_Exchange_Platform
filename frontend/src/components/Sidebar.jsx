import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Search, MessageSquare, Repeat, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggle }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Matches', icon: Users, path: '/matches' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Requests', icon: Repeat, path: '/requests' },
    { name: 'Sessions', icon: Calendar, path: '/sessions' },
    { name: 'Chat', icon: MessageSquare, path: '/chat' },
    { name: 'My Profile', icon: User, path: '/profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={toggle}
        ></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 sidebar-bg transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full transition-colors duration-300">
          <div className="flex items-center justify-center h-16 px-4 lg:hidden">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">SkillSwap</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-50 dark:bg-blue-500/10 text-primary-700 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3 opacity-70" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 dark:border-white/5">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
            >
              <LogOut className="h-5 w-5 mr-3 opacity-80" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
