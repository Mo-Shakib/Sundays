import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

interface Notification {
  id: string;
  type: 'task' | 'productivity' | 'motivation' | 'deadline' | 'achievement' | 'overdue' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'orange';
  taskId?: string;
}

interface NotificationState {
  notifications: Notification[];
  lastNotificationTime: Date | null;
  lastTaskCheck: Date | null;
  notificationCount: number;
}

type NotificationAction = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'MARK_READ'; payload: string }
  | { type: 'SET_LAST_NOTIFICATION_TIME'; payload: Date }
  | { type: 'SET_LAST_TASK_CHECK'; payload: Date };

interface NotificationContextType {
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  generateContextualNotification: () => void;
  checkTaskNotifications: (tasks: Task[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 50), // Keep only last 50
        notificationCount: state.notificationCount + 1
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        notificationCount: 0
      };
    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, isRead: true } : n
        )
      };
    case 'SET_LAST_NOTIFICATION_TIME':
      return {
        ...state,
        lastNotificationTime: action.payload
      };
    case 'SET_LAST_TASK_CHECK':
      return {
        ...state,
        lastTaskCheck: action.payload
      };
    default:
      return state;
  }
};

const motivationalMessages = [
  { title: "Start Strong! 💪", message: "The best time to start was yesterday. The second best time is now!", type: "motivation" as const },
  { title: "Productivity Beast! 🚀", message: "You're just one task away from feeling unstoppable today!", type: "motivation" as const },
  { title: "Focus Mode ON! 🎯", message: "Great things never come from comfort zones. Push yourself!", type: "motivation" as const },
  { title: "Momentum Builder! ⚡", message: "Small progress is still progress. Keep the streak alive!", type: "motivation" as const },
  { title: "Goal Crusher! 🏆", message: "Your future self will thank you for what you do today.", type: "motivation" as const },
  { title: "Time Master! ⏰", message: "Every minute counts. Make this hour your most productive yet!", type: "motivation" as const },
  { title: "Energy Boost! ☀️", message: "You've got this! Channel that energy into your next task.", type: "motivation" as const },
  { title: "Success Magnet! ✨", message: "Winners don't wait for motivation, they create it. Go get it!", type: "motivation" as const },
  { title: "Champion Mindset! 🏅", message: "The only impossible journey is the one you never begin.", type: "motivation" as const },
  { title: "Unstoppable Force! 🔥", message: "You're not just working, you're building your empire!", type: "motivation" as const },
  { title: "Peak Performance! 📈", message: "Excellence isn't a skill, it's an attitude. Show yours!", type: "productivity" as const },
  { title: "Deadline Warrior! ⚔️", message: "Pressure makes diamonds. You're sparkling today!", type: "deadline" as const },
  { title: "Task Destroyer! 💥", message: "One task at a time, one victory at a time!", type: "task" as const },
  { title: "Progress Pioneer! 🌟", message: "You're not behind, you're exactly where you need to be.", type: "productivity" as const },
  { title: "Focus Fighter! 🥊", message: "Distractions are temporary, but achievements are permanent!", type: "motivation" as const },
  { title: "Productivity Pro! 💼", message: "Your consistency is your superpower. Keep showing up!", type: "productivity" as const },
  { title: "Time Optimizer! ⚙️", message: "Smart work beats hard work. You're mastering both!", type: "productivity" as const },
  { title: "Achievement Unlocked! 🎮", message: "Level up your day with one more completed task!", type: "achievement" as const },
  { title: "Weekend Warrior! 🌅", message: "New week, new opportunities. Make it count!", type: "motivation" as const },
  { title: "Finish Strong! 🏁", message: "Week ending strong means next week starts stronger!", type: "motivation" as const }
];

const taskMotivationMessages = [
  { title: "Task Time! 📋", message: "Your to-do list is calling. Let's turn it into a 'ta-da' list!", type: "task" as const },
  { title: "Priority Focus! 🎯", message: "High-priority tasks first. You've got the power to tackle them!", type: "task" as const },
  { title: "Deadline Champion! ⏰", message: "Beat the clock and feel the satisfaction of early completion!", type: "deadline" as const },
  { title: "Task Momentum! ⚡", message: "Each completed task builds unstoppable momentum!", type: "task" as const },
  { title: "Productivity Surge! 📊", message: "Your pending tasks are opportunities for victory!", type: "productivity" as const }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
    lastNotificationTime: null,
    lastTaskCheck: null,
    notificationCount: 0
  });
  
  const { user } = useAuth();

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    dispatch({ type: 'SET_LAST_NOTIFICATION_TIME', payload: new Date() });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_READ', payload: id });
  };

  const getTimeUntilDue = (dueDate: Date): string => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Less than 1 hour';
    if (hours <= 24) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${days} day${days > 1 ? 's' : ''}`;
  };

  const checkTaskNotifications = (tasks: Task[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Check for overdue tasks
    const overdueTasks = tasks.filter(task => 
      task.status !== 'completed' && 
      task.dueDate && 
      new Date(task.dueDate) < today
    );

    // Check for tasks due today
    const tasksDueToday = tasks.filter(task => 
      task.status !== 'completed' && 
      task.dueDate && 
      new Date(task.dueDate).toDateString() === today.toDateString()
    );

    // Check for tasks due tomorrow
    const tasksDueTomorrow = tasks.filter(task => 
      task.status !== 'completed' && 
      task.dueDate && 
      new Date(task.dueDate).toDateString() === tomorrow.toDateString()
    );

    // Check for pending tasks without due dates
    const pendingTasks = tasks.filter(task => 
      task.status === 'pending' && !task.dueDate
    );

    // Check for high priority tasks
    const highPriorityPending = tasks.filter(task => 
      task.status !== 'completed' && task.priority === 'high'
    );

    // Generate notifications for overdue tasks
    if (overdueTasks.length > 0) {
      const overdueTask = overdueTasks[0];
      const daysOverdue = Math.floor((now.getTime() - new Date(overdueTask.dueDate!).getTime()) / (1000 * 60 * 60 * 24));
      
      addNotification({
        type: 'overdue',
        title: 'Overdue Alert! 🚨',
        message: `"${overdueTask.title}" is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue. Time to tackle it!`,
        priority: 'high',
        color: 'red',
        taskId: overdueTask.id
      });
    }

    // Generate notifications for tasks due today
    if (tasksDueToday.length > 0) {
      const todayTask = tasksDueToday[0];
      addNotification({
        type: 'deadline',
        title: 'Due Today! 📅',
        message: `"${todayTask.title}" is due today. Let's get it done!`,
        priority: 'high',
        color: 'orange',
        taskId: todayTask.id
      });
    }

    // Generate notifications for tasks due tomorrow
    if (tasksDueTomorrow.length > 0 && Math.random() < 0.3) { // 30% chance to avoid spam
      const tomorrowTask = tasksDueTomorrow[0];
      addNotification({
        type: 'reminder',
        title: 'Due Tomorrow! ⏰',
        message: `"${tomorrowTask.title}" is due tomorrow. Start preparing now!`,
        priority: 'medium',
        color: 'yellow',
        taskId: tomorrowTask.id
      });
    }

    // Generate notifications for pending tasks
    if (pendingTasks.length > 0 && Math.random() < 0.4) { // 40% chance
      const pendingTask = pendingTasks[Math.floor(Math.random() * pendingTasks.length)];
      const taskMessage = taskMotivationMessages[Math.floor(Math.random() * taskMotivationMessages.length)];
      
      addNotification({
        type: 'task',
        title: taskMessage.title,
        message: `"${pendingTask.title}" is waiting for your attention. ${taskMessage.message.split('!')[1] || 'Let\'s get started!'}`,
        priority: 'medium',
        color: 'purple',
        taskId: pendingTask.id
      });
    }

    // Generate notifications for high priority tasks
    if (highPriorityPending.length > 0 && Math.random() < 0.5) { // 50% chance
      const highPriorityTask = highPriorityPending[0];
      addNotification({
        type: 'task',
        title: 'High Priority! 🔥',
        message: `"${highPriorityTask.title}" is high priority. Your focused attention will make it happen!`,
        priority: 'high',
        color: 'red',
        taskId: highPriorityTask.id
      });
    }

    // Weekly task summary (Mondays)
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 1 && Math.random() < 0.6) { // Monday, 60% chance
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      addNotification({
        type: 'productivity',
        title: 'Weekly Kickoff! 🌟',
        message: `New week, fresh start! You have ${tasks.filter(t => t.status !== 'completed').length} tasks to conquer. Current completion rate: ${completionRate}%`,
        priority: 'medium',
        color: 'blue'
      });
    }

    dispatch({ type: 'SET_LAST_TASK_CHECK', payload: now });
  };

  const generateContextualNotification = () => {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFirstDayOfWeek = dayOfWeek === 1;
    const isLastDayOfWeek = dayOfWeek === 5;

    // Get random motivational message
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    // Generate contextual notifications based on time and conditions
    let notification = { ...randomMessage };

    // Morning motivation (6-10 AM)
    if (hour >= 6 && hour < 10) {
      const morningMessages = [
        { title: "Rise & Grind! 🌅", message: "Early bird catches the worm! Start your day with purpose.", type: "motivation" as const },
        { title: "Morning Power! ☕", message: "Fresh mind, fresh start. Today is full of possibilities!", type: "motivation" as const },
        { title: "Day Starter! 🚀", message: "Your morning routine sets the tone. Make it powerful!", type: "motivation" as const },
        { title: "Task Time! 📋", message: "Morning is perfect for tackling your most important tasks!", type: "task" as const }
      ];
      notification = morningMessages[Math.floor(Math.random() * morningMessages.length)];
    }
    
    // Afternoon push (12-16 PM)
    else if (hour >= 12 && hour < 16) {
      const afternoonMessages = [
        { title: "Midday Momentum! ⚡", message: "Don't let the afternoon slump win. Power through!", type: "productivity" as const },
        { title: "Energy Refuel! 🔋", message: "Half the day is done. Make the rest count double!", type: "motivation" as const },
        { title: "Peak Hours! 📊", message: "This is your productive prime time. Maximize it!", type: "productivity" as const },
        { title: "Task Check! ✅", message: "Perfect time to review and tackle pending tasks!", type: "task" as const }
      ];
      notification = afternoonMessages[Math.floor(Math.random() * afternoonMessages.length)];
    }
    
    // Evening wrap-up (17-20 PM)
    else if (hour >= 17 && hour < 20) {
      const eveningMessages = [
        { title: "Final Sprint! 🏃‍♂️", message: "Strong finishes create winning habits. Push to the end!", type: "motivation" as const },
        { title: "Day Closer! 🎯", message: "How you end today determines how you start tomorrow.", type: "motivation" as const },
        { title: "Achievement Mode! 🏆", message: "Turn your to-do list into a 'ta-da' list!", type: "achievement" as const },
        { title: "Evening Review! 📝", message: "Time to wrap up today's tasks and plan tomorrow's wins!", type: "task" as const }
      ];
      notification = eveningMessages[Math.floor(Math.random() * eveningMessages.length)];
    }

    // Special weekly notifications
    if (isFirstDayOfWeek) {
      notification = { 
        title: "Monday Mastery! 🌟", 
        message: "New week = new wins. Set the tone for an amazing week!", 
        type: "motivation" as const 
      };
    } else if (isLastDayOfWeek) {
      notification = { 
        title: "Friday Finisher! 🎉", 
        message: "End the week strong! Your weekend will feel so much better.", 
        type: "motivation" as const 
      };
    } else if (isWeekend) {
      notification = { 
        title: "Weekend Warrior! 🏖️", 
        message: "Even rest days can be productive. Small wins add up!", 
        type: "motivation" as const 
      };
    }

    // Assign colors based on type
    const colorMap = {
      motivation: 'blue',
      productivity: 'green', 
      task: 'purple',
      deadline: 'red',
      achievement: 'yellow',
      overdue: 'red',
      reminder: 'orange'
    } as const;

    addNotification({
      ...notification,
      priority: 'medium',
      color: colorMap[notification.type] || 'blue'
    });
  };

  // Login notification
  useEffect(() => {
    if (user && state.notifications.length === 0) {
      setTimeout(() => {
        addNotification({
          type: 'motivation',
          title: `Welcome back, ${user.name?.split(' ')[0]}! 👋`,
          message: "Ready to crush today's goals? Let's make it happen!",
          priority: 'high',
          color: 'blue'
        });
      }, 1000);
    }
  }, [user]);

  // Hourly notifications
  useEffect(() => {
    if (!user) return;

    const scheduleNextNotification = () => {
      const now = new Date();
      const shouldShow = !state.lastNotificationTime || 
        (now.getTime() - state.lastNotificationTime.getTime()) >= 60 * 60 * 1000; // 1 hour

      if (shouldShow) {
        generateContextualNotification();
      }
    };

    // Initial notification after 2 minutes of login
    const initialTimeout = setTimeout(() => {
      if (state.notifications.length <= 1) {
        generateContextualNotification();
      }
    }, 2 * 60 * 1000);

    // Then every hour
    const interval = setInterval(scheduleNextNotification, 60 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [user, state.lastNotificationTime]);

  return (
    <NotificationContext.Provider value={{
      state,
      addNotification,
      clearNotifications,
      markAsRead,
      generateContextualNotification,
      checkTaskNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};