import React from 'react';
import { X } from 'lucide-react';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Notification List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New task assigned</p>
                  <p className="text-xs text-gray-500 mt-1">Website Redesign - 2 minutes ago</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Project completed</p>
                  <p className="text-xs text-gray-500 mt-1">Database Migration - 1 hour ago</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Team meeting reminder</p>
                  <p className="text-xs text-gray-500 mt-1">Daily standup in 30 minutes</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New comment added</p>
                  <p className="text-xs text-gray-500 mt-1">Mobile App Design - 3 hours ago</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Deadline approaching</p>
                  <p className="text-xs text-gray-500 mt-1">API Documentation - Due tomorrow</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;