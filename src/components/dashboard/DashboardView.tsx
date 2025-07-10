import React, { useState } from 'react';
import { Plus, Share, Clock, Calendar, StickyNote, MoreHorizontal, TrendingUp, Target, Zap, Award, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TaskModal from './TaskModal';
import AddTaskModal from './AddTaskModal';
import NoProjectsModal from './NoProjectsModal';

interface DashboardViewProps {
  selectedProjectId: number | null;
  projects: any[];
  tasks: any[];
  onAddTask: (task: any) => void;
  onUpdateTask: (task: any) => void;
  onDeleteTask: (taskId: number) => void;
  onNavigateToMyTasks: () => void;
  onNavigateToProjects: () => void;
  onArchiveProject: (projectId: number) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  selectedProjectId, 
  projects, 
  tasks, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask,
  onNavigateToMyTasks,
  onNavigateToProjects,
  onArchiveProject
}) => {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showNoProjectsModal, setShowNoProjectsModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState('This Week');

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
    } else {
      return { text: `${diffDays} days remaining`, color: 'text-green-600', bgColor: 'bg-green-50' };
    }
  };

  // Filter tasks based on selected project
  const filteredTasks = selectedProjectId 
    ? tasks.filter(task => task.projectId === selectedProjectId)
    : tasks;

  // Apply time filter to tasks
  const timeFilteredTasks = filteredTasks.filter(task => {
    // For Recent Tasks section, we want to show:
    // 1. All non-completed tasks (regardless of time filter)
    // 2. Recently completed tasks (based on time filter)
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    
    // Always show non-completed tasks
    if (task.status !== 'Completed') {
      return true;
    }
    
    // For completed tasks, apply time filter
    switch (timeFilter) {
      case 'This Week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return taskDate >= weekStart && taskDate <= weekEnd;
      
      case 'This Month':
        return taskDate.getMonth() === today.getMonth() && 
               taskDate.getFullYear() === today.getFullYear();
      
      case 'All Time':
      default:
        return true;
    }
  });

  // Sort tasks by status priority (Pending first, Completed last)
  const sortedTasks = [...timeFilteredTasks].sort((a, b) => {
    const statusPriority = {
      'Pending': 1,
      'In Progress': 2,
      'On Hold': 3,
      'Completed': 4
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  // Calculate tasks completed late (after due date)
  const getCompletedLateTasks = () => {
    const completedTasks = filteredTasks.filter(task => task.status === 'Completed');
    const today = new Date();
    
    return completedTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      // Assuming task was completed late if it's marked completed and due date has passed
      // In a real app, you'd have a completedDate field to compare with dueDate
      return dueDate < today;
    }).map(task => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const daysLate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        ...task,
        daysLate: daysLate
      };
    });
  };

  const completedLateTasks = getCompletedLateTasks();

  // Update productivity score calculation to not penalize late completions
  const calculateProductivityScore = (stats) => {
    // Don't count late completed tasks as negative for productivity
    return stats.productivityScore;
  };

  // Get selected project name for display
  const selectedProjectName = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId)?.name || 'Unknown Project'
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
  const handleSaveTask = (updatedTask) => {
    onUpdateTask(updatedTask);
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleCreateTask = (newTask) => {
    onAddTask(newTask);
    setShowAddTaskModal(false);
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask(taskId);
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  // Get project name by ID
  const getProjectName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  // Calculate comprehensive stats
  const calculateStats = () => {
    // Use the same filtered tasks that are displayed
    const completedTasks = filteredTasks.filter(task => task.status === 'Completed');
    const totalTasks = filteredTasks.length;
    const pendingTasks = filteredTasks.filter(task => task.status === 'Pending');
    const inProgressTasks = filteredTasks.filter(task => task.status === 'In Progress');
    const onHoldTasks = filteredTasks.filter(task => task.status === 'On Hold');
    
    // Tasks completed on time
    const today = new Date();
    const onTimeTasks = completedTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today; // Tasks completed before or on due date
    });
    
    // Overdue tasks (not completed and past due date)
    const overdueTasks = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return task.status !== 'Completed' && dueDate < today;
    });
    
    // Tasks due today
    const tasksDueToday = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === today.toDateString() && task.status !== 'Completed';
    });
    
    // Tasks due this week
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const tasksDueThisWeek = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= weekStart && dueDate <= weekEnd && task.status !== 'Completed';
    });
    
    // Days ahead calculation
    let totalDaysAhead = 0;
    onTimeTasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const daysEarly = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      totalDaysAhead += Math.max(0, daysEarly);
    });
    
    const onTimePercentage = completedTasks.length > 0 ? Math.round((onTimeTasks.length / completedTasks.length) * 100) : 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    
    // Productivity score (weighted calculation) 
    // Note: We don't penalize late completions in the main score since completing late is still better than not completing
    // The "Completed Late" section will show this information separately
    let productivityScore = 0;
    if (totalTasks > 0) {
      const completionWeight = 0.4;
      const onTimeWeight = 0.3;
      const overdueWeight = 0.3;
      
      const completionScore = (completedTasks.length / totalTasks) * 100;
      const onTimeScore = onTimePercentage;
      const overdueScore = Math.max(0, 100 - ((overdueTasks.length / totalTasks) * 200)); // Double penalty for overdue
      
      productivityScore = Math.round(
        (completionScore * completionWeight) + 
        (onTimeScore * onTimeWeight) + 
        (overdueScore * overdueWeight)
      );
    }
    
    return {
      totalCompleted: completedTasks.length,
      totalPending: pendingTasks.length,
      totalInProgress: inProgressTasks.length,
      totalOnHold: onHoldTasks.length,
      totalOverdue: overdueTasks.length,
      tasksDueToday: tasksDueToday.length,
      tasksDueThisWeek: tasksDueThisWeek.length,
      onTimePercentage,
      totalDaysAhead,
      totalTasks,
      completionRate,
      productivityScore
    };
  };

  const stats = calculateStats();

  // Dynamic inspiring message based on performance
  const getInspiringMessage = () => {
    const { productivityScore, totalCompleted, totalOverdue, tasksDueToday } = stats;
    
    if (totalOverdue > 0 && tasksDueToday > 0) {
      return "⚡ Time to power through! You have overdue tasks and deadlines today. Focus mode activated!";
    } else if (tasksDueToday > 0) {
      return "🎯 Today's the day! You have tasks due today. Let's knock them out one by one!";
    } else if (productivityScore >= 90) {
      return "🌟 Outstanding! You're a productivity champion! Your exceptional performance is truly inspiring.";
    } else if (productivityScore >= 75) {
      return "🚀 Excellent work! You're consistently delivering great results. Keep up this fantastic momentum!";
    } else if (productivityScore >= 60) {
      return "💪 Good progress! You're building strong habits. A few tweaks and you'll be unstoppable!";
    } else if (totalCompleted > 0) {
      return "🌱 Every step counts! You're making progress. Focus on one task at a time and watch your success grow!";
    } else {
      return "✨ Today is full of possibilities! Start with one small task and build your momentum from there!";
    }
  };

  // Casual progress paragraph
  const getProgressParagraph = () => {
    const { totalCompleted, totalTasks, completionRate, totalOverdue, tasksDueToday, productivityScore } = stats;
    const remaining = totalTasks - totalCompleted;
    
    if (totalCompleted === 0) {
      return "You're at the starting line of something great! With your organized approach and clear goals, you're perfectly positioned to tackle your tasks efficiently. Time to turn those plans into action!";
    }
    
    let paragraph = `You've completed ${totalCompleted} out of ${totalTasks} tasks (${completionRate}% completion rate)`;
    
    if (totalOverdue > 0) {
      paragraph += `, with ${totalOverdue} task${totalOverdue > 1 ? 's' : ''} overdue that need immediate attention`;
    }
    
    if (tasksDueToday > 0) {
      paragraph += `, and ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} due today`;
    }
    
    paragraph += `. Your current productivity score is ${productivityScore}/100`;
    
    if (productivityScore >= 80) {
      paragraph += " - excellent performance!";
    } else if (productivityScore >= 60) {
      paragraph += " - solid progress with room for improvement.";
    } else {
      paragraph += " - let's focus on catching up and building momentum.";
    }
    
    if (remaining > 0) {
      paragraph += ` Keep pushing forward with the remaining ${remaining} task${remaining > 1 ? 's' : ''}!`;
    } else {
      paragraph += " All caught up - fantastic work!";
    }
    
    return paragraph;
  };

  const weekDays = [
    { day: 'Mo', date: '15' },
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
    if (hour < 6) return 'Working Late?';
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    if (hour < 22) return 'Good Evening!';
    return 'Burning the Midnight Oil?';
  };

  // Group tasks by status for different sections
  const tasksByStatus = {
    pending: sortedTasks.filter(task => task.status === 'Pending'),
    inProgress: sortedTasks.filter(task => task.status === 'In Progress'),
    completed: sortedTasks.filter(task => task.status === 'Completed'),
    onHold: sortedTasks.filter(task => task.status === 'On Hold')
  };

  // Get priority color for tasks
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <>
      <main className="flex-1 p-6 overflow-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-gray-500">{getCurrentDate()}</p>
              <h1 className="text-3xl font-bold text-gray-900">{getGreeting()} {user?.name?.split(' ')[0]},</h1>
              {selectedProjectId && (
                <p className="text-lg text-blue-600 mt-1">Viewing: {selectedProjectName}</p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button className="hidden sm:flex items-center px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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

          {/* Inspiring Message */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-blue-800 font-medium text-center">{getInspiringMessage()}</p>
          </div>

          {/* Progress Paragraph */}
          <div className="mb-6">
            <p className="text-gray-600 leading-relaxed">{getProgressParagraph()}</p>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Productivity Score */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Productivity Score</p>
                  <p className={`text-2xl font-bold ${
                    stats.productivityScore >= 80 ? 'text-green-600' :
                    stats.productivityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {stats.productivityScore}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stats.productivityScore >= 80 ? 'bg-green-100' :
                  stats.productivityScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Target className={`w-6 h-6 ${
                    stats.productivityScore >= 80 ? 'text-green-600' :
                    stats.productivityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stats.productivityScore >= 80 ? 'bg-green-500' :
                    stats.productivityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stats.productivityScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">out of 100</p>
            </div>
            
            {/* Completion Rate */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completionRate}%</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{stats.totalCompleted} of {stats.totalTasks} tasks</p>
            </div>
            
            {/* Overdue Tasks */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Overdue Tasks</p>
                  <p className={`text-2xl font-bold ${stats.totalOverdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {stats.totalOverdue}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stats.totalOverdue > 0 ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    stats.totalOverdue > 0 ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">need immediate attention</p>
            </div>
            
            {/* Due Today */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Due Today</p>
                  <p className={`text-2xl font-bold ${stats.tasksDueToday > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {stats.tasksDueToday}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  stats.tasksDueToday > 0 ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  <Clock className={`w-6 h-6 ${
                    stats.tasksDueToday > 0 ? 'text-orange-600' : 'text-green-600'
                  }`} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">tasks to complete</p>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* In Progress */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">In Progress</p>
                  <p className="text-lg font-bold text-green-600">{stats.totalInProgress}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
            
            {/* Pending */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-lg font-bold text-purple-600">{stats.totalPending}</p>
                </div>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
              </div>
            </div>
            
            {/* On Hold */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">On Hold</p>
                  <p className="text-lg font-bold text-yellow-600">{stats.totalOnHold}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
            </div>
            
            {/* Due This Week */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Due This Week</p>
                  <p className="text-lg font-bold text-indigo-600">{stats.tasksDueThisWeek}</p>
                </div>
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Sections by Priority and Status */}
          <div className="lg:col-span-2">
            {/* Filter Controls */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedProjectId ? `${selectedProjectName} Tasks` : 'Recent Tasks'}
              </h2>
              <select 
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All Time">All Time</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
            
            <div className="space-y-6">
              {/* High Priority Tasks */}
              {sortedTasks.filter(task => task.priority === 'High' || task.priority === 'Critical').length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-red-200">
                  <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-red-800 flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        High Priority Tasks ({sortedTasks.filter(task => task.priority === 'High' || task.priority === 'Critical').length})
                      </h3>
                      <span className="text-sm text-red-600 bg-red-100 px-2 py-1 rounded">Urgent</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {sortedTasks.filter(task => task.priority === 'High' || task.priority === 'Critical').slice(0, 3).map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${task.avatarColor} mr-3`}>
                            {task.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{task.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.statusColor}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Tasks */}
              {tasksByStatus.pending.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        Pending Tasks ({tasksByStatus.pending.length})
                      </h3>
                      <span className="text-sm text-purple-600 bg-purple-50 px-2 py-1 rounded">Needs Attention</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {tasksByStatus.pending.slice(0, 3).map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${task.avatarColor} mr-3`}>
                            {task.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{task.name}</p>
                            <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.statusColor}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* In Progress Tasks */}
              {tasksByStatus.inProgress.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        In Progress ({tasksByStatus.inProgress.length})
                      </h3>
                      <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {tasksByStatus.inProgress.slice(0, 3).map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${task.avatarColor} mr-3`}>
                            {task.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{task.name}</p>
                            <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.statusColor}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Late Tasks */}
              {completedLateTasks.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-yellow-200">
                  <div className="px-6 py-4 border-b border-yellow-100 bg-yellow-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-yellow-800 flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        Completed Late ({completedLateTasks.length})
                      </h3>
                      <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded">Delivered Late</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {completedLateTasks.slice(0, 3).map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${task.avatarColor} mr-3`}>
                            {task.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-through">{task.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                Completed {task.daysLate} day{task.daysLate > 1 ? 's' : ''} late
                              </span>
                              <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.statusColor}`}>
                          ✓ Done Late
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Tasks */}
              {tasksByStatus.completed.filter(task => {
                // Only show completed tasks that were NOT completed late
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                return dueDate >= today; // Completed on time or early
              }).length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        Recently Completed ({tasksByStatus.completed.filter(task => {
                          const dueDate = new Date(task.dueDate);
                          const today = new Date();
                          return dueDate >= today;
                        }).length})
                      </h3>
                      <button 
                        onClick={onNavigateToMyTasks}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {tasksByStatus.completed.filter(task => {
                      // Only show completed tasks that were NOT completed late
                      const dueDate = new Date(task.dueDate);
                      const today = new Date();
                      return dueDate >= today;
                    }).slice(0, 2).map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors opacity-75"
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${task.avatarColor} mr-3`}>
                            {task.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 line-through">{task.name}</p>
                            <p className="text-sm text-gray-500">Completed</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.statusColor}`}>
                          ✓ Done
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {sortedTasks.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <div className="text-gray-500">
                    <p className="text-lg font-medium">No tasks found</p>
                    <p className="text-sm">
                      {selectedProjectId 
                        ? `No tasks in ${selectedProjectName} project yet.`
                        : 'Create your first task to get started!'
                      }
                    </p>
                  </div>
                </div>
              )}
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
          projects={projects.filter(project => !project.archived)}
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

export default DashboardView;