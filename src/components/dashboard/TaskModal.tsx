import React, { useState } from 'react';
import { X, Edit, Trash2, Calendar, User, Flag, Tag, Clock, AlertTriangle } from 'lucide-react';

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

  // Calculate days remaining and get styling/message
  const getDaysRemainingInfo = () => {
    if (!editedTask.dueDate) {
      return {
        days: null,
        label: 'No Due Date',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
        message: 'Set a due date to track progress',
        icon: Calendar
      };
    }

    const today = new Date();
    const dueDate = new Date(editedTask.dueDate);
    
    // Reset time to compare only dates
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      // Overdue
      const overdueDays = Math.abs(daysDiff);
      return {
        days: overdueDays,
        label: `${overdueDays} Day${overdueDays > 1 ? 's' : ''} Overdue`,
        bgColor: 'bg-red-600',
        textColor: 'text-white',
        message: overdueDays === 1 
          ? "Time to prioritize! This task needs immediate attention."
          : `${overdueDays} days behind schedule. Let's catch up and get back on track!`,
        icon: AlertTriangle
      };
    } else if (daysDiff === 0) {
      // Due today
      return {
        days: 0,
        label: 'Due Today',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        message: "Today's the day! Focus and finish strong.",
        icon: Clock
      };
    } else if (daysDiff === 1) {
      // Due tomorrow
      return {
        days: 1,
        label: 'Due Tomorrow',
        bgColor: 'bg-yellow-500',
        textColor: 'text-white',
        message: "Tomorrow's deadline is approaching. Time to wrap this up!",
        icon: Clock
      };
    } else if (daysDiff === 2) {
      // Due in 2 days
      return {
        days: 2,
        label: '2 Days Left',
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        message: "Getting close to the deadline. Stay focused!",
        icon: Clock
      };
    } else {
      // 3+ days
      return {
        days: daysDiff,
        label: `${daysDiff} Days Left`,
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        message: daysDiff <= 7 
          ? "Good timing! You have some runway to deliver quality work."
          : "Plenty of time to plan and execute perfectly.",
        icon: Clock
      };
    }
  };

  const daysInfo = getDaysRemainingInfo();
  const IconComponent = daysInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm sm:text-lg">📋</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Task Details</h2>
              <p className="text-xs sm:text-sm text-gray-500">ID: #{task.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Days Remaining Section - At Top */}
          <div className={`p-4 sm:p-6 rounded-xl ${daysInfo.bgColor} ${daysInfo.textColor}`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xl sm:text-2xl font-bold">{daysInfo.label}</div>
                <div className="text-xs sm:text-sm opacity-90">
                  {editedTask.dueDate && new Date(editedTask.dueDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-white bg-opacity-10 rounded-lg">
              <p className="text-xs sm:text-sm font-medium opacity-95">
                💡 {daysInfo.message}
              </p>
            </div>
          </div>

          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedTask.name}
                onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            ) : (
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{editedTask.name}</h3>
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
              />
            ) : (
              <p className="text-gray-600 text-sm sm:text-base break-words">{editedTask.description || 'No description provided'}</p>
            )}
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
            {isEditing ? (
              <select
                value={editedTask.projectId}
                onChange={(e) => setEditedTask({ ...editedTask, projectId: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              >
                {projects.filter(project => !project.archived).map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-gray-900 text-sm sm:text-base">{getProjectName(editedTask.projectId)}</span>
            )}
          </div>

          {/* Task Details Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Assignee */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <User className="w-4 h-4 inline mr-1" />
                Assignee
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTask.assignee}
                  onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              ) : (
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${editedTask.avatarColor} flex-shrink-0`}>
                    {editedTask.avatar}
                  </div>
                  <span className="ml-3 text-gray-900 text-sm sm:text-base truncate">{editedTask.assignee}</span>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Status</label>
              {isEditing ? (
                <select
                  value={editedTask.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium ${editedTask.statusColor}`}>
                  {editedTask.status}
                </span>
              )}
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Flag className="w-4 h-4 inline mr-1" />
                Priority
              </label>
              {isEditing ? (
                <select
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  editedTask.priority === 'High' || editedTask.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                  editedTask.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {editedTask.priority}
                </span>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline mr-1" />
                Due Date
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              ) : (
                <span className="text-gray-900 text-sm sm:text-base">
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {editedTask.tags?.length > 0 ? (
                  editedTask.tags.map((tag: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No tags added</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer - Sticky for mobile */}
        {isEditing && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-6 rounded-b-xl">
            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;