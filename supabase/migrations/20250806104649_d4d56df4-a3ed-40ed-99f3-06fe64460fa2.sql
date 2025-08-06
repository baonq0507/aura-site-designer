-- Check if constraint exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'profiles_user_id_unique' 
        AND table_name = 'profiles'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
    END IF;
END$$;

-- Insert/update admin profile using the current user ID from logs
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