-- Update the handle_new_user_with_profile function to generate random invitation code
-- and track who invited whom
CREATE OR REPLACE FUNCTION public.handle_new_user_with_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  random_invitation_code TEXT;
  invitation_code_param TEXT;
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
$function$;