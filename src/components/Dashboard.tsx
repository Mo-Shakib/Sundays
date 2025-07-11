import { useState } from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';
import DashboardView from './dashboard/DashboardView';
import ProjectsView from './dashboard/ProjectsView';
import MyTasksView from './dashboard/MyTasksView';
import ProjectCompletionModal from './dashboard/ProjectCompletionModal';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('Dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [showProjectCompletionModal, setShowProjectCompletionModal] = useState(false);
  const [projectToComplete, setProjectToComplete] = useState<{ project: any; pendingTasks: any[] } | null>(null);

  // Use Supabase data hook
  const {
    projects,
    tasks,
    loading,
    error,
    addProject,
    updateProject,
    addTask,
    updateTask,
    deleteTask
  } = useSupabaseData();

  const handleAddProject = async (newProject: any) => {
    try {
      await addProject({
        name: newProject.name,
        description: newProject.description,
        color: newProject.color,
        dotColor: newProject.dotColor,
        archived: false
      });
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleArchiveProject = (projectId: number) => {
    // Get pending tasks for this project
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const pendingTasks = projectTasks.filter(task => task.status !== 'Completed');
    
    if (pendingTasks.length > 0) {
      // Show confirmation modal for projects with pending tasks
      setShowProjectCompletionModal(true);
      setProjectToComplete({ project: projects.find(p => p.id === projectId), pendingTasks });
    } else {
      // Archive project directly if no pending tasks
      completeProject(projectId);
    }
  };

  const completeProject = async (projectId: number) => {
    // Mark all pending tasks as completed
    const pendingProjectTasks = tasks.filter(task => 
      task.projectId === projectId && task.status !== 'Completed'
    );
    
    try {
      // Update all pending tasks to completed
      await Promise.all(
        pendingProjectTasks.map(task =>
          updateTask(task.id, {
            status: 'Completed',
            statusColor: 'bg-blue-100 text-blue-800'
          })
        )
      );
      
      // Archive the project
      await updateProject(projectId, { archived: true });
    } catch (error) {
      console.error('Error completing project:', error);
    }
    
    // If the archived project was selected, deselect it
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
    
    // Close modal
    setShowProjectCompletionModal(false);
    setProjectToComplete(null);
  };

  const handleUnarchiveProject = async (projectId: number) => {
    try {
      await updateProject(projectId, { archived: false });
    } catch (error) {
      console.error('Error unarchiving project:', error);
    }
  };

  const handleAddTask = async (newTask: any) => {
    try {
      await addTask({
        name: newTask.name,
        description: newTask.description,
        assignee: newTask.assignee,
        avatar: newTask.assignee.split(' ').map((n: string) => n[0]).join(''),
        avatarColor: `bg-${['blue', 'green', 'purple', 'orange', 'pink', 'indigo'][Math.floor(Math.random() * 6)]}-500`,
        projectId: newTask.projectId,
        status: newTask.status,
        statusColor: newTask.statusColor,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        tags: newTask.tags || [],
        comments: 0,
        files: 0
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (updatedTask: any) => {
    try {
      await updateTask(updatedTask.id, {
        name: updatedTask.name,
        description: updatedTask.description,
        assignee: updatedTask.assignee,
        avatar: updatedTask.avatar,
        avatarColor: updatedTask.avatarColor,
        projectId: updatedTask.projectId,
        status: updatedTask.status,
        statusColor: updatedTask.statusColor,
        priority: updatedTask.priority,
        dueDate: updatedTask.dueDate,
        tags: updatedTask.tags || [],
        comments: updatedTask.comments,
        files: updatedTask.files
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleProjectSelect = (projectId: number | null) => {
    setSelectedProjectId(projectId);
    setActiveView('Dashboard'); // Switch to dashboard when project is selected
  };

  const handleNavigateToMyTasks = () => {
    setActiveView('My Task');
  };

  const handleNavigateToProjects = () => {
    setActiveView('Projects');
  };
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            {error.includes('Database tables not found') ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                <p className="text-sm text-yellow-800 font-medium">Database Setup Required</p>
                <p className="text-sm text-yellow-700 mt-1">
                  The database tables need to be created. Please run the migration files in your Supabase dashboard.
                </p>
              </div>
            ) : error.includes('Supabase configuration missing') ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-left">
                <p className="text-sm text-blue-800 font-medium">Supabase Connection Required</p>
                <p className="text-sm text-blue-700 mt-1">
                  Please connect to Supabase using the "Connect to Supabase" button in the top right.
                </p>
              </div>
            ) : (
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  const renderContent = () => {
    switch (activeView) {
      case 'Projects':
        return (
          <ProjectsView 
            projects={projects}
            tasks={tasks}
            onProjectSelect={handleProjectSelect}
            onArchiveProject={handleArchiveProject}
            onAddProject={handleAddProject}
          />
        );
      case 'My Task':
        return (
          <MyTasksView 
            tasks={tasks}
            projects={projects}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onNavigateToProjects={handleNavigateToProjects}
          />
        );
      default:
        return (
          <DashboardView 
            selectedProjectId={selectedProjectId}
            projects={projects}
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onNavigateToMyTasks={handleNavigateToMyTasks}
            onNavigateToProjects={handleNavigateToProjects}
            onArchiveProject={handleArchiveProject}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        projects={projects}
        onAddProject={handleAddProject}
        selectedProjectId={selectedProjectId}
        onProjectSelect={handleProjectSelect}
        activeView={activeView}
        onViewChange={setActiveView}
        onArchiveProject={handleArchiveProject}
        onUnarchiveProject={handleUnarchiveProject}
      />
      
      {/* Project Completion Modal */}
      {showProjectCompletionModal && projectToComplete && (
        <ProjectCompletionModal
          project={projectToComplete.project}
          pendingTasks={projectToComplete.pendingTasks}
          onConfirm={() => completeProject(projectToComplete.project.id)}
          onCancel={() => {
            setShowProjectCompletionModal(false);
            setProjectToComplete(null);
          }}
        />
      )}
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          setSidebarOpen={setSidebarOpen}
          projects={projects}
          tasks={tasks}
          onProjectSelect={handleProjectSelect}
          onTaskSelect={() => {
            // For now, navigate to My Task view when a task is selected
            // This could be enhanced to open a task modal in the future
            setActiveView('My Task');
          }}
          onViewChange={setActiveView}
        />
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;