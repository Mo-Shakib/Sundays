import React from 'react';
import { 
  X, 
  BarChart3, 
  Home, 
  FolderOpen, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  Receipt, 
  Settings,
  Plus
} from 'lucide-react';
import AddProjectModal from './AddProjectModal';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  projects: any[];
  onAddProject: (project: any) => void;
  selectedProjectId: number | null;
  onProjectSelect: (projectId: number | null) => void;
  activeView: string;
  onViewChange: (view: string) => void;
  onArchiveProject: (projectId: number) => void;
  onUnarchiveProject: (projectId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  projects, 
  onAddProject,
  selectedProjectId,
  onProjectSelect,
  activeView,
  onViewChange,
  onArchiveProject,
  onUnarchiveProject
}) => {
  const [showAddProjectModal, setShowAddProjectModal] = React.useState(false);
  const [showCompletedProjects, setShowCompletedProjects] = React.useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: Home, href: '#' },
    { name: 'Projects', icon: FolderOpen, href: '#' },
    { name: 'My Task', icon: CheckSquare, href: '#' }
  ];

  const handleAddProject = (newProject: any) => {
    onAddProject(newProject);
  };

  const handleMenuItemClick = (itemName: string) => {
    onViewChange(itemName);
    // Close sidebar on mobile when menu item is clicked
    setSidebarOpen(false);
  };

  const handleProjectSelect = (projectId: number | null) => {
    onProjectSelect(projectId);
    // Close sidebar on mobile when project is selected
    setSidebarOpen(false);
  };

  // Filter active and archived projects
  const activeProjects = projects.filter(project => !project.archived);
  const archivedProjects = projects.filter(project => project.archived);

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Sundays</span>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuItemClick(item.name)}
                className={`group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  activeView === item.name
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  activeView === item.name ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {item.name}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <div className="px-3 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Active Projects
              </h3>
            </div>
            <div className="space-y-2">
              {/* All Projects option - at the top */}
              <button
                onClick={() => handleProjectSelect(null)}
                className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedProjectId === null
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full mr-3 bg-gray-400"></span>
                All Projects
              </button>
              
              {activeProjects.map((project) => (
                <button
                  key={project.name}
                  onClick={() => handleProjectSelect(project.id)}
                  className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedProjectId === project.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-3 ${project.dotColor}`}></span>
                  {project.name}
                </button>
              ))}
            </div>
          </div>

          {/* Completed Projects Section */}
          {archivedProjects.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowCompletedProjects(!showCompletedProjects)}
                className="flex items-center justify-between w-full px-3 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
              >
                <span>Completed ({archivedProjects.length})</span>
                <span className={`transform transition-transform ${showCompletedProjects ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {showCompletedProjects && (
                <div className="space-y-2">
                  {archivedProjects.map((project) => (
                    <div key={project.id} className="group relative">
                      <button
                        onClick={() => handleProjectSelect(project.id)}
                        className={`group flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors opacity-60 ${
                          selectedProjectId === project.id
                            ? 'bg-gray-100 text-gray-700'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mr-3 ${project.dotColor} opacity-50`}></span>
                        <span className="line-through">{project.name}</span>
                      </button>
                      
                      {/* Unarchive button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUnarchiveProject(project.id);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                        title="Restore project"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              className="group flex items-center w-full px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Settings
            </button>
          </div>
        </nav>

      </div>
    </>
  );
};

export default Sidebar;