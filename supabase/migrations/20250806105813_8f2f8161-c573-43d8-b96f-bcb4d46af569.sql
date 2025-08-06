-- Create a function to generate a unique email for admin user
-- Insert admin user with email admin_user@system.local and password 'admin'
-- Note: We'll need to create this via signup process or manually in Supabase dashboard

-- First, let's create the profile entry for when the user signs up
-- We'll use a placeholder user ID and update it later when the actual user is created
INSERT INTO public.profiles (
  user_id,
  username,
  phone_number,
  vip_level,
  total_orders,
  total_spent,
  fund_password,
  invitation_code,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin_user',
  '1111111111',
  1,
  0,
  0,
  'admin',
  'ADMINUSER001',
  now(),
  now()
) 
-- Only insert if username doesn't exist
ON CONFLICT (username) DO NOTHING;