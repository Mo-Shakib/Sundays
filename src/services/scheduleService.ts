import { supabase } from '../lib/supabase';

export interface ScheduleItem {
  id?: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  date: string;
  type: 'meeting' | 'task';
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const scheduleService = {
  // Get all schedule items for the current user
  async getScheduleItems(): Promise<ScheduleItem[]> {
    const { data, error } = await supabase
      .from('schedule_items')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching schedule items:', error);
      throw error;
    }

    return data || [];
  },

  // Get schedule items for a specific date
  async getScheduleItemsForDate(date: string): Promise<ScheduleItem[]> {
    const { data, error } = await supabase
      .from('schedule_items')
      .select('*')
      .eq('date', date)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching schedule items for date:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new schedule item
  async createScheduleItem(scheduleItem: Omit<ScheduleItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ScheduleItem> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('schedule_items')
      .insert([{
        ...scheduleItem,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating schedule item:', error);
      throw error;
    }

    return data;
  },

  // Update a schedule item
  async updateScheduleItem(id: number, updates: Partial<ScheduleItem>): Promise<ScheduleItem> {
    const { data, error } = await supabase
      .from('schedule_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating schedule item:', error);
      throw error;
    }

    return data;
  },

  // Delete a schedule item
  async deleteScheduleItem(id: number): Promise<void> {
    const { error } = await supabase
      .from('schedule_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting schedule item:', error);
      throw error;
    }
  }
};