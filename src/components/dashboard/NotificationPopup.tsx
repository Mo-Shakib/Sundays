import React from 'react';
import { X, Trash2, Clock, AlertTriangle, Target, Bell, TrendingUp, Award } from 'lucide-react';
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

  const getBorderColorClass = (color: string) => {
    const colorMap = {
      blue: 'border-l-blue-400',
      green: 'border-l-green-400',
      yellow: 'border-l-yellow-400',
      purple: 'border-l-purple-400',
      red: 'border-l-red-400',
      orange: 'border-l-orange-400'
    };
    return colorMap[color as keyof typeof colorMap] || 'border-l-blue-400';
  };

  const getIconBackgroundClass = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      red: 'bg-red-100 text-red-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-blue-100 text-blue-600';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      case 'deadline':
      case 'reminder':
        return <Clock className="w-4 h-4" />;
      case 'task':
        return <Target className="w-4 h-4" />;
      case 'productivity':
        return <TrendingUp className="w-4 h-4" />;
      case 'achievement':
        return <Award className="w-4 h-4" />;
      case 'motivation':
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationTypeLabel = (type: string) => {
    switch (type) {
      case 'overdue':
        return 'Overdue';
      case 'deadline':
        return 'Deadline';
      case 'reminder':
        return 'Reminder';
      case 'task':
        return 'Task';
      case 'productivity':
        return 'Productivity';
      case 'achievement':
        return 'Achievement';
      case 'motivation':
        return 'Motivation';
      default:
        return 'Notification';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
                  <Target className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">All caught up! 🎉</h4>
                <p className="text-sm text-gray-500">No new notifications right now. Keep up the great work!</p>
              </div>
            ) : (
              <div className="py-2">
                {state.notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                      !notification.isRead 
                        ? `bg-blue-50 ${getBorderColorClass(notification.color)}` 
                        : getBorderColorClass(notification.color)
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        getIconBackgroundClass(notification.color)
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`text-sm font-medium truncate ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            notification.color === 'red' ? 'bg-red-100 text-red-700' :
                            notification.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                            notification.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                            notification.color === 'green' ? 'bg-green-100 text-green-700' :
                            notification.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {getNotificationTypeLabel(notification.type)}
                          </span>
                        </div>
                        
                        <p className="text-xs text-gray-600 truncate mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="text-gray-400">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          {notification.priority === 'high' && (
                            <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(notification.priority)}`}>
                              Urgent
                            </span>
                          )}
                          {notification.taskId && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                              Task
                            </span>
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
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