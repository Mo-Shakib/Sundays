import React from 'react';
import { Menu, Bell, Search, User, ChevronDown, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center flex-1">
          <button
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-auto lg:mx-0 lg:ml-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or type a command"
                className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">⌘ F</span>
              </div>
            </div>
          </div>
          
        </div>

        <div className="flex items-center space-x-4">
          {/* Mobile Search Icon - positioned next to notifications */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-6 h-6" />
          </button>
          
          <div className="relative">
            <button 
              className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-md hover:bg-gray-100"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
                <span className="text-xs text-white font-medium">3</span>
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-48 sm:max-h-64 overflow-y-auto">
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">New task assigned</p>
                    <p className="text-xs text-gray-500">Website Redesign - 2 minutes ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Project completed</p>
                    <p className="text-xs text-gray-500">Database Migration - 1 hour ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">Team meeting reminder</p>
                    <p className="text-xs text-gray-500">Daily standup in 30 minutes</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-200 bg-white">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or type a command"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}
      
      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserDropdown || showMobileSearch) && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserDropdown(false);
            setShowMobileSearch(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;