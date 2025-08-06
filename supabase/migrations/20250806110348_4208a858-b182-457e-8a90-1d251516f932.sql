-- Add balance and lock status columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS balance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS task_locked BOOLEAN DEFAULT false;