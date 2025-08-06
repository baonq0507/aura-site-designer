-- Insert/update admin profile using the current user ID from logs
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
  '2242f68e-149a-4f13-b209-69a4a86a43b6'::uuid,
  'admin',
  '0000000000',
  1,
  0,
  0,
  '123456',
  'ADMIN001',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  fund_password = EXCLUDED.fund_password,
  invitation_code = EXCLUDED.invitation_code,
  updated_at = now();

-- Insert admin role
INSERT INTO public.user_roles (
  user_id,
  role
) VALUES (
  '2242f68e-149a-4f13-b209-69a4a86a43b6'::uuid,
  'admin'
) ON CONFLICT (user_id, role) DO NOTHING;