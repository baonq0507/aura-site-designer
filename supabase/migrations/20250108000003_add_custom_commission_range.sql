-- Add custom commission range fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN custom_commission_min numeric DEFAULT NULL,
ADD COLUMN custom_commission_max numeric DEFAULT NULL,
ADD COLUMN use_custom_commission boolean DEFAULT false;

-- Add comment to explain the fields
COMMENT ON COLUMN public.profiles.custom_commission_min IS 'Minimum commission amount for custom commission range (overrides VIP level commission)';
COMMENT ON COLUMN public.profiles.custom_commission_max IS 'Maximum commission amount for custom commission range (overrides VIP level commission)';
COMMENT ON COLUMN public.profiles.use_custom_commission IS 'Whether to use custom commission range instead of VIP level commission rate';

-- Create index for better performance when querying custom commission users
CREATE INDEX idx_profiles_custom_commission ON public.profiles(use_custom_commission) WHERE use_custom_commission = true;

-- Update the existing commission calculation function to consider custom commission ranges
CREATE OR REPLACE FUNCTION public.calculate_order_commission(
  user_id_param uuid,
  order_amount numeric
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_profile record;
  commission_amount numeric;
  random_factor numeric;
BEGIN
  -- Get user profile with custom commission settings
  SELECT 
    vip_level,
    custom_commission_min,
    custom_commission_max,
    use_custom_commission
  INTO user_profile
  FROM public.profiles 
  WHERE user_id = user_id_param;
  
  -- If user has custom commission range enabled
  IF user_profile.use_custom_commission 
     AND user_profile.custom_commission_min IS NOT NULL 
     AND user_profile.custom_commission_max IS NOT NULL
     AND user_profile.custom_commission_max >= user_profile.custom_commission_min THEN
    
    -- Generate random commission within the custom range
    random_factor := random(); -- Random value between 0 and 1
    commission_amount := user_profile.custom_commission_min + 
                       (user_profile.custom_commission_max - user_profile.custom_commission_min) * random_factor;
    
    RETURN commission_amount;
  ELSE
    -- Use VIP level commission rate (existing logic)
    SELECT COALESCE(commission_rate, 0.06) * order_amount
    INTO commission_amount
    FROM public.vip_levels
    WHERE id = COALESCE(user_profile.vip_level, 0);
    
    RETURN commission_amount;
  END IF;
END;
$$;
