-- Update admin profile for the correct user ID without username conflict
UPDATE public.profiles 
SET fund_password = '123456',
    invitation_code = 'ADMIN001',
    updated_at = now()
WHERE user_id = 'a08eb9a3-7b14-48b2-a2c0-50895b06fb9c';

-- Insert admin role for the correct user ID  
INSERT INTO public.user_roles (
  user_id,
  role
) VALUES (
  'a08eb9a3-7b14-48b2-a2c0-50895b06fb9c'::uuid,
  'admin'
) ON CONFLICT (user_id, role) DO NOTHING;