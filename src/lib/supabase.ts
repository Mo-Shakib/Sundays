import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: number
          name: string
          description: string
          color: string
          dot_color: string
          archived: boolean
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          name: string
          description: string
          color: string
          dot_color: string
          archived?: boolean
          user_id: string
        }
        Update: {
          name?: string
          description?: string
          color?: string
          dot_color?: string
          archived?: boolean
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: number
          name: string
          description: string
          assignee: string
          avatar: string
          avatar_color: string
          project_id: number
          status: string
          status_color: string
          priority: string
          due_date: string
          tags: string[]
          comments: number
          files: number
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          name: string
          description: string
          assignee: string
          avatar: string
          avatar_color: string
          project_id: number
          status: string
          status_color: string
          priority: string
          due_date: string
          tags?: string[]
          comments?: number
          files?: number
          user_id: string
        }
        Update: {
          name?: string
          description?: string
          assignee?: string
          avatar?: string
          avatar_color?: string
          project_id?: number
          status?: string
          status_color?: string
          priority?: string
          due_date?: string
          tags?: string[]
          comments?: number
          files?: number
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
        }
        Update: {
          email?: string
          name?: string
          updated_at?: string
        }
      }
    }
  }
}