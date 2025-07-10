@@ .. @@
 import React, { useState } from 'react';
 import Sidebar from './dashboard/Sidebar';
 import Header from './dashboard/Header';
 import MainContent from './dashboard/MainContent';

 const Dashboard = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);
+  const [projects, setProjects] = useState([
+    { 
+      id: 1,
+      name: 'Event Planning', 
+      description: 'Planning and organizing company events and team activities',
+      color: 'bg-pink-200', 
+      dotColor: 'bg-pink-500' 
+    },
+    { 
+      id: 2,
+      name: 'Breakfast Plan', 
+      description: 'Weekly breakfast menu planning and coordination',
+      color: 'bg-green-200', 
+      dotColor: 'bg-green-500' 
+    },
+  ]);
+
+  const handleAddProject = (newProject: any) => {
+    const project = {
+      ...newProject,
+      id: Date.now()
+    };
+    setProjects([...projects, project]);
+  };

   return (
     <div className="min-h-screen bg-gray-50 flex">
-      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
+      <Sidebar 
+        sidebarOpen={sidebarOpen} 
+        setSidebarOpen={setSidebarOpen}
+        projects={projects}
+        onAddProject={handleAddProject}
+      />
       
       <div className="flex-1 flex flex-col min-w-0">
        <Header 
          setSidebarOpen={setSidebarOpen}
          onNewProject={() => {
            // This will trigger the sidebar's add project modal
            // We can implement this by passing a ref or state up
          }}
        />
         <MainContent />
       </div>
     </div>
   );
 };