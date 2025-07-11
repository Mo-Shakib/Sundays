import React, { useState, useEffect } from 'react';
import { Plus, Share, Clock, Calendar, MoreHorizontal, TrendingUp, Target, Zap, Award, Users, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TaskModal from './TaskModal';
import AddTaskModal from './AddTaskModal';
import NoProjectsModal from './NoProjectsModal';
import ScheduleModal from './ScheduleModal';
import { scheduleService, ScheduleItem } from '../../services/scheduleService';

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
  
  // Schedule-related state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);

  // Add these state variables for typewriter effect
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisText, setAnalysisText] = useState('');
  const [progressText, setProgressText] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  
  // Add state for inspiring message to prevent flashing
  const [inspiringMessage, setInspiringMessage] = useState('');

  // Add missing helper functions
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Load schedule items on component mount
  useEffect(() => {
    loadScheduleItems();
  }, []);

  const loadScheduleItems = async () => {
    try {
      setIsLoadingSchedule(true);
      const items = await scheduleService.getScheduleItems();
      setScheduleItems(items);
    } catch (error) {
      console.error('Failed to load schedule items:', error);
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  // Generate week days based on selected date
  const generateWeekDays = () => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay()); // Start from Sunday
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday or Saturday
      
      weekDays.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2),
        date: date.getDate().toString(),
        fullDate: date.toISOString().split('T')[0],
        active: date.toDateString() === selectedDate.toDateString(),
        isToday: date.toDateString() === today.toDateString(),
        isWeekend: isWeekend
      });
    }
    return weekDays;
  };

  const weekDays = generateWeekDays();

  // Filter schedule items by selected date
  const getScheduleItemsForDate = (date) => {
    const dateString = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return scheduleItems.filter(item => item.date === dateString);
  };

  // Handle date selection
  const handleDateSelect = (dateString) => {
    setSelectedDate(new Date(dateString));
  };

  // Add new schedule item
  const handleAddScheduleItem = async (newItem) => {
    try {
      const scheduleItemData = {
        title: newItem.title,
        description: newItem.description || '',
        start_time: newItem.startTime,
        end_time: newItem.endTime,
        date: selectedDate.toISOString().split('T')[0],
        type: newItem.type
      };

      const createdItem = await scheduleService.createScheduleItem(scheduleItemData);
      setScheduleItems([...scheduleItems, createdItem]);
      setShowScheduleModal(false);
    } catch (error) {
      console.error('Failed to create schedule item:', error);
      alert('Failed to create schedule item. Please try again.');
    }
  };

  // Delete schedule item
  const handleDeleteScheduleItem = async (itemId) => {
    try {
      await scheduleService.deleteScheduleItem(itemId);
      setScheduleItems(scheduleItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete schedule item:', error);
      alert('Failed to delete schedule item. Please try again.');
    }
  };

  // Format time display
  const formatTimeDisplay = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;
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

  // Sort tasks by status priority
  const sortedTasks = [...timeFilteredTasks].sort((a, b) => {
    const statusPriority = {
      'Pending': 1,
      'In Progress': 2,
      'On Hold': 3,
      'Completed': 4
    };
    return statusPriority[a.status] - statusPriority[b.status];
  });

  // Group tasks by status
  const tasksByStatus = {
    pending: sortedTasks.filter(task => task.status === 'Pending'),
    inProgress: sortedTasks.filter(task => task.status === 'In Progress'),
    onHold: sortedTasks.filter(task => task.status === 'On Hold'),
    completed: sortedTasks.filter(task => task.status === 'Completed')
  };

  // Calculate tasks completed late
  const getCompletedLateTasks = () => {
    const completedTasks = filteredTasks.filter(task => task.status === 'Completed');
    const today = new Date();
    
    return completedTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
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

  // Get selected project name for display
  const selectedProjectName = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId)?.name || 'Unknown Project'
    : 'All Projects';

  // Handle task click to open details
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  // Handle add task button click
  const handleAddTask = () => {
    const activeProjects = projects.filter(project => !project.archived);
    if (activeProjects.length === 0) {
      setShowNoProjectsModal(true);
      return;
    }
    setShowAddTaskModal(true);
  };

  // Handle project creation from modal
  const handleCreateProjectFromModal = () => {
    setShowNoProjectsModal(false);
    onNavigateToProjects();
  };

  // Handle task save (update)
  const handleSaveTask = (updatedTask) => {
    onUpdateTask(updatedTask);
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  // Handle new task creation
  const handleCreateTask = (newTask) => {
    onAddTask(newTask);
    setShowAddTaskModal(false);
  };

  // Handle task deletion
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
    const completedTasks = filteredTasks.filter(task => task.status === 'Completed');
    const totalTasks = filteredTasks.length;
    const pendingTasks = filteredTasks.filter(task => task.status === 'Pending');
    const inProgressTasks = filteredTasks.filter(task => task.status === 'In Progress');
    const onHoldTasks = filteredTasks.filter(task => task.status === 'On Hold');
    
    const today = new Date();
    const onTimeTasks = completedTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= today;
    });
    
    const overdueTasks = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return task.status !== 'Completed' && dueDate < today;
    });
    
    const tasksDueToday = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate.toDateString() === today.toDateString() && task.status !== 'Completed';
    });
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const tasksDueThisWeek = filteredTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= weekStart && dueDate <= weekEnd && task.status !== 'Completed';
    });
    
    let totalDaysAhead = 0;
    onTimeTasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const daysEarly = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      totalDaysAhead += Math.max(0, daysEarly);
    });
    
    const onTimePercentage = completedTasks.length > 0 ? Math.round((onTimeTasks.length / completedTasks.length) * 100) : 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    
    let productivityScore = 0;
    if (totalTasks > 0) {
      const completionWeight = 0.4;
      const onTimeWeight = 0.3;
      const overdueWeight = 0.3;
      
      const completionScore = (completedTasks.length / totalTasks) * 100;
      const onTimeScore = onTimePercentage;
      const overdueScore = Math.max(0, 100 - ((overdueTasks.length / totalTasks) * 200));
      
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

  // Dynamic inspiring message based on performance - now returns stable message
  const getInspiringMessage = () => {
    const { productivityScore, totalCompleted, totalOverdue, tasksDueToday } = stats;
    
    const messages = {
        overdueAndToday: [
            "⚡ Time to power through! You have overdue tasks and deadlines today. Focus mode activated!",
            "🔥 Red alert! Overdue tasks are piling up and today's deadlines are waiting. Time to hustle!",
            "💥 Crisis mode! You've got old tasks haunting you and new ones knocking. Let's tackle them!"
        ],
        todayTasks: [
            "🎯 Today's the day! You have tasks due today. Let's knock them out one by one!",
            "🌅 Fresh start! Today's tasks are waiting for your attention. Make it happen!",
            "🎪 Showtime! Your tasks are ready for the spotlight. Let's make today amazing!"
        ],
        excellent90: [
            "🌟 Outstanding! You're a productivity champion! Your performance is truly inspiring.",
            "👑 Royalty level! You're ruling the productivity kingdom with style and grace!",
            "🏆 Hall of fame! Your productivity skills deserve a standing ovation!"
        ],
        good75: [
            "🚀 Excellent work! You're consistently delivering great results. Keep up this momentum!",
            "💪 Strong performer! You're building an impressive track record of success!",
            "⭐ Rising star! Your consistent efforts are paying off beautifully!"
        ],
        decent60: [
            "💪 Good progress! You're building strong habits. A few tweaks and you'll be unstoppable!",
            "🌱 Growing strong! Your efforts are taking root. Keep pushing forward!",
            "🎯 Getting warmer! You're on the right track. Fine-tune and you'll hit the target!"
        ],
        someProgress: [
            "🌱 Every step counts! You're making progress. Focus on one task at a time!",
            "🐢 Slow and steady! Even small steps forward are better than standing still!",
            "💧 Drop by drop! You're filling the bucket of success one task at a time!"
        ],
        lowPerformance: [
            "💸 You're literally paying for this app to watch your tasks collect dust. What a waste!",
            "🗑️ Your productivity is lower than a broken calculator. Time to get moving!",
            "🤡 Congratulations! You've mastered the art of doing absolutely nothing productive!",
            "💀 Your motivation flatlined. Someone call the productivity paramedics!",
            "🐌 Even snails are embarrassed by your task completion speed!",
            "🦥 You've turned laziness into an art form. Too bad it doesn't pay bills!",
            "😴 Wake up! Your future self is already disappointed in you!",
            "🤦 This is embarrassing. Your task list has more dust than a haunted house!"
        ]
    };
    
    if (totalOverdue > 0 && tasksDueToday > 0) {
        return messages.overdueAndToday[Math.floor(Math.random() * messages.overdueAndToday.length)];
    } else if (tasksDueToday > 0) {
        return messages.todayTasks[Math.floor(Math.random() * messages.todayTasks.length)];
    } else if (productivityScore >= 90) {
        return messages.excellent90[Math.floor(Math.random() * messages.excellent90.length)];
    } else if (productivityScore >= 75) {
        return messages.good75[Math.floor(Math.random() * messages.good75.length)];
    } else if (productivityScore >= 60) {
        return messages.decent60[Math.floor(Math.random() * messages.decent60.length)];
    } else if (totalCompleted > 0) {
        return messages.someProgress[Math.floor(Math.random() * messages.someProgress.length)];
    } else {
        return messages.lowPerformance[Math.floor(Math.random() * messages.lowPerformance.length)];
    }
  };

  // Set inspiring message once when stats change
  useEffect(() => {
    setInspiringMessage(getInspiringMessage());
  }, [stats.productivityScore, stats.totalOverdue, stats.tasksDueToday, stats.totalCompleted]);

  // Typewriter effect function
  const startTypewriter = () => {
    const fullText = getProgressParagraph();
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < fullText.length) {
        setProgressText(fullText.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
  };

  // Enhanced progress paragraph with creative variations
  const getProgressParagraph = () => {
    const { totalCompleted, totalTasks, completionRate, totalOverdue, tasksDueToday, productivityScore } = stats;
    const remaining = totalTasks - totalCompleted;
    
    // Dynamic words for randomization
    const dynamicWords = {
      achievements: ['victories', 'accomplishments', 'wins', 'successes', 'triumphs', 'breakthroughs', 'milestones', 'conquests', 'feats', 'attainments', 'gains', 'advances', 'strides', 'leaps', 'bounds', 'peaks', 'summits', 'pinnacles', 'heights', 'records'],
      progress: ['momentum', 'advancement', 'growth', 'development', 'evolution', 'trajectory', 'progression', 'ascent', 'climb', 'rise', 'surge', 'flow', 'movement', 'stride', 'march', 'journey', 'transformation', 'metamorphosis', 'elevation', 'acceleration'],
      energy: ['drive', 'passion', 'enthusiasm', 'vigor', 'determination', 'zeal', 'spirit', 'fire', 'spark', 'flame', 'intensity', 'dynamism', 'vitality', 'power', 'force', 'magnetism', 'charisma', 'radiance', 'brilliance', 'luminosity'],
      excellence: ['brilliance', 'mastery', 'expertise', 'finesse', 'precision', 'prowess', 'sophistication', 'artistry', 'craftsmanship', 'virtuosity', 'genius', 'talent', 'skill', 'dexterity', 'grace', 'elegance', 'refinement', 'polish', 'distinction', 'superiority'],
      journey: ['adventure', 'expedition', 'voyage', 'quest', 'mission', 'pathway', 'odyssey', 'pilgrimage', 'exploration', 'discovery', 'venture', 'crusade', 'campaign', 'pursuit', 'endeavor', 'enterprise', 'undertaking', 'saga', 'epic', 'chronicle'],
      power: ['strength', 'force', 'might', 'capability', 'potential', 'influence', 'impact', 'authority', 'command', 'control', 'dominance', 'supremacy', 'mastery', 'prowess', 'muscle', 'clout', 'leverage', 'magnetism', 'presence', 'aura'],
      future: ['tomorrow', 'destiny', 'horizon', 'possibilities', 'opportunities', 'prospects', 'vision', 'dreams', 'aspirations', 'goals', 'ambitions', 'hopes', 'potential', 'promise', 'fortune', 'fate', 'calling', 'purpose', 'mission', 'legacy'],
      action: ['execution', 'implementation', 'delivery', 'performance', 'operation', 'accomplishment', 'achievement', 'realization', 'manifestation', 'creation', 'production', 'generation', 'construction', 'building', 'crafting', 'forging', 'shaping', 'molding', 'designing', 'engineering'],
      // Roasting words
      failures: ['disasters', 'catastrophes', 'fiascos', 'debacles', 'blunders', 'mishaps', 'setbacks', 'flops', 'bombs', 'wrecks', 'ruins', 'chaos', 'mayhem', 'shambles', 'mess', 'trainwreck', 'nightmare', 'horror show', 'comedy of errors', 'epic fail'],
      laziness: ['procrastination', 'sluggishness', 'lethargy', 'inertia', 'apathy', 'complacency', 'sloth', 'idleness', 'torpor', 'stagnation', 'hibernation', 'dormancy', 'paralysis', 'inaction', 'negligence', 'avoidance', 'delay tactics', 'excuse-making', 'time-wasting', 'dawdling'],
      mockery: ['spectacle', 'joke', 'comedy', 'farce', 'parody', 'mockery', 'laughingstock', 'embarrassment', 'disgrace', 'shame', 'disappointment', 'letdown', 'anticlimax', 'underwhelming display', 'pitiful attempt', 'sad excuse', 'weak effort', 'pathetic showing', 'feeble performance', 'tragic comedy'],
      harsh: ['brutal', 'savage', 'ruthless', 'merciless', 'unforgiving', 'devastating', 'crushing', 'punishing', 'relentless', 'vicious', 'fierce', 'intense', 'severe', 'harsh', 'cutting', 'biting', 'scathing', 'withering', 'scorching', 'blazing']
    };

    // Helper function to get random word
    const getRandom = (category) => dynamicWords[category][Math.floor(Math.random() * dynamicWords[category].length)];

    // Determine if performance is poor (low completion rate or high overdue count)
    const isPoorPerformance = completionRate < 50 || totalOverdue > 5 || (totalOverdue > 0 && completionRate < 70);

    const paragraphVariations = isPoorPerformance ? [
      // Roasting variations for poor performance
      `Oh my... what a ${getRandom('mockery')} we have here! Only ${totalCompleted} out of ${totalTasks} tasks completed? That's a ${completionRate}% completion rate that's more ${getRandom('harsh')} than a reality check! ${totalOverdue > 0 ? `And those ${totalOverdue} overdue tasks? They're practically growing cobwebs while you perfect the art of ${getRandom('laziness')}! ` : ''}${tasksDueToday > 0 ? `Plus ${tasksDueToday} more task${tasksDueToday > 1 ? 's are' : ' is'} due today - because apparently we love adding to the ${getRandom('failures')}. ` : ''}Your productivity score of ${productivityScore}/100 is a ${getRandom('harsh')} reminder that Netflix doesn't count as professional development. Time to transform this ${getRandom('mockery')} into actual ${getRandom('action')}!`,

      `Well, well, well... if it isn't the master of ${getRandom('laziness')}! Your ${totalCompleted} completed tasks out of ${totalTasks} (a ${getRandom('harsh')} ${completionRate}% rate) is quite the ${getRandom('mockery')}. ${totalOverdue > 0 ? `Those ${totalOverdue} overdue tasks are probably wondering if they've been abandoned like last year's gym membership! ` : ''}${tasksDueToday > 0 ? `And with ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} due today, you're really building quite the collection of ${getRandom('failures')}. ` : ''}At ${productivityScore}/100, your productivity score is lower than my expectations for a productivity app user. Perhaps it's time to stop treating your to-do list like a suggestion box?`,

      `*Slow clap* Bravo! What a ${getRandom('harsh')} display of ${getRandom('laziness')}! Completing only ${totalCompleted} out of ${totalTasks} tasks (${completionRate}% - ouch!) is truly a ${getRandom('mockery')} of time management. ${totalOverdue > 0 ? `Those ${totalOverdue} overdue tasks must feel like forgotten children at this point! ` : ''}${tasksDueToday > 0 ? `And ${tasksDueToday} more task${tasksDueToday > 1 ? 's are' : ' is'} due today because why break the streak of ${getRandom('failures')}? ` : ''}Your ${productivityScore}/100 productivity score is so low, it's practically underground. Time to climb out of this ${getRandom('mockery')} and show those tasks who's boss!`,

      `Holy ${getRandom('failures')}, Batman! This ${completionRate}% completion rate (${totalCompleted} out of ${totalTasks}) is more ${getRandom('harsh')} than a winter morning! ${totalOverdue > 0 ? `Those ${totalOverdue} overdue tasks are staging a revolt against your legendary ${getRandom('laziness')}! ` : ''}${tasksDueToday > 0 ? `And ${tasksDueToday} task${tasksDueToday > 1 ? 's are' : ' is'} due today - because apparently we're collecting ${getRandom('failures')} like Pokemon cards! ` : ''}Your productivity score of ${productivityScore}/100 is such a ${getRandom('mockery')}, even procrastination is embarrassed. Time to turn this ${getRandom('harsh')} reality into some actual ${getRandom('action')}!`,

      `Congratulations! You've achieved legendary status in the art of ${getRandom('laziness')}! Your ${totalCompleted} completed tasks from ${totalTasks} total (a ${getRandom('harsh')} ${completionRate}%) is quite the ${getRandom('mockery')}. ${totalOverdue > 0 ? `Those ${totalOverdue} overdue tasks are probably planning an intervention at this point! ` : ''}${tasksDueToday > 0 ? `With ${tasksDueToday} more task${tasksDueToday > 1 ? 's' : ''} due today, you're really perfecting the ${getRandom('failures')} collection! ` : ''}At ${productivityScore}/100, your productivity score needs life support. Perhaps it's time to stop treating deadlines like gentle suggestions?`,

      `*Chef's kiss* What a magnificent ${getRandom('mockery')}! Only ${totalCompleted} out of ${totalTasks} tasks done (${completionRate}% - absolutely ${getRandom('harsh')}!) is peak ${getRandom('laziness')} performance! ${totalOverdue > 0 ? `Those ${totalOverdue} overdue tasks are probably writing their memoirs about being forgotten! ` : ''}${tasksDueToday > 0 ? `And ${tasksDueToday} task${tasksDueToday > 1 ? 's are' : ' is'} due today because why not add to the ${getRandom('failures')} museum? ` : ''}Your ${productivityScore}/100 score is so low, it's practically a limbo record. Time to stop making excuses and start making ${getRandom('progress')}!`,

      `Oh dear... this is more ${getRandom('harsh')} than a reality TV show! Your ${completionRate}% completion rate (${totalCompleted} of ${totalTasks} tasks) is a true ${getRandom('mockery')} of productivity! ${totalOverdue > 0 ? `Those ${totalOverdue} overdue tasks are probably forming a support group for neglected responsibilities! ` : ''}${tasksDueToday > 0 ? `Plus ${tasksDueToday} more due today - because apparently we're going for the ${getRandom('failures')} world record! ` : ''}With a productivity score of ${productivityScore}/100, you're redefining what it means to underachieve. Time to transform this ${getRandom('laziness')} into legendary ${getRandom('action')}!`,

      `Alert! Alert! We have a ${getRandom('harsh')} case of chronic ${getRandom('laziness')}! Completing ${totalCompleted} out of ${totalTasks} tasks (${completionRate}% - yikes!) is quite the ${getRandom('mockery')}! ${totalOverdue > 0 ? `Those ${totalOverdue} overdue tasks are probably wondering if they're in witness protection! ` : ''}${tasksDueToday > 0 ? `And ${tasksDueToday} task${tasksDueToday > 1 ? 's are' : ' is'} due today because why break the ${getRandom('failures')} tradition? ` : ''}Your ${productivityScore}/100 productivity score is lower than a snake's belly. Perhaps it's time to stop perfecting the art of avoidance?`,

      `Behold! The ${getRandom('harsh')} truth about your ${getRandom('laziness')}! With only ${totalCompleted} tasks completed from ${totalTasks} (a stunning ${completionRate}%), you've created quite the ${getRandom('mockery')}! ${totalOverdue > 0 ? `Those ${totalOverdue} overdue tasks are probably planning their escape from your neglect! ` : ''}${tasksDueToday > 0 ? `And ${tasksDueToday} task${tasksDueToday > 1 ? 's await' : ' awaits'} today - adding to your impressive ${getRandom('failures')} collection! ` : ''}At ${productivityScore}/100, your score is so low it needs an elevator to reach disappointing. Time to stop being a ${getRandom('mockery')} and start being a ${getRandom('power')}!`,

      `*Dramatic gasp* What a ${getRandom('harsh')} display of professional ${getRandom('laziness')}! Your ${completionRate}% completion rate (${totalCompleted} out of ${totalTasks}) is more ${getRandom('mockery')} than a participation trophy! ${totalOverdue > 0 ? `Those ${totalOverdue} overdue tasks are probably sending out search parties for your motivation! ` : ''}${tasksDueToday > 0 ? `With ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} due today, you're really building an empire of ${getRandom('failures')}! ` : ''}Your productivity score of ${productivityScore}/100 is so tragic, it deserves its own documentary. Time to stop being the poster child for procrastination!`
    ] : [
      // Positive variations for good performance
      `Your ${getRandom('achievements')} speak volumes! With ${totalCompleted} out of ${totalTasks} tasks conquered (${completionRate}% completion rate), you're demonstrating exceptional ${getRandom('progress')}. ${totalOverdue > 0 ? `Yes, ${totalOverdue} task${totalOverdue > 1 ? 's are' : ' is'} calling for your immediate ${getRandom('energy')}, ` : ''}${tasksDueToday > 0 ? `and ${tasksDueToday} task${tasksDueToday > 1 ? 's await' : ' awaits'} your ${getRandom('excellence')} today. ` : ''}Your productivity score of ${productivityScore}/100 reflects your ${getRandom('journey')} toward ${getRandom('excellence')}. ${remaining > 0 ? `The remaining ${remaining} task${remaining > 1 ? 's are' : ' is'} your next opportunity to showcase your ${getRandom('power')}!` : `You've achieved perfect completion - what an inspiring display of ${getRandom('excellence')}!`}`,
      
      `The ${getRandom('energy')} you're building is incredible! Completing ${totalCompleted} of ${totalTasks} tasks (${completionRate}% success rate) shows your unwavering ${getRandom('progress')}. ${totalOverdue > 0 ? `Those ${totalOverdue} overdue task${totalOverdue > 1 ? 's' : ''} need your ${getRandom('power')} to transform into ${getRandom('achievements')}, ` : ''}${tasksDueToday > 0 ? `while ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} due today await your signature ${getRandom('excellence')}. ` : ''}At ${productivityScore}/100, your ${getRandom('journey')} is accelerating toward greatness. ${remaining > 0 ? `Channel that ${getRandom('energy')} into the final ${remaining} task${remaining > 1 ? 's' : ''} ahead!` : `Perfect execution achieved - your ${getRandom('journey')} to completion is masterful!`}`,

      `Witness the ${getRandom('power')} of focused ${getRandom('action')}! Your ${totalCompleted} completed tasks from ${totalTasks} total (${completionRate}% mastery) showcase your relentless ${getRandom('progress')}. ${totalOverdue > 0 ? `Those ${totalOverdue} overdue item${totalOverdue > 1 ? 's' : ''} await your transformative ${getRandom('energy')}, ` : ''}${tasksDueToday > 0 ? `and ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} today will experience your ${getRandom('excellence')} firsthand. ` : ''}Your ${productivityScore}/100 productivity score mirrors your ${getRandom('journey')} of continuous ${getRandom('achievements')}. ${remaining > 0 ? `Unleash your ${getRandom('power')} on the remaining ${remaining} challenge${remaining > 1 ? 's' : ''}!` : `Flawless completion - your ${getRandom('excellence')} knows no bounds!`}`,

      `Behold the ${getRandom('excellence')} of your ${getRandom('action')}! With ${totalCompleted} victories out of ${totalTasks} battles (${completionRate}% conquest rate), your ${getRandom('progress')} is undeniable. ${totalOverdue > 0 ? `Convert those ${totalOverdue} overdue task${totalOverdue > 1 ? 's' : ''} into ${getRandom('achievements')} with your signature ${getRandom('energy')}, ` : ''}${tasksDueToday > 0 ? `while ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} today will bow to your ${getRandom('excellence')}. ` : ''}At ${productivityScore}/100, you're crafting a ${getRandom('journey')} of pure ${getRandom('excellence')}. ${remaining > 0 ? `Direct your ${getRandom('power')} toward the remaining ${remaining} target${remaining > 1 ? 's' : ''}!` : `Total domination achieved - your ${getRandom('future')} radiates with potential!`}`,

      `Your ${getRandom('energy')} is absolutely magnetic! Conquering ${totalCompleted} of ${totalTasks} tasks (${completionRate}% excellence rate) demonstrates your unstoppable ${getRandom('progress')}. ${totalOverdue > 0 ? `Those ${totalOverdue} overdue challenge${totalOverdue > 1 ? 's' : ''} need your ${getRandom('power')} to become ${getRandom('achievements')}, ` : ''}${tasksDueToday > 0 ? `and ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} today will witness your ${getRandom('excellence')} in motion. ` : ''}Your ${productivityScore}/100 score illuminates the ${getRandom('journey')} you're creating. ${remaining > 0 ? `Focus your ${getRandom('energy')} on the remaining ${remaining} opportunity${remaining > 1 ? 'ies' : 'y'}!` : `Perfect mastery - your ${getRandom('journey')} is a masterpiece!`}`,

      `The ${getRandom('power')} of your determination shines bright! Your ${totalCompleted} completed tasks from ${totalTasks} total (${completionRate}% triumph rate) reveal your extraordinary ${getRandom('progress')}. ${totalOverdue > 0 ? `Transform those ${totalOverdue} overdue item${totalOverdue > 1 ? 's' : ''} with your natural ${getRandom('power')}, ` : ''}${tasksDueToday > 0 ? `and let ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} today experience your ${getRandom('excellence')}. ` : ''}Your ${productivityScore}/100 productivity reflects the ${getRandom('journey')} of ${getRandom('achievements')} you're building. ${remaining > 0 ? `Channel your ${getRandom('energy')} into the final ${remaining} mission${remaining > 1 ? 's' : ''}!` : `Absolute perfection - your ${getRandom('excellence')} is legendary!`}`,

      `What incredible ${getRandom('progress')} you've generated! Completing ${totalCompleted} out of ${totalTasks} tasks (${completionRate}% success) showcases your relentless ${getRandom('progress')}. ${totalOverdue > 0 ? `Those ${totalOverdue} overdue task${totalOverdue > 1 ? 's' : ''} await your transformative ${getRandom('energy')}, ` : ''}${tasksDueToday > 0 ? `while ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} today will feel your ${getRandom('excellence')}. ` : ''}At ${productivityScore}/100, your ${getRandom('journey')} toward ${getRandom('achievements')} accelerates. ${remaining > 0 ? `Apply your ${getRandom('power')} to the remaining ${remaining} challenge${remaining > 1 ? 's' : ''}!` : `Complete victory - your ${getRandom('future')} blazes with promise!`}`,

      `Your ${getRandom('excellence')} is absolutely stunning! With ${totalCompleted} tasks conquered from ${totalTasks} total (${completionRate}% mastery), you're creating unstoppable ${getRandom('progress')}. ${totalOverdue > 0 ? `Convert those ${totalOverdue} overdue opportunity${totalOverdue > 1 ? 'ies' : 'y'} into ${getRandom('achievements')} with your ${getRandom('energy')}, ` : ''}${tasksDueToday > 0 ? `and ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} today will witness your ${getRandom('excellence')}. ` : ''}Your ${productivityScore}/100 score reflects the magnificent ${getRandom('journey')} you're on. ${remaining > 0 ? `Unleash your ${getRandom('power')} on the final ${remaining} target${remaining > 1 ? 's' : ''}!` : `Flawless execution - your ${getRandom('excellence')} is inspirational!`}`,

      `Behold the ${getRandom('energy')} of your ${getRandom('action')}! Your ${totalCompleted} completed tasks out of ${totalTasks} (${completionRate}% achievement) illuminate your path of ${getRandom('progress')}. ${totalOverdue > 0 ? `Those ${totalOverdue} overdue task${totalOverdue > 1 ? 's' : ''} need your signature ${getRandom('energy')} to become ${getRandom('achievements')}, ` : ''}${tasksDueToday > 0 ? `while ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} today await your ${getRandom('excellence')}. ` : ''}At ${productivityScore}/100, you're crafting a ${getRandom('journey')} of pure ${getRandom('excellence')}. ${remaining > 0 ? `Direct your ${getRandom('power')} toward the remaining ${remaining} quest${remaining > 1 ? 's' : ''}!` : `Total mastery achieved - your ${getRandom('future')} sparkles with potential!`}`,

      `The ${getRandom('power')} of your determination shines bright! Your ${totalCompleted} completed tasks from ${totalTasks} total (${completionRate}% triumph rate) reveal your extraordinary ${getRandom('progress')}. ${totalOverdue > 0 ? `Transform those ${totalOverdue} overdue item${totalOverdue > 1 ? 's' : ''} with your natural ${getRandom('power')}, ` : ''}${tasksDueToday > 0 ? `and let ${tasksDueToday} task${tasksDueToday > 1 ? 's' : ''} today experience your ${getRandom('excellence')}. ` : ''}Your ${productivityScore}/100 productivity reflects the ${getRandom('journey')} of ${getRandom('achievements')} you're building. ${remaining > 0 ? `Channel your ${getRandom('energy')} into the final ${remaining} mission${remaining > 1 ? 's' : ''}!` : `Absolute perfection - your ${getRandom('excellence')} is legendary!`}`,
    ];

    // Return a random variation
    return paragraphVariations[Math.floor(Math.random() * paragraphVariations.length)];
  };

  // Handle analysis and typewriter effect
  useEffect(() => {
    const analysisMessages = [
      'Analyzing your patterns...',
      'Crunching task completion data...',
      'Evaluating workflow efficiency...',
      'Processing performance metrics...',
      'Scanning project momentum...',
      'Assessing time management skills...',
      'Reviewing accomplishment trends...',
      'Calculating productivity insights...',
      'Examining task distribution...',
      'Computing efficiency scores...'
    ];

    let currentMessage = 0;
    const messageInterval = setInterval(() => {
      if (currentMessage < analysisMessages.length) {
        setAnalysisText(analysisMessages[currentMessage]);
        currentMessage++;
      } else {
        clearInterval(messageInterval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setShowProgress(true);
          startTypewriter();
        }, 900);
      }
    }, 300);

    return () => clearInterval(messageInterval);
  }, []);

  return (
    <>
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Header Section */}
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-3 sm:space-y-0">
            <div>
              <p className="text-xs md:text-sm text-gray-500">{getCurrentDate()}</p>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">{getGreeting()} {user?.name?.split(' ')[0]},</h1>
              {selectedProjectId && (
                <p className="text-sm md:text-lg text-blue-600 mt-1">Viewing: {selectedProjectName}</p>
              )}
            </div>
            {/* Desktop buttons */}
            <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
              <button
                onClick={onNavigateToMyTasks}
                className="flex items-center justify-center px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
              >
                <Target className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Take Action
              </button>
              <button 
                onClick={handleAddTask}
                className="flex items-center justify-center px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                Create Task
              </button>
            </div>
          </div>

          {/* Inspiring Message */}
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-blue-800 font-medium text-center text-sm md:text-base">{inspiringMessage}</p>
          </div>

          {/* Mobile Action Buttons */}
          <div className="sm:hidden mb-4 space-y-2">
            <button
              onClick={onNavigateToMyTasks}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
            >
              <Target className="w-4 h-4 mr-2" />
              Take Action on My Tasks
            </button>
            <button 
              onClick={handleAddTask}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create New Task
            </button>
          </div>

          {/* Progress Analysis & Paragraph */}
          <div className="mb-4 md:mb-6">
            {isAnalyzing ? (
              <div className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-gray-600 text-sm md:text-base font-medium">{analysisText}</p>
              </div>
            ) : showProgress ? (
              <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {progressText}
                  <span className="animate-pulse">|</span>
                </p>
              </div>
            ) : null}
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            {/* Productivity Score */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Productivity Score</p>
                  <p className={`text-lg md:text-2xl font-bold ${
                    stats.productivityScore >= 80 ? 'text-green-600' :
                    stats.productivityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {stats.productivityScore}
                  </p>
                </div>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
                  stats.productivityScore >= 80 ? 'bg-green-100' :
                  stats.productivityScore >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <Target className={`w-4 h-4 md:w-6 md:h-6 ${
                    stats.productivityScore >= 80 ? 'text-green-600' :
                    stats.productivityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                <div 
                  className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ${
                    stats.productivityScore >= 80 ? 'bg-green-500' :
                    stats.productivityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stats.productivityScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">out of 100</p>
            </div>
            
            {/* Completion Rate */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Completion Rate</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">{stats.completionRate}%</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{stats.totalCompleted} of {stats.totalTasks} tasks</p>
            </div>
            
            {/* Overdue Tasks */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Overdue Tasks</p>
                  <p className={`text-lg md:text-2xl font-bold ${stats.totalOverdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {stats.totalOverdue}
                  </p>
                </div>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
                  stats.totalOverdue > 0 ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <AlertCircle className={`w-4 h-4 md:w-6 md:h-6 ${
                    stats.totalOverdue > 0 ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">need immediate attention</p>
            </div>
            
            {/* Due Today */}
            <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Due Today</p>
                  <p className={`text-lg md:text-2xl font-bold ${stats.tasksDueToday > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {stats.tasksDueToday}
                  </p>
                </div>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${
                  stats.tasksDueToday > 0 ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  <Clock className={`w-4 h-4 md:w-6 md:h-6 ${
                    stats.tasksDueToday > 0 ? 'text-orange-600' : 'text-green-600'
                  }`} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">tasks to complete</p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="mb-4 flex flex-col space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {selectedProjectId ? `${selectedProjectName} Tasks` : 'Your Task Overview'}
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
              <div className="relative">
                <select 
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="appearance-none bg-white text-xs md:text-sm text-gray-700 border border-gray-200 rounded-xl px-3 md:px-4 py-2 md:py-2.5 pr-8 md:pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm hover:bg-gray-50 transition-colors cursor-pointer min-w-0 w-full sm:w-auto"
                >
                  <option value="All Time">📅 All Time</option>
                  <option value="This Week">📆 This Week</option>
                  <option value="This Month">🗓️ This Month</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 md:px-3 pointer-events-none">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <button
                onClick={onNavigateToMyTasks}
                className="px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm flex items-center justify-center whitespace-nowrap"
              >
                <Target className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">View All Tasks</span>
                <span className="sm:hidden">All Tasks</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <div className="space-y-4 md:space-y-6">
              {/* Recent Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">Recent Tasks</h3>
                    <button 
                      onClick={onNavigateToMyTasks}
                      className="text-xs md:text-sm text-blue-600 hover:text-blue-700"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                  {sortedTasks.slice(0, 5).map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className="flex items-center justify-between p-2 md:p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium ${task.avatarColor} mr-2 md:mr-3 flex-shrink-0`}>
                          {task.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm md:text-base truncate">{task.name}</p>
                          <p className="text-xs md:text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.statusColor} ml-2 flex-shrink-0`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                  {sortedTasks.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No tasks found</p>
                      <button 
                        onClick={handleAddTask}
                        className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Create your first task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Schedule */}
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500" />
                    Your Schedule
                  </h3>
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="flex items-center px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Add Event</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                {/* Week Calendar */}
                <div className="grid grid-cols-7 gap-1 mb-4 md:mb-6">
                  {weekDays.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-xs mb-1 font-medium ${day.isWeekend ? 'text-green-600' : 'text-gray-500'}`}>
                        {day.day}
                      </div>
                      <button
                        onClick={() => handleDateSelect(day.fullDate)}
                        className={`w-6 h-6 md:w-8 md:h-8 rounded-xl flex items-center justify-center text-xs md:text-sm font-medium transition-all shadow-sm ${
                          day.active 
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200' 
                            : day.isToday
                            ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border border-blue-300'
                            : day.isWeekend
                            ? 'text-green-600 hover:bg-green-50 hover:shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                        }`}
                      >
                        {day.date}
                      </button>
                      {getScheduleItemsForDate(day.fullDate).length > 0 && (
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mx-auto mt-1 shadow-sm"></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Date Display */}
                <div className="mb-4 text-center">
                  <p className="text-sm md:text-base text-gray-700 font-medium">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Schedule Items */}
                <div className="space-y-3 md:space-y-4">
                  {isLoadingSchedule ? (
                    <div className="text-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Loading your schedule...</p>
                    </div>
                  ) : getScheduleItemsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Your day is wide open!</p>
                      <button
                        onClick={() => setShowScheduleModal(true)}
                        className="inline-flex items-center px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Schedule something amazing
                      </button>
                    </div>
                  ) : (
                    getScheduleItemsForDate(selectedDate).map((item) => (
                      <div key={item.id} className="border-l-4 border-blue-500 pl-3 md:pl-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 p-3 rounded-r-xl transition-all group shadow-sm hover:shadow-md">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm truncate">{item.title}</h4>
                            <p className="text-xs text-gray-600 mt-1 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTimeDisplay(item.start_time)} to {formatTimeDisplay(item.end_time)}
                            </p>
                            {item.description && (
                              <p className="text-xs text-gray-500 mt-1 truncate">{item.description}</p>
                            )}
                            <div className="flex items-center mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
                                item.type === 'meeting' ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700' : 'bg-gradient-to-r from-green-100 to-green-200 text-green-700'
                              }`}>
                                {item.type === 'meeting' ? '👥 Meeting' : '📝 Task'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteScheduleItem(item.id!)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
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

      {showAddTaskModal && (
        <AddTaskModal
          projects={projects.filter(project => !project.archived)}
          onSave={handleCreateTask}
          onClose={() => setShowAddTaskModal(false)}
        />
      )}

      {showNoProjectsModal && (
        <NoProjectsModal
          onClose={() => setShowNoProjectsModal(false)}
          onCreateProject={handleCreateProjectFromModal}
        />
      )}

      {showScheduleModal && (
        <ScheduleModal
          selectedDate={selectedDate}
          onSave={handleAddScheduleItem}
          onClose={() => setShowScheduleModal(false)}
        />
      )}
    </>
  );
};

export default DashboardView;