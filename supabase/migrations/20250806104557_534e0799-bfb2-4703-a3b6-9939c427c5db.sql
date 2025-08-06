-- Insert admin user directly into auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@admin.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Insert admin profile
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
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin',
  '0000000000',
  1,
  0,
  0,
  0,
  '123456',
  'ADMIN001',
  now(),
  now()
) ON CONFLICT (user_id) DO NOTHING;

-- Insert admin role
INSERT INTO public.user_roles (
  user_id,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin'
) ON CONFLICT (user_id, role) DO NOTHING;