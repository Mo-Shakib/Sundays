/*
  # Add demo user account

  1. New User
    - Creates a demo user in auth.users table
    - Creates corresponding profile in profiles table
  
  2. Security
    - User can access their own data through existing RLS policies
    
  Note: This creates a demo user for development/testing purposes
*/

-- First, insert the user into auth.users table
-- This is required because profiles has a foreign key constraint to auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated',
  'authenticated',
  'john@example.com',
  '$2a$10$8K1p/a0dhrxSQzahKzJ22O.FGlhd.h6j1Nqo/y3oy8.5QJQXQK5jO', -- This is 'password123' hashed with bcrypt
  now(),
  null,
  '',
  null,
  '',
  null,
  '',
  '',
  null,
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "John Demo"}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null
) ON CONFLICT (id) DO NOTHING;

-- Now insert the corresponding profile
INSERT INTO profiles (
  id,
  email,
  name,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'john@example.com',
  'John Demo',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;