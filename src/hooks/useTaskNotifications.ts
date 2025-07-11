import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

interface Task {
  id: string;
  title: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

export const useTaskNotifications = (tasks: Task[]) => {
  const { checkTaskNotifications } = useNotifications();

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Check task notifications every 30 minutes
      const interval = setInterval(() => {
        checkTaskNotifications(tasks);
      }, 30 * 60 * 1000);

      // Initial check
      setTimeout(() => {
        checkTaskNotifications(tasks);
      }, 5000); // Wait 5 seconds after tasks load

      return () => clearInterval(interval);
    }
  }, [tasks, checkTaskNotifications]);

  // Check when tasks change (new task added, status updated, etc.)
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      const timeoutId = setTimeout(() => {
        checkTaskNotifications(tasks);
      }, 1000); // Small delay to avoid excessive notifications

      return () => clearTimeout(timeoutId);
    }
  }, [tasks]);
};