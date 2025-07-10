import React from 'react';
import { X, FolderPlus, AlertTriangle } from 'lucide-react';

interface NoProjectsModalProps {
  onClose: () => void;
  onCreateProject: () => void;
}

const NoProjectsModal: React.FC<NoProjectsModalProps> = ({ onClose, onCreateProject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Project Required</h2>
              <p className="text-sm text-gray-500">Create a project to organize your tasks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-orange-800">No Projects Found</h3>
                  <p className="text-sm text-orange-700 mt-1">
                    You need to create at least one project before you can create tasks. 
                    Projects help organize your work and provide context for your tasks.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Why do I need a project?</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Projects help organize related tasks together</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Track progress and completion rates by project</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Better collaboration and task assignment</span>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Improved workflow and productivity tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreateProject}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoProjectsModal;