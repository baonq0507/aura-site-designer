-- Remove email requirement from auth and use username/phone as primary login
-- Create a function to handle auth without email

-- First, let's update the user creation function to not rely on email
CREATE OR REPLACE FUNCTION public.handle_new_user_with_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  random_invitation_code TEXT;
  invitation_code_param TEXT;
  random_email TEXT;
BEGIN
  -- Generate a random 8-character invitation code (letters and numbers)
  random_invitation_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
  
  -- Get the invitation code that was used during signup
  invitation_code_param := NEW.raw_user_meta_data ->> 'invitation_code';
  
  -- Insert the new profile
  INSERT INTO public.profiles (
    user_id, 
    username, 
    phone_number, 
    fund_password, 
    invitation_code,  -- User's own invitation code (generated)
    invited_by_code,  -- The invitation code they used to sign up
    vip_level
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'phone_number',
    NEW.raw_user_meta_data ->> 'fund_password',
    random_invitation_code,
    CASE 
      WHEN invitation_code_param IS NOT NULL AND invitation_code_param != '' 
      THEN invitation_code_param 
      ELSE NULL 
    END,
    1  -- Set VIP level 1 for new users
  );
  
  RETURN NEW;
END;
$$;

-- Create a function to generate unique emails for auth.users table
-- (Supabase auth requires email, but we'll generate fake ones)
CREATE OR REPLACE FUNCTION public.generate_unique_email(username_input text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  -- Generate a unique email based on username + random string
  RETURN lower(username_input) || '_' || substring(md5(random()::text || clock_timestamp()::text) from 1 for 8) || '@internal.local';
END;
$$;

-- Function to find user by username or phone number
CREATE OR REPLACE FUNCTION public.find_user_by_identifier(identifier_input text)
RETURNS table(user_id uuid, generated_email text)
LANGUAGE plpgsql
SECURITY DEFINER
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