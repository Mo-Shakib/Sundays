import React, { useState } from 'react';
import { Plus, Share, Filter, MoreHorizontal, Calendar, StickyNote, Clock, Users, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TaskModal from './TaskModal';
import AddTaskModal from './AddTaskModal';
import InvitationsInbox from './InvitationsInbox';

interface MainContentProps {
  projects: any[];
  tasks: any[];
  loading: boolean;
  error: string | null;
  onAddProject: (project: any) => Promise<void>;
  onUpdateProject: (project: any) => Promise<void>;
  onDeleteProject: (projectId: number) => Promise<void>;
  onAddTask: (task: any) => Promise<void>;
  onUpdateTask: (task: any) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

const MainContent: React.FC<MainContentProps> = ({ 
  projects: availableProjects,
  tasks: allTasks,
  loading,
  error,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onRefreshData
}) => {
  const { user } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  
  const [scheduleItems] = useState([
    {
      id: 1,
      title: 'Kickoff Meeting',
      time: '01:00 PM to 02:30 PM',
      attendees: [
        { name: 'John', avatar: 'J', color: 'bg-blue-500' },
        { name: 'Sarah', avatar: 'S', color: 'bg-purple-500' }
      ]
    },
    {
      id: 2,
      title: 'Create Wordpress website for event Registration',
      time: '04:00 PM to 02:30 PM',
      attendees: [
        { name: 'Mike', avatar: 'M', color: 'bg-green-500' },
        { name: 'Lisa', avatar: 'L', color: 'bg-orange-500' }
      ]
    },
    {
      id: 3,
      title: 'Create User flow for hotel booking',
      time: '05:00 PM to 02:30 PM',
      attendees: [
        { name: 'Alex', avatar: 'A', color: 'bg-pink-500' },
        { name: 'Emma', avatar: 'E', color: 'bg-indigo-500' }
      ]
    }
  ]);

  const [notes, setNotes] = useState([
    { id: 1, text: 'Landing Page For Website', description: 'To get started on a landing page, could you provide a bit more detail about its purpose?', completed: false },
    { id: 2, text: 'Fixing icons with dark backgrounds', description: 'Use icons that are easily recognizable and straightforward. Avoid overly complex designs that might confuse users', completed: false },
    { id: 3, text: 'Discussion regarding userflow improvement', description: "What's the main goal of the landing page? (e.g., lead generation, product)", completed: true }
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Filter tasks based on selected project
  const filteredTasks = selectedProjectId 
    ? allTasks.filter(task => task.project_id === selectedProjectId)
    : allTasks;

  // Get selected project name for display
  const selectedProjectName = selectedProjectId 
    ? availableProjects.find(p => p.id === selectedProjectId)?.name || 'Unknown Project'
    : 'All Projects';

  const toggleNote = (id: number) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleAddTask = () => {
    setShowAddTaskModal(true);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      await onUpdateTask(updatedTask);
      setShowTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      await onAddTask(newTask);
      setShowAddTaskModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await onDeleteTask(taskId);
      setShowTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      if (task) {
        await onUpdateTask({ ...task, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  // Calculate days remaining for a task
  const getDaysRemaining = (dueDate: string) => {
    if (!dueDate) {
      return { text: 'No due date', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
    
    const today = new Date();
    const due = new Date(dueDate);
    
    // Check if date is valid
    if (isNaN(due.getTime())) {
      return { text: 'Invalid date', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else if (diffDays <= 3) {
      return { text: `${diffDays} days left`, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else {
      return { text: `${diffDays} days left`, color: 'text-green-600', bgColor: 'bg-green-50' };
    }
  };

  // Get project name by ID
  const getProjectName = (projectId: number) => {
    const project = availableProjects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  // Calculate time saved based on completed tasks
  const calculateTimeSaved = () => {
    const completedTasks = allTasks.filter(task => task.status === 'Completed');
    let totalHoursSaved = 0;

    completedTasks.forEach(task => {
      const dueDate = new Date(task.due_date);
      const today = new Date();
      
      // If task was completed before due date, calculate time saved
      if (today <= dueDate) {
        const daysEarly = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        // Assume each day early saves 2 hours of rush work
        totalHoursSaved += Math.max(0, daysEarly * 2);
      }
    });

    return totalHoursSaved;
  };

  const weekDays = [
    { day: 'Tu', date: '16' },
    { day: 'We', date: '17', active: true },
    { day: 'Th', date: '18' },
    { day: 'Fr', date: '19' },
    { day: 'Sa', date: '20' },
    { day: 'Su', date: '14' }
  ];

  // Get current date and format it
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  if (loading) {
    return (
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 p-6 overflow-auto">
        {/* Invitations Inbox */}
        <InvitationsInbox onRefreshData={onRefreshData} />

        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-gray-500">{getCurrentDate()}</p>
              <h1 className="text-3xl font-bold text-gray-900">{getGreeting()} {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]},</h1>
              {selectedProjectId && (
                <p className="text-lg text-blue-600 mt-1">Viewing: {selectedProjectName}</p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share className="w-4 h-4 mr-2" />
                Share
              </button>
              <button 
                onClick={handleAddTask}
                className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-semibold text-gray-900">{calculateTimeSaved()}hrs</span>
              <span className="ml-1">Time Saved</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-900">{allTasks.filter(t => t.status === 'Completed').length}</span>
              <span className="ml-1">Tasks Completed</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-900">{allTasks.filter(t => t.status === 'In Progress').length}</span>
              <span className="ml-1">Tasks In-progress</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedProjectId ? `${selectedProjectName} Tasks` : 'My Tasks'}
                    </h3>
                    <select className="ml-4 text-sm text-gray-600 border border-gray-300 rounded px-2 py-1">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>All Time</option>
                    </select>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">See All</button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task Name
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assignee
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-6 text-center">
                          <div className="text-gray-500">
                            <p className="text-lg font-medium">No tasks found</p>
                            <p className="text-sm">
                              {selectedProjectId 
                                ? `No tasks in ${selectedProjectName} project yet.`
                                : 'No tasks created yet.'
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => (
                      <tr 
                        key={task.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleTaskClick(task)}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="mr-3">
                              <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-600">📋</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 hover:text-blue-600 transition-colors">{task.name}</div>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <span className="mr-3">💬 0</span>
                                <span>📎 0</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">{getProjectName(task.project_id)}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                              {task.assigned_to_email?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{task.assigned_to_email || 'Unassigned'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <div className="text-sm text-gray-900">
                              {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                            </div>
                            {task.due_date && (
                              <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getDaysRemaining(task.due_date).bgColor} ${getDaysRemaining(task.due_date).color}`}>
                                {getDaysRemaining(task.due_date).text}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-none outline-none cursor-pointer bg-purple-100 text-purple-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                          </select>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Schedule Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div className="p-6">
                {/* Week Calendar */}
                <div className="grid grid-cols-7 gap-1 mb-6">
                  {weekDays.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                        day.active 
                          ? 'bg-purple-500 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}>
                        {day.date}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Schedule Items */}
                <div className="space-y-4">
                  {scheduleItems.map((item) => (
                    <div key={item.id} className="border-l-4 border-blue-500 pl-4 cursor-pointer hover:bg-gray-50 p-2 rounded-r transition-colors">
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex -space-x-1">
                          {item.attendees.map((attendee, index) => (
                            <div key={index} className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white ${attendee.color}`}>
                              {attendee.avatar}
                            </div>
                          ))}
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-gray-400 ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                  <StickyNote className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {notes.map((note) => (
                    <div key={note.id} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                      <button
                        onClick={() => toggleNote(note.id)}
                        className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          note.completed
                            ? 'bg-purple-500 border-purple-500 text-white'
                            : 'border-gray-300 hover:border-purple-500'
                        }`}
                      >
                        {note.completed && <span className="text-xs">✓</span>}
                      </button>
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          note.completed ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {note.text}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{note.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          projects={availableProjects}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
        />
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <AddTaskModal
          projects={availableProjects}
          onSave={handleCreateTask}
          onClose={() => setShowAddTaskModal(false)}
        />
      )}
    </>
  );
};

export default MainContent;