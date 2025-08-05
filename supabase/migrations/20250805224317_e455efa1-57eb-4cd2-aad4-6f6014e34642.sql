-- Update orders table to include status and user_id if not exists
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;