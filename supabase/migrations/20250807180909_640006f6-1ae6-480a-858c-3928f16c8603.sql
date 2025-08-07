-- Fix security issues: add proper search_path to functions

-- Update function to generate unique emails with proper security
CREATE OR REPLACE FUNCTION public.generate_unique_email(username_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Generate a unique email based on username + random string
  RETURN lower(username_input) || '_' || substring(md5(random()::text || clock_timestamp()::text) from 1 for 8) || '@internal.local';
END;
$$;

-- Update function to find user by identifier with proper security
CREATE OR REPLACE FUNCTION public.find_user_by_identifier(identifier_input text)
RETURNS table(user_id uuid, generated_email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    u.email as generated_email
  FROM public.profiles p
  JOIN auth.users u ON p.user_id = u.id
  WHERE p.username = identifier_input OR p.phone_number = identifier_input
  LIMIT 1;
END;
$$;