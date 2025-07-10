import React, { useState } from 'react';
import { FolderOpen, Users, Calendar, BarChart3, Plus } from 'lucide-react';
import AddProjectModal from './AddProjectModal';

interface ProjectsViewProps {
  projects: any[];
  tasks: any[];
  onProjectSelect: (projectId: number) => void;
  onArchiveProject: (projectId: number) => void;
  onAddProject: (project: any) => void;
}

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, tasks, onProjectSelect, onArchiveProject, onAddProject }) => {
  const [showArchived, setShowArchived] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  
  // Filter projects based on archived status
  const activeProjects = projects.filter(project => !project.archived);
  const archivedProjects = projects.filter(project => project.archived);
  const displayProjects = showArchived ? archivedProjects : activeProjects;
  
  // Get project statistics
  const getProjectStats = (projectId: number) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const completedTasks = projectTasks.filter(task => task.status === 'Completed');
    const inProgressTasks = projectTasks.filter(task => task.status === 'In Progress');
    const pendingTasks = projectTasks.filter(task => task.status === 'Pending');
    
    return {
      total: projectTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      pending: pendingTasks.length,
      completionRate: projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0
    };
  };

  // Get unique assignees for a project
  const getProjectAssignees = (projectId: number) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const uniqueAssignees = [...new Set(projectTasks.map(task => task.assignee))];
    return uniqueAssignees.slice(0, 3); // Show max 3 assignees
  };

  // Get next due date for a project
  const getNextDueDate = (projectId: number) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId && task.status !== 'Completed');
    if (projectTasks.length === 0) return null;
    
    const sortedTasks = projectTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return sortedTasks[0].dueDate;
  };

  const handleAddProject = (newProject: any) => {
    onAddProject(newProject);
    setShowAddProjectModal(false);
  };

  return (
    <>
      <main className="flex-1 p-4 md:p-6 overflow-auto">
      {/* Header Section */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage and track all your projects</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              onClick={() => setShowAddProjectModal(true)}
              className="flex items-center justify-center px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
            <select 
              value={showArchived ? 'archived' : 'active'}
              onChange={(e) => setShowArchived(e.target.value === 'archived')}
              className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active Projects</option>
              <option value="archived">Completed Projects</option>
            </select>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="ml-2 md:ml-3">
                <p className="text-xs md:text-sm text-gray-500">Total Projects</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{activeProjects.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="ml-2 md:ml-3">
                <p className="text-xs md:text-sm text-gray-500">Active Projects</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{activeProjects.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div className="ml-2 md:ml-3">
                <p className="text-xs md:text-sm text-gray-500">Total Tasks</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 md:w-6 md:h-6 text-orange-600" />
              </div>
              <div className="ml-2 md:ml-3">
                <p className="text-xs md:text-sm text-gray-500">Completed Tasks</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'Completed').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {displayProjects.map((project) => {
          const stats = getProjectStats(project.id);
          const assignees = getProjectAssignees(project.id);
          const nextDueDate = getNextDueDate(project.id);
          
          return (
            <div 
              key={project.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow relative group ${
                project.archived ? 'opacity-75' : ''
              }`}
            >
              {/* Archive/Unarchive Button */}
              {!showArchived && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchiveProject(project.id);
                  }}
                  className="absolute top-3 right-3 md:top-4 md:right-4 md:opacity-0 md:group-hover:opacity-100 px-2 py-1 md:px-3 md:py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all shadow-sm"
                  title="Complete project"
                >
                  Complete
                </button>
              )}
              
              {/* Project Header */}
              <div 
                className="flex items-start justify-between mb-3 md:mb-4 cursor-pointer"
                onClick={() => onProjectSelect(project.id)}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${project.color}`}>
                    <FolderOpen className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-base md:text-lg font-semibold text-gray-900 ${project.archived ? 'line-through' : ''}`}>
                      {project.name}
                    </h3>
                    <span className={`w-2 h-2 rounded-full ${project.dotColor} inline-block`}></span>
                  </div>
                </div>
              </div>

              {/* Project Description */}
              <div 
                className="cursor-pointer"
                onClick={() => onProjectSelect(project.id)}
              >
                <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-2">{project.description}</p>

                {/* Project Stats */}
                <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-900">{stats.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{stats.total}</div>
                      <div className="text-gray-500">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{stats.completed}</div>
                      <div className="text-gray-500">Done</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{stats.inProgress}</div>
                      <div className="text-gray-500">Active</div>
                    </div>
                  </div>
                </div>

                {/* Project Team */}
                {assignees.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {assignees.map((assignee, index) => (
                          <div 
                            key={index}
                            className="w-6 h-6 md:w-8 md:h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                          >
                            {assignee.split(' ').map(n => n[0]).join('')}
                          </div>
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        {assignees.length} member{assignees.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {nextDueDate && (
                      <div className="text-xs text-gray-500">
                        Due: {new Date(nextDueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {project.archived && (
                <div className="mt-3 md:mt-4 p-2 bg-gray-100 rounded-lg text-center">
                  <span className="text-xs text-gray-600 font-medium">✓ Project Completed</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Add New Project Card */}
        {!showArchived && (
          <div 
            onClick={() => setShowAddProjectModal(true)}
            className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-4 md:p-6 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer group min-h-[200px]"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 group-hover:bg-blue-200 rounded-lg flex items-center justify-center mb-3 transition-colors">
              <Plus className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-base md:text-lg font-medium text-gray-600 group-hover:text-blue-600 mb-1 transition-colors text-center">Create New Project</h3>
            <p className="text-xs md:text-sm text-gray-500 group-hover:text-blue-500 text-center transition-colors">Start a new project to organize your tasks</p>
          </div>
        )}
      </div>
      </main>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <AddProjectModal
          onSave={handleAddProject}
          onClose={() => setShowAddProjectModal(false)}
        />
      )}
    </>
  );
};

export default ProjectsView;