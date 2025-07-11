import React, { useState } from 'react';
import { Filter, Search, Clock, Sparkles, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TaskModal from './TaskModal';
import AddTaskModal from './AddTaskModal';
import NoProjectsModal from './NoProjectsModal';

interface MyTasksViewProps {
  tasks: any[];
  projects: any[];
  onAddTask: (task: any) => void;
  onUpdateTask: (task: any) => void;
  onDeleteTask: (taskId: number) => void;
  onNavigateToProjects: () => void;
}

const MyTasksView: React.FC<MyTasksViewProps> = ({ 
  tasks, 
  projects, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask,
  onNavigateToProjects
}) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showNoProjectsModal, setShowNoProjectsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All Time');

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Due date filter
    let matchesDueDate = true;
    if (dueDateFilter !== 'All') {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      
      switch (dueDateFilter) {
        case 'Overdue':
          matchesDueDate = taskDate < today && task.status !== 'Completed';
          break;
        case 'Today':
          matchesDueDate = taskDate.toDateString() === today.toDateString();
          break;
        case 'This Week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesDueDate = taskDate >= weekStart && taskDate <= weekEnd;
          break;
        case 'Next Week':
          const nextWeekStart = new Date(today);
          nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
          const nextWeekEnd = new Date(nextWeekStart);
          nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
          matchesDueDate = taskDate >= nextWeekStart && taskDate <= nextWeekEnd;
          break;
      }
    }
    
    // Time filter - only apply to completed tasks
    let matchesTimeFilter = true;
    if (timeFilter !== 'All Time' && task.status === 'Completed') {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      
      switch (timeFilter) {
        case 'This Week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          matchesTimeFilter = taskDate >= weekStart && taskDate <= weekEnd;
          break;
        case 'This Month':
          matchesTimeFilter = taskDate.getMonth() === today.getMonth() && 
                             taskDate.getFullYear() === today.getFullYear();
          break;
      }
    }
    
    return matchesStatus && matchesPriority && matchesSearch && matchesDueDate && matchesTimeFilter;
  });

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
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleAddTask = () => {
    // Check if there are any active projects
    const activeProjects = projects.filter(project => !project.archived);
    if (activeProjects.length === 0) {
      setShowNoProjectsModal(true);
      return;
    }
    setShowAddTaskModal(true);
  };

  const handleCreateProjectFromModal = () => {
    setShowNoProjectsModal(false);
    onNavigateToProjects();
  };
  
  const handleSaveTask = (updatedTask: any) => {
    onUpdateTask(updatedTask);
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleCreateTask = (newTask: any) => {
    onAddTask(newTask);
    setShowAddTaskModal(false);
  };

  const handleDeleteTask = (taskId: number) => {
    onDeleteTask(taskId);
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleStatusChange = (taskId: number, newStatus: string) => {
    const statusOptions = [
      { value: 'Pending', color: 'bg-purple-100 text-purple-800' },
      { value: 'In Progress', color: 'bg-green-100 text-green-800' },
      { value: 'Completed', color: 'bg-blue-100 text-blue-800' },
      { value: 'On Hold', color: 'bg-yellow-100 text-yellow-800' }
    ];
    
    const statusOption = statusOptions.find(option => option.value === newStatus);
    const updatedTask = tasks.find(task => task.id === taskId);
    
    if (updatedTask) {
      onUpdateTask({
        ...updatedTask,
        status: newStatus,
        statusColor: statusOption?.color || 'bg-gray-100 text-gray-800'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 bg-red-50';
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Group tasks by status with proper ordering
  const groupTasksByStatus = (tasks: any[]) => {
    const today = new Date();
    
    // Separate overdue tasks first
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < today && task.status !== 'Completed';
    });

    // Group remaining tasks by status
    const taskGroups = {
      overdue: overdueTasks,
      pending: tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return task.status === 'Pending' && dueDate >= today;
      }),
      inProgress: tasks.filter(task => task.status === 'In Progress'),
      onHold: tasks.filter(task => task.status === 'On Hold'),
      completed: tasks.filter(task => task.status === 'Completed')
    };

    return taskGroups;
  };

  const taskGroups = groupTasksByStatus(filteredTasks);

  // Get section styling based on status
  const getSectionStyle = (status: string) => {
    switch (status) {
      case 'overdue':
        return {
          headerBg: 'bg-red-50 border-red-200',
          headerText: 'text-red-800',
          icon: '🚨',
          title: 'Overdue Tasks',
          description: 'Needs immediate attention'
        };
      case 'pending':
        return {
          headerBg: 'bg-purple-50 border-purple-200',
          headerText: 'text-purple-800',
          icon: '⏳',
          title: 'Pending Tasks',
          description: 'Ready to start'
        };
      case 'inProgress':
        return {
          headerBg: 'bg-green-50 border-green-200',
          headerText: 'text-green-800',
          icon: '🚀',
          title: 'In Progress',
          description: 'Currently working on'
        };
      case 'onHold':
        return {
          headerBg: 'bg-yellow-50 border-yellow-200',
          headerText: 'text-yellow-800',
          icon: '⏸️',
          title: 'On Hold',
          description: 'Temporarily paused'
        };
      case 'completed':
        return {
          headerBg: 'bg-blue-50 border-blue-200',
          headerText: 'text-blue-800',
          icon: '✅',
          title: 'Completed Tasks',
          description: 'Successfully finished'
        };
      default:
        return {
          headerBg: 'bg-gray-50 border-gray-200',
          headerText: 'text-gray-800',
          icon: '📋',
          title: 'Other Tasks',
          description: ''
        };
    }
  };

  // Render task section for mobile view
  const renderMobileTaskSection = (sectionKey: string, tasks: any[]) => {
    if (tasks.length === 0) return null;
    
    const style = getSectionStyle(sectionKey);
    
    return (
      <div key={sectionKey} className="mb-6">
        {/* Section Header */}
        <div className={`px-4 py-3 ${style.headerBg} border rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{style.icon}</span>
              <div>
                <h4 className={`font-semibold text-sm ${style.headerText}`}>
                  {style.title} ({tasks.length})
                </h4>
                {style.description && (
                  <p className={`text-xs ${style.headerText} opacity-75`}>
                    {style.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tasks */}
        <div className="bg-white border-l border-r border-b rounded-b-xl divide-y divide-gray-200">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div 
                className="cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                {/* Task Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{task.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{getProjectName(task.projectId)}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} ml-2`}>
                    {task.priority}
                  </span>
                </div>
                
                {/* Task Details */}
                <div className="space-y-2">
                  {/* Assignee and Due Date */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${task.avatarColor}`}>
                        {task.avatar}
                      </div>
                      <span className="ml-2 text-gray-600">{task.assignee}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  {/* Status and Due Date Badge */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className={`appearance-none text-xs px-2 py-1 pr-6 rounded-full border-none outline-none cursor-pointer ${task.statusColor} shadow-sm`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none">
                        <svg className="w-2 h-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className={`text-xs px-2 py-1 rounded-full ${getDaysRemaining(task.dueDate).bgColor} ${getDaysRemaining(task.dueDate).color}`}>
                      {getDaysRemaining(task.dueDate).text}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render task section for desktop view
  const renderDesktopTaskSection = (sectionKey: string, tasks: any[]) => {
    if (tasks.length === 0) return null;
    
    const style = getSectionStyle(sectionKey);
    
    return (
      <div key={sectionKey} className="mb-6">
        {/* Section Header */}
        <div className={`px-6 py-3 ${style.headerBg} border rounded-t-xl`}>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{style.icon}</span>
            <div>
              <h4 className={`font-semibold text-sm ${style.headerText}`}>
                {style.title} ({tasks.length})
              </h4>
              {style.description && (
                <p className={`text-xs ${style.headerText} opacity-75`}>
                  {style.description}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Tasks Table */}
        <div className="bg-white border-l border-r border-b rounded-b-xl overflow-hidden">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr 
                  key={task.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <Target className="w-3 h-3 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <div 
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => handleTaskClick(task)}
                        >
                          {task.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">{getProjectName(task.projectId)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${task.avatarColor}`}>
                        {task.avatar}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{task.assignee}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-sm text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getDaysRemaining(task.dueDate).bgColor} ${getDaysRemaining(task.dueDate).color}`}>
                        {getDaysRemaining(task.dueDate).text}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className={`appearance-none inline-flex items-center px-2.5 py-0.5 pr-6 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${task.statusColor} shadow-sm`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-1 pointer-events-none">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleTaskClick(task)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Check if we have any tasks to display
  const totalFilteredTasks = Object.values(taskGroups).flat().length;

  return (
    <>
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Header Section */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Mission Control</h1>
              <p className="text-gray-600 text-sm md:text-base">Track progress, conquer deadlines, and celebrate wins</p>
            </div>
            <button 
              onClick={handleAddTask}
              className="flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Task
            </button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find your next task to tackle..."
                className="block w-full pl-9 md:pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:bg-gray-50 transition-colors"
              />
            </div>
            
            {/* Filter Selects - Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
              <div className="relative">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="appearance-none w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pr-8"
                >
                  <option value="All Time">All Time</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pr-8"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="appearance-none w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pr-8"
                >
                  <option value="All">All Priority</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <div className="relative col-span-2 md:col-span-1">
                <select
                  value={dueDateFilter}
                  onChange={(e) => setDueDateFilter(e.target.value)}
                  className="appearance-none w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer pr-8"
                >
                  <option value="All">All Deadlines</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Today">Due Today</option>
                  <option value="This Week">This Week</option>
                  <option value="Next Week">Next Week</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Target className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm text-gray-500">Total Tasks</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm text-gray-500">Completed</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'Completed').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm text-gray-500">In Progress</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'In Progress').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 md:w-6 md:h-6 text-red-600" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm text-gray-500">Needs Attention</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {tasks.filter(t => {
                      const dueDate = new Date(t.dueDate);
                      const today = new Date();
                      return dueDate < today && t.status !== 'Completed';
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks - Mobile Card View / Desktop Table View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base md:text-lg font-semibold text-gray-900">
                Your Tasks ({totalFilteredTasks})
              </h3>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-3 py-2 text-xs md:text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                  <Filter className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  Quick Filter
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden p-4">
            {totalFilteredTasks === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="text-gray-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">Ready to make progress?</p>
                  <p className="text-sm text-gray-600">
                    {searchQuery || filterStatus !== 'All' || filterPriority !== 'All'
                      ? 'Try adjusting your filters to find what you\'re looking for.'
                      : 'Create your first task and start building momentum.'
                    }
                  </p>
                  {(!searchQuery && filterStatus === 'All' && filterPriority === 'All') && (
                    <button 
                      onClick={handleAddTask}
                      className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Create your first task
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Render sections in priority order */}
                {renderMobileTaskSection('overdue', taskGroups.overdue)}
                {renderMobileTaskSection('pending', taskGroups.pending)}
                {renderMobileTaskSection('inProgress', taskGroups.inProgress)}
                {renderMobileTaskSection('onHold', taskGroups.onHold)}
                {renderMobileTaskSection('completed', taskGroups.completed)}
              </div>
            )}
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden md:block p-6">
            {totalFilteredTasks === 0 ? (
              <div className="py-12 px-6 text-center">
                <div className="text-gray-500">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">Ready to make progress?</p>
                  <p className="text-sm text-gray-600 mb-4">
                    {searchQuery || filterStatus !== 'All' || filterPriority !== 'All'
                      ? 'Try adjusting your filters to find what you\'re looking for.'
                      : 'Create your first task and start building momentum.'
                    }
                  </p>
                  {(!searchQuery && filterStatus === 'All' && filterPriority === 'All') && (
                    <button 
                      onClick={handleAddTask}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Create your first task
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Table Header - only show once at the top */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-7 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1">Task</div>
                    <div className="col-span-1">Project</div>
                    <div className="col-span-1">Assignee</div>
                    <div className="col-span-1">Priority</div>
                    <div className="col-span-1">Deadline</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Actions</div>
                  </div>
                </div>
                
                {/* Render sections in priority order */}
                {renderDesktopTaskSection('overdue', taskGroups.overdue)}
                {renderDesktopTaskSection('pending', taskGroups.pending)}
                {renderDesktopTaskSection('inProgress', taskGroups.inProgress)}
                {renderDesktopTaskSection('onHold', taskGroups.onHold)}
                {renderDesktopTaskSection('completed', taskGroups.completed)}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          projects={projects}
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
          projects={projects}
          onSave={handleCreateTask}
          onClose={() => setShowAddTaskModal(false)}
        />
      )}

      {/* No Projects Modal */}
      {showNoProjectsModal && (
        <NoProjectsModal
          onClose={() => setShowNoProjectsModal(false)}
          onCreateProject={handleCreateProjectFromModal}
        />
      )}
    </>
  );
};

export default MyTasksView;