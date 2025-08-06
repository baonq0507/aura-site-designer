-- Insert admin role for current logged in user
INSERT INTO public.user_roles (
  user_id,
  role
) VALUES (
  '2242f68e-149a-4f13-b209-69a4a86a43b6'::uuid,
  'admin'
) ON CONFLICT (user_id, role) DO NOTHING;

-- Update profile to have admin username if not already set
UPDATE public.profiles 
SET username = COALESCE(username, 'admin'),
    updated_at = now()
WHERE user_id = '2242f68e-149a-4f13-b209-69a4a86a43b6';