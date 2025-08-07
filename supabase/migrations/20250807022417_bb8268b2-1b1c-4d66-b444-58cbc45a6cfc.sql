-- Update the default VIP level for new users from 0 to 1
ALTER TABLE public.profiles 
ALTER COLUMN vip_level SET DEFAULT 1;

-- Update the trigger function to set VIP level 1 for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_with_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    username, 
    phone_number, 
    fund_password, 
    invitation_code,
    vip_level
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'phone_number',
    NEW.raw_user_meta_data ->> 'fund_password',
    NEW.raw_user_meta_data ->> 'invitation_code',
    1  -- Set VIP level 1 for new users
  );
  RETURN NEW;
END;
$function$;