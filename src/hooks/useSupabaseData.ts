import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  dotColor: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  assignee: string;
  avatar: string;
  avatarColor: string;
  projectId: number;
  status: string;
  statusColor: string;
  priority: string;
  dueDate: string;
  tags: string[];
  comments: number;
  files: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useSupabaseData = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform database row to frontend format
  const transformProject = (row: any): Project => ({
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color,
    dotColor: row.dot_color,
    archived: row.archived,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id
  });

  const transformTask = (row: any): Task => ({
    id: row.id,
    name: row.name,
    description: row.description,
    assignee: row.assignee,
    avatar: row.avatar,
    avatarColor: row.avatar_color,
    projectId: row.project_id,
    status: row.status,
    statusColor: row.status_color,
    priority: row.priority,
    dueDate: row.due_date,
    tags: row.tags || [],
    comments: row.comments || 0,
    files: row.files || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id
  });

  // Load data from Supabase
  const loadData = async () => {
    if (!user?.id) return;
    
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError('Supabase configuration missing. Please connect to Supabase.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        if (projectsError.code === '42P01') {
          throw new Error('Database tables not found. Please run the database migrations.');
        }
        throw projectsError;
      }

      // Load tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tasksError) {
        if (tasksError.code === '42P01') {
          throw new Error('Database tables not found. Please run the database migrations.');
        }
        throw tasksError;
      }

      setProjects((projectsData || []).map(transformProject));
      setTasks((tasksData || []).map(transformTask));
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Create or update user profile
  const ensureProfile = async () => {
    if (!user?.id) return;

    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.name
          });

        if (error) throw error;
      }
    } catch (err) {
      console.error('Error ensuring profile:', err);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      ensureProfile().then(() => loadData());
    } else {
      setProjects([]);
      setTasks([]);
      setLoading(false);
    }
  }, [user?.id]);

  // Project operations
  const addProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          description: projectData.description,
          color: projectData.color,
          dot_color: projectData.dotColor,
          archived: projectData.archived,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newProject = transformProject(data);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      console.error('Error adding project:', err);
      throw err;
    }
  };

  const updateProject = async (id: number, updates: Partial<Project>) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.dotColor !== undefined) dbUpdates.dot_color = updates.dotColor;
      if (updates.archived !== undefined) dbUpdates.archived = updates.archived;

      const { data, error } = await supabase
        .from('projects')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedProject = transformProject(data);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== id));
      setTasks(prev => prev.filter(t => t.projectId !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  // Task operations
  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          name: taskData.name,
          description: taskData.description,
          assignee: taskData.assignee,
          avatar: taskData.avatar,
          avatar_color: taskData.avatarColor,
          project_id: taskData.projectId,
          status: taskData.status,
          status_color: taskData.statusColor,
          priority: taskData.priority,
          due_date: taskData.dueDate,
          tags: taskData.tags,
          comments: taskData.comments,
          files: taskData.files,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newTask = transformTask(data);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.assignee !== undefined) dbUpdates.assignee = updates.assignee;
      if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
      if (updates.avatarColor !== undefined) dbUpdates.avatar_color = updates.avatarColor;
      if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.statusColor !== undefined) dbUpdates.status_color = updates.statusColor;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.comments !== undefined) dbUpdates.comments = updates.comments;
      if (updates.files !== undefined) dbUpdates.files = updates.files;

      const { data, error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedTask = transformTask(data);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  return {
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
    refreshData: loadData
  };
};