import React, { useState } from 'react';
import { X, Edit, Trash2, Calendar, User, Flag, Tag } from 'lucide-react';

interface TaskModalProps {
  task: any;
  projects: any[];
  onSave: (task: any) => void;
  onDelete: (taskId: number) => void;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, projects, onSave, onDelete, onClose }) => {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const updatedTask = {
      ...editedTask,
      projectId: parseInt(editedTask.projectId)
    };
    onSave(updatedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const statusOptions = [
    { value: 'Pending', color: 'bg-purple-100 text-purple-800' },
    { value: 'In Progress', color: 'bg-green-100 text-green-800' },
    { value: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'On Hold', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  const updateStatus = (newStatus: string) => {
    const statusOption = statusOptions.find(option => option.value === newStatus);
    setEditedTask({
      ...editedTask,
      status: newStatus,
      statusColor: statusOption?.color || 'bg-gray-100 text-gray-800'
    });
  };

  // Get project name by ID
  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
              <p className="text-sm text-gray-500">ID: #{task.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.name}
                onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <h3 className="text-lg font-semibold text-gray-900">{editedTask.name}</h3>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            {isEditing ? (
              <textarea
                value={editedTask.description}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-600">{editedTask.description}</p>
            )}
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            {isEditing ? (
              <select
                value={editedTask.projectId}
                onChange={(e) => setEditedTask({ ...editedTask, projectId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {projects.filter(project => !project.archived).map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-gray-900">{getProjectName(editedTask.projectId)}</span>
            )}
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Assignee
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.assignee}
                  onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${editedTask.avatarColor}`}>
                    {editedTask.avatar}
                  </div>
                  <span className="ml-3 text-gray-900">{editedTask.assignee}</span>
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              {isEditing ? (
                <select
                  value={editedTask.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${editedTask.statusColor}`}>
                  {editedTask.status}
                </span>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Flag className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              {isEditing ? (
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  editedTask.priority === 'High' ? 'bg-red-100 text-red-800' :
                  editedTask.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {editedTask.priority}
                </span>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <span className="text-gray-900">
                  {editedTask.dueDate ? new Date(editedTask.dueDate).toLocaleDateString() : 'No due date'}
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.tags?.join(', ') || ''}
                onChange={(e) => setEditedTask({ ...editedTask, tags: e.target.value.split(', ').filter(tag => tag.trim()) })}
                placeholder="Enter tags separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {editedTask.tags?.map((tag: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{editedTask.comments}</div>
              <div className="text-sm text-gray-500">Comments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{editedTask.files}</div>
              <div className="text-sm text-gray-500">Files</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;