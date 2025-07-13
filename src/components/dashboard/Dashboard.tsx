import React, { useState } from 'react';
import Sidebar from './dashboard/Sidebar';
import Header from './dashboard/Header';
import MainContent from './dashboard/MainContent';
import { useTaskNotifications } from '../../hooks/useTaskNotifications';
import { useSupabaseData } from '../../hooks/useSupabaseData';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use the enhanced data hook that includes collaborative projects and tasks
  const { 
    projects, 
    tasks, 
    loading, 
    error,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    refreshData
  } = useSupabaseData();
  
  // Add this hook to enable task notifications
  useTaskNotifications(tasks);

  return (
     <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        projects={projects}
        onAddProject={addProject}
      />
       
       <div className="flex-1 flex flex-col min-w-0">
        <Header 
          setSidebarOpen={setSidebarOpen}
          projects={projects}
          tasks={tasks}
          onRefreshData={refreshData}
          onNewProject={() => {
            // This will trigger the sidebar's add project modal
            // We can implement this by passing a ref or state up
          }}
        />
         <MainContent 
           projects={projects}
           tasks={tasks}
           loading={loading}
           error={error}
           onAddProject={addProject}
           onUpdateProject={updateProject}
           onDeleteProject={deleteProject}
           onAddTask={addTask}
           onUpdateTask={updateTask}
           onDeleteTask={deleteTask}
           onRefreshData={refreshData}
         />
       </div>
     </div>
   );
 };

 export default Dashboard;