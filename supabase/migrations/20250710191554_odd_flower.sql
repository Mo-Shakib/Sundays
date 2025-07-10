/*
  # Initial Schema for Project Management App

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `projects`
      - `id` (bigint, primary key)
      - `name` (text)
      - `description` (text)
      - `color` (text)
      - `dot_color` (text)
      - `archived` (boolean, default false)
      - `user_id` (uuid, foreign key to profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tasks`
      - `id` (bigint, primary key)
      - `name` (text)
      - `description` (text)
      - `assignee` (text)
      - `avatar` (text)
      - `avatar_color` (text)
      - `project_id` (bigint, foreign key to projects)
      - `status` (text)
      - `status_color` (text)
      - `priority` (text)
      - `due_date` (date)
      - `tags` (text array)
      - `comments` (integer, default 0)
      - `files` (integer, default 0)
      - `user_id` (uuid, foreign key to profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  color text NOT NULL DEFAULT 'bg-blue-200',
  dot_color text NOT NULL DEFAULT 'bg-blue-500',
  archived boolean DEFAULT false,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  assignee text NOT NULL,
  avatar text NOT NULL,
  avatar_color text NOT NULL,
  project_id bigint NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Pending',
  status_color text NOT NULL DEFAULT 'bg-purple-100 text-purple-800',
  priority text NOT NULL DEFAULT 'Medium',
  due_date date NOT NULL,
  tags text[] DEFAULT '{}',
  comments integer DEFAULT 0,
  files integer DEFAULT 0,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for projects
CREATE POLICY "Users can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for tasks
CREATE POLICY "Users can read own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove in production)
-- This will only work after a user signs up
-- INSERT INTO profiles (id, email, name) VALUES 
--   ('00000000-0000-0000-0000-000000000000', 'demo@example.com', 'Demo User');