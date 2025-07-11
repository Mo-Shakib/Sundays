import React from 'react';
import { Menu, Bell, Search, User, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPopup from './NotificationPopup';
import SearchComponent from './SearchComponent';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  projects?: any[];
  tasks?: any[];
  onProjectSelect?: (projectId: number) => void;
  onTaskSelect?: (task: any) => void;
  onViewChange?: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  setSidebarOpen,
  projects = [],
  tasks = [],
  onProjectSelect,
  onTaskSelect,
  onViewChange
}) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const desktopSearchRef = React.useRef<HTMLInputElement>(null);
  const { user, logout } = useAuth();
  const { state: notificationState } = useNotifications();

  // Count unread notifications
  const unreadCount = notificationState.notifications.filter(n => !n.isRead).length;

  // Add keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        
        // Check if we're on desktop (md breakpoint and above)
        const isDesktop = window.innerWidth >= 768;
        
        if (isDesktop && desktopSearchRef.current) {
          // Focus the desktop search input
          desktopSearchRef.current.focus();
        } else {
          // Show mobile search
          setShowMobileSearch(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            <SearchComponent
              projects={projects}
              tasks={tasks}
              onProjectSelect={onProjectSelect || (() => {})}
              onTaskSelect={onTaskSelect}
              onViewChange={onViewChange || (() => {})}
              placeholder="Search projects and tasks..."
              isMobile={false}
              searchRef={desktopSearchRef}
            />
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
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs">
                  <span className="text-xs text-white font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </span>
              )}
            </button>
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
                  <Link
                    to="/profile"
                    onClick={() => setShowUserDropdown(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
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
        <div className="md:hidden px-4 pt-3 pb-4 border-t border-gray-200 bg-white">
          <SearchComponent
            projects={projects}
            tasks={tasks}
            onProjectSelect={onProjectSelect || (() => {})}
            onTaskSelect={onTaskSelect}
            onViewChange={onViewChange || (() => {})}
            placeholder="Search projects and tasks..."
            isMobile={true}
            onClose={() => setShowMobileSearch(false)}
          />
        </div>
      )}
      
      {/* Notification Popup */}
      <NotificationPopup 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      {/* Click outside to close dropdowns */}
      {(showUserDropdown || showNotifications) && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => {
            setShowUserDropdown(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;