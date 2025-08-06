-- Create unique constraint for profiles if not exists
ALTER TABLE public.profiles ADD CONSTRAINT IF NOT EXISTS profiles_user_id_unique UNIQUE (user_id);

-- Create unique constraint for user_roles if not exists  
ALTER TABLE public.user_roles ADD CONSTRAINT IF NOT EXISTS user_roles_user_id_role_unique UNIQUE (user_id, role);

-- Insert admin profile with known admin user ID (will be used when creating the account)
INSERT INTO public.profiles (
  user_id,
  username,
  phone_number,
  vip_level,
  total_orders,
  total_spent,
  balance,
  fund_password,
  invitation_code,
  created_at,
  updated_at
) VALUES (
  '2242f68e-149a-4f13-b209-69a4a86a43b6'::uuid,
  'admin',
  '0000000000',
  1,
  0,
  0,
  1000000,
  '123456',
  'ADMIN001',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  balance = 1000000,
  fund_password = EXCLUDED.fund_password,
  invitation_code = EXCLUDED.invitation_code;

-- Insert admin role
INSERT INTO public.user_roles (
  user_id,
  role
) VALUES (
  '2242f68e-149a-4f13-b209-69a4a86a43b6'::uuid,
  'admin'
) ON CONFLICT (user_id, role) DO NOTHING;