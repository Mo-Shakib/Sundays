import React from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';

interface ProjectCompletionModalProps {
  project: any;
  pendingTasks: any[];
  onConfirm: () => void;
  onCancel: () => void;
}

const ProjectCompletionModal: React.FC<ProjectCompletionModalProps> = ({
  project,
  pendingTasks,
  onConfirm,
  onCancel
}) => {
  const hasPendingTasks = pendingTasks.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              hasPendingTasks ? 'bg-orange-100' : 'bg-green-100'
            }`}>
              {hasPendingTasks ? (
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {hasPendingTasks ? 'Complete Project with Pending Tasks?' : 'Complete Project'}
              </h2>
              <p className="text-sm text-gray-500">{project.name}</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {hasPendingTasks ? (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-orange-800">Warning: Incomplete Tasks</h3>
                    <p className="text-sm text-orange-700 mt-1">
                      This project has {pendingTasks.length} task{pendingTasks.length > 1 ? 's' : ''} that {pendingTasks.length > 1 ? 'are' : 'is'} not completed yet.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Pending Tasks:</h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{task.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.statusColor}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>What happens if you continue:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• All pending tasks will be marked as completed</li>
                  <li>• The project will be archived</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-800">Ready to Complete</h3>
                    <p className="text-sm text-green-700 mt-1">
                      All tasks in this project have been completed. You can safely archive this project.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
              hasPendingTasks
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {hasPendingTasks ? 'Complete All & Archive' : 'Archive Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCompletionModal;