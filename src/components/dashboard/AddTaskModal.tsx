import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AddTaskModalProps {
  onSave: (task: any) => void;
  onClose: () => void;
  projects: any[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onSave, onClose, projects }) => {
  const { user } = useAuth();
  
  // Filter only active (non-archived) projects
  const activeProjects = projects.filter(project => !project.archived);
  
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    assignee: '',
    projectId: activeProjects.length > 0 ? activeProjects[0].id : '',
    status: 'Pending',
    statusColor: 'bg-purple-100 text-purple-800',
    priority: 'Medium',
    dueDate: '',
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: 'Pending', color: 'bg-purple-100 text-purple-800' },
    { value: 'In Progress', color: 'bg-green-100 text-green-800' },
    { value: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'On Hold', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Check if there are any active projects
    if (activeProjects.length === 0) {
      newErrors.general = 'You need to create at least one project before creating tasks';
      setErrors(newErrors);
      return false;
    }

    if (!newTask.name.trim()) {
      newErrors.name = 'Task name is required';
    }

    if (!newTask.assignee.trim()) {
      newErrors.assignee = 'Assignee is required';
    }

    if (!newTask.projectId) {
      newErrors.projectId = 'Project selection is required';
    }

    if (!newTask.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    // Validate due date is not in the past
    if (newTask.dueDate) {
      const selectedDate = new Date(newTask.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const statusOption = statusOptions.find(option => option.value === newTask.status);
    
    onSave({
      ...newTask,
      projectId: parseInt(newTask.projectId),
      statusColor: statusOption?.color || 'bg-gray-100 text-gray-800'
    });
  };

  const updateStatus = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status);
    setNewTask({
      ...newTask,
      status,
      statusColor: statusOption?.color || 'bg-gray-100 text-gray-800'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
              <p className="text-sm text-gray-500">Add a new task to your project</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* No Projects Warning */}
          {activeProjects.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-600 text-sm font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-medium text-yellow-800">No Projects Available</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You need to create at least one project before you can create tasks. 
                    Projects help organize your work and provide context for your tasks.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                  >
                    Go back and create a project first
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newTask.name}
              disabled={activeProjects.length === 0}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } ${activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter task name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newTask.description}
              disabled={activeProjects.length === 0}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={4}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="Enter task description"
            />
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              value={newTask.projectId}
              disabled={activeProjects.length === 0}
              onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.projectId ? 'border-red-300' : 'border-gray-300'
              } ${activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">{activeProjects.length === 0 ? 'No projects available' : 'Select a project'}</option>
              {activeProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>}
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={newTask.status}
                disabled={activeProjects.length === 0}
                onChange={(e) => updateStatus(e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={newTask.priority}
                disabled={activeProjects.length === 0}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                disabled={activeProjects.length === 0}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-300'
                } ${activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignee <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newTask.assignee}
              disabled={activeProjects.length === 0}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.assignee ? 'border-red-300' : 'border-gray-300'
              } ${activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter assignee name"
            />
            {errors.assignee && <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              value={newTask.tags.join(', ')}
              disabled={activeProjects.length === 0}
              onChange={(e) => setNewTask({ ...newTask, tags: e.target.value.split(', ').filter(tag => tag.trim()) })}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="Enter tags separated by commas (e.g., Design, Frontend, Urgent)"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={activeProjects.length === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeProjects.length === 0
                  ? 'text-gray-500 bg-gray-300 cursor-not-allowed'
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;