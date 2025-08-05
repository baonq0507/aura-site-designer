-- Fix security issues: Drop triggers first, then recreate functions with secure search_path
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP FUNCTION IF EXISTS public.update_updated_at_column();
DROP FUNCTION IF EXISTS public.handle_new_user_with_profile();

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user_with_profile()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    username, 
    phone_number, 
    fund_password, 
    invitation_code
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'phone_number',
    NEW.raw_user_meta_data ->> 'fund_password',
    NEW.raw_user_meta_data ->> 'invitation_code'
  );
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();