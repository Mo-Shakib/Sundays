/*
  # Create tasks table

  1. New Tables
    - `tasks`
      - `id` (serial, primary key)
      - `name` (text, required)
      - `description` (text, required)
      - `assignee` (text, required)
      - `avatar` (text, required)
      - `avatar_color` (text, required)
      - `project_id` (integer, foreign key to projects)
      - `status` (text, required)
      - `status_color` (text, required)
      - `priority` (text, required)
      - `due_date` (text, required)
      - `tags` (text array, default empty)
      - `comments` (integer, default 0)
      - `files` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `tasks` table
    - Add policies for authenticated users to manage their own tasks

  3. Indexes
    - Add index on user_id for better query performance
    - Add index on project_id for better query performance
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  assignee TEXT NOT NULL,
  avatar TEXT NOT NULL,
  avatar_color TEXT NOT NULL,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  status_color TEXT NOT NULL,
  priority TEXT NOT NULL,
  due_date TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  comments INTEGER DEFAULT 0,
  files INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_project_id_idx ON tasks(project_id);

-- Create trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();