import React, { useState } from 'react';
import { X, Plus, FolderOpen } from 'lucide-react';

interface AddProjectModalProps {
  onSave: (project: any) => void;
  onClose: () => void;
}

const AddProjectModal: React.FC<AddProjectModalProps> = ({ onSave, onClose }) => {
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    color: 'bg-pink-200',
    dotColor: 'bg-pink-500'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const colorOptions = [
    { name: 'Pink', color: 'bg-pink-200', dotColor: 'bg-pink-500' },
    { name: 'Green', color: 'bg-green-200', dotColor: 'bg-green-500' },
    { name: 'Blue', color: 'bg-blue-200', dotColor: 'bg-blue-500' },
    { name: 'Purple', color: 'bg-purple-200', dotColor: 'bg-purple-500' },
    { name: 'Orange', color: 'bg-orange-200', dotColor: 'bg-orange-500' },
    { name: 'Yellow', color: 'bg-yellow-200', dotColor: 'bg-yellow-500' },
    { name: 'Indigo', color: 'bg-indigo-200', dotColor: 'bg-indigo-500' },
    { name: 'Red', color: 'bg-red-200', dotColor: 'bg-red-500' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newProject.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!newProject.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(newProject);
  };

  const selectColor = (colorOption: any) => {
    setNewProject({
      ...newProject,
      color: colorOption.color,
      dotColor: colorOption.dotColor
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
              <p className="text-sm text-gray-500">Add a new project to your workspace</p>
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
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter project name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter project description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Project Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption.name}
                  type="button"
                  onClick={() => selectColor(colorOption)}
                  className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    newProject.color === colorOption.color
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-full h-8 rounded-md ${colorOption.color} flex items-center justify-center`}>
                    <div className={`w-3 h-3 rounded-full ${colorOption.dotColor}`}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 text-center">{colorOption.name}</p>
                  {newProject.color === colorOption.color && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-3 ${newProject.dotColor}`}></span>
                <span className="text-sm font-medium text-gray-900">
                  {newProject.name || 'Project Name'}
                </span>
              </div>
              {newProject.description && (
                <p className="text-xs text-gray-500 mt-1 ml-5">{newProject.description}</p>
              )}
            </div>
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
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;