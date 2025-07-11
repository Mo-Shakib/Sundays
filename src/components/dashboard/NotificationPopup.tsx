import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose }) => {
  const { state, clearNotifications, markAsRead } = useNotifications();

  if (!isOpen) return null;

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-blue-500';
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
  };

  const handleClearAll = () => {
    clearNotifications();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Mobile: Full screen modal, Desktop: Centered popup */}
      <div className="fixed z-50 inset-4 md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:inset-auto">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 h-full md:max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {state.notifications.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {state.notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Notification List */}
          <div className="flex-1 overflow-y-auto">
            {state.notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">All caught up! 🎉</h4>
                <p className="text-sm text-gray-500">No new notifications right now. Keep up the great work!</p>
              </div>
            ) : (
              state.notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div 
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getColorClasses(notification.color)}`}
                    ></div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{getTimeAgo(notification.timestamp)}</p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          {state.notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button 
                onClick={handleClearAll}
                className="w-full flex items-center justify-center space-x-2 text-center text-sm text-red-600 hover:text-red-800 font-medium transition-colors py-2 px-4 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear all notifications</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;