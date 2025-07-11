import React, { useState } from 'react';
import { X, Plus, Calendar, Tag, Sparkles } from 'lucide-react';
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
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    assignee: '',
    projectId: activeProjects.length > 0 ? activeProjects[0].id : '',
    status: 'Pending',
    statusColor: 'bg-purple-100 text-purple-800',
    priority: 'Medium',
    dueDate: getTodayDate(),
    tags: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentTag, setCurrentTag] = useState('');

  const statusOptions = [
    { value: 'Pending', color: 'bg-purple-100 text-purple-800' },
    { value: 'In Progress', color: 'bg-green-100 text-green-800' },
    { value: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'On Hold', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];

  // Due date preset options
  const getDueDatePresets = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Calculate next Sunday
    const nextSunday = new Date(today);
    const daysUntilSunday = (7 - today.getDay()) % 7; // 0 for Sunday, 1 for Monday, etc.
    // If today is Sunday, get next Sunday (7 days ahead)
    const daysToAdd = daysUntilSunday === 0 ? 7 : daysUntilSunday;
    nextSunday.setDate(today.getDate() + daysToAdd);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    return [
      {
        label: 'Today',
        value: today.toISOString().split('T')[0],
        description: today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      },
      {
        label: 'Tomorrow',
        value: tomorrow.toISOString().split('T')[0],
        description: tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      },
      {
        label: 'Next Week',
        value: nextSunday.toISOString().split('T')[0],
        description: nextSunday.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      },
      {
        label: 'Next Month',
        value: nextMonth.toISOString().split('T')[0],
        description: nextMonth.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
      }
    ];
  };

  const dueDatePresets = getDueDatePresets();

  // Tag management functions
  const addTag = () => {
    const tag = currentTag.trim();
    if (tag && !newTask.tags.includes(tag)) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, tag]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

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
    
    // Validate due date is not in the past (except today)
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

  const setDueDate = (date: string) => {
    setNewTask({ ...newTask, dueDate: date });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Create Something Amazing</h2>
              <p className="text-xs md:text-sm text-gray-500">Turn your ideas into actionable tasks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* No Projects Warning */}
          {activeProjects.length === 0 && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800">Ready to Start Your First Project?</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Every great achievement starts with a well-organized project! 
                    Create your first project to begin organizing your tasks and turning your vision into reality.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900 underline decoration-2 underline-offset-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Let's create your first project
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What needs to be done? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newTask.name}
              disabled={activeProjects.length === 0}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base shadow-sm hover:bg-gray-50 transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              } ${activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="e.g., Design the homepage mockup"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Details</label>
            <textarea
              value={newTask.description}
              disabled={activeProjects.length === 0}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              rows={3}
              className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base shadow-sm hover:bg-gray-50 transition-colors resize-none ${
                activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              placeholder="Add any extra context, requirements, or notes that will help complete this task..."
            />
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Which project does this belong to? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={newTask.projectId}
                disabled={activeProjects.length === 0}
                onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                className={`appearance-none w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pr-10 ${
                  errors.projectId ? 'border-red-300' : 'border-gray-200'
                } ${activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">{activeProjects.length === 0 ? 'No projects available' : 'Choose your project'}</option>
                {activeProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>}
          </div>

          {/* Due Date with Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When should this be completed? <span className="text-red-500">*</span>
            </label>
            
            {/* Quick Date Presets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              {dueDatePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setDueDate(preset.value)}
                  disabled={activeProjects.length === 0}
                  className={`p-2.5 text-xs md:text-sm rounded-xl border transition-all shadow-sm ${
                    newTask.dueDate === preset.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-blue-100'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  } ${activeProjects.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="font-medium">{preset.label}</div>
                  <div className="text-xs text-gray-500">{preset.description}</div>
                </button>
              ))}
            </div>

            {/* Custom Date Picker */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={newTask.dueDate}
                disabled={activeProjects.length === 0}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full pl-10 pr-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base shadow-sm hover:bg-gray-50 transition-colors ${
                  errors.dueDate ? 'border-red-300' : 'border-gray-200'
                } ${activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
              <div className="relative">
                <select
                  value={newTask.status}
                  disabled={activeProjects.length === 0}
                  onChange={(e) => updateStatus(e.target.value)}
                  className={`appearance-none w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pr-10 ${
                    activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How important is this?</label>
              <div className="relative">
                <select
                  value={newTask.priority}
                  disabled={activeProjects.length === 0}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className={`appearance-none w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pr-10 ${
                    activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority} Priority
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who's taking ownership of this? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newTask.assignee}
              disabled={activeProjects.length === 0}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base shadow-sm hover:bg-gray-50 transition-colors ${
                errors.assignee ? 'border-red-300' : 'border-gray-200'
              } ${activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter the champion for this task"
            />
            {errors.assignee && <p className="mt-1 text-sm text-red-600">{errors.assignee}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="inline w-4 h-4 mr-1" />
              Add Tags (Optional)
            </label>
            
            {/* Tag Input */}
            <div className="flex space-x-2 mb-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={currentTag}
                  disabled={activeProjects.length === 0}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className={`w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base shadow-sm hover:bg-gray-50 transition-colors ${
                    activeProjects.length === 0 ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="e.g., urgent, frontend, research"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                disabled={activeProjects.length === 0 || !currentTag.trim()}
                className="px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Add
              </button>
            </div>

            {/* Display Tags */}
            {newTask.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {newTask.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full shadow-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500">
              Tags help you organize and find tasks quickly. Press Enter or comma to add.
            </p>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 md:pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              Maybe Later
            </button>
            <button
              type="submit"
              disabled={activeProjects.length === 0}
              className={`w-full sm:w-auto px-6 py-2.5 text-sm font-medium rounded-xl transition-all shadow-sm ${
                activeProjects.length === 0
                  ? 'text-gray-500 bg-gray-300 cursor-not-allowed'
                  : 'text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-200'
              }`}
            >
              <span className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Task
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;