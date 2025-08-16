-- Fix VIP level reset issue
-- Update the calculate_user_vip_level function to prevent unwanted VIP level downgrades

CREATE OR REPLACE FUNCTION public.calculate_user_vip_level(user_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_orders integer;
  user_spent numeric;
  current_vip_level integer;
  new_vip_level integer := 0;
BEGIN
  -- Get user's current VIP level
  SELECT COALESCE(vip_level, 1) INTO current_vip_level
  FROM public.profiles 
  WHERE user_id = user_id_param;
  
  -- Get user's total orders and spending
  SELECT 
    COALESCE(COUNT(*), 0),
    COALESCE(SUM(total_amount), 0)
  INTO user_orders, user_spent
  FROM public.orders 
  WHERE user_id = user_id_param AND status = 'completed';
  
  -- Find the highest VIP level the user qualifies for
  SELECT COALESCE(MAX(id), 1)  -- Default to VIP 1 instead of 0
  INTO new_vip_level
  FROM public.vip_levels
  WHERE min_orders <= user_orders AND min_spent <= user_spent;
  
  -- Chỉ cập nhật VIP level nếu user đủ điều kiện cho level cao hơn
  -- KHÔNG BAO GIỜ downgrade VIP level trừ khi có yêu cầu rõ ràng
  IF new_vip_level >= current_vip_level THEN
    -- Update user's profile with new VIP level and stats
    UPDATE public.profiles 
    SET 
      vip_level = new_vip_level,
      total_orders = user_orders,
      total_spent = user_spent,
      updated_at = now()
    WHERE user_id = user_id_param;
    
    RAISE NOTICE 'VIP level updated for user %: % -> %', user_id_param, current_vip_level, new_vip_level;
  ELSE
    -- Giữ VIP level hiện tại, chỉ cập nhật stats
    UPDATE public.profiles 
    SET 
      total_orders = user_orders,
      total_spent = user_spent,
      updated_at = now()
    WHERE user_id = user_id_param;
    
    new_vip_level := current_vip_level;
    RAISE NOTICE 'VIP level maintained for user %: % (no downgrade)', user_id_param, current_vip_level;
  END IF;
  
  RETURN new_vip_level;
END;
$$;

-- Tạo function mới để khôi phục VIP level một cách an toàn
CREATE OR REPLACE FUNCTION public.recover_user_vip_level(user_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_orders integer;
  user_spent numeric;
  current_vip_level integer;
  recovered_vip_level integer;
BEGIN
  -- Get user's current VIP level
  SELECT COALESCE(vip_level, 0) INTO current_vip_level
  FROM public.profiles 
  WHERE user_id = user_id_param;
  
  -- Chỉ khôi phục nếu VIP level = 0
  IF current_vip_level > 0 THEN
    RETURN current_vip_level;
  END IF;
  
  -- Get user's total orders and spending
  SELECT 
    COALESCE(COUNT(*), 0),
    COALESCE(SUM(total_amount), 0)
  INTO user_orders, user_spent
  FROM public.orders 
  WHERE user_id = user_id_param AND status = 'completed';
  
  -- Nếu user có đơn hàng, họ ít nhất phải có VIP 1
  IF user_orders > 0 THEN
    -- Tìm VIP level phù hợp
    SELECT COALESCE(MAX(id), 1)
    INTO recovered_vip_level
    FROM public.vip_levels
    WHERE min_orders <= user_orders AND min_spent <= user_spent;
    
    -- Cập nhật profile
    UPDATE public.profiles 
    SET 
      vip_level = recovered_vip_level,
      total_orders = user_orders,
      total_spent = user_spent,
      updated_at = now()
    WHERE user_id = user_id_param;
    
    RAISE NOTICE 'VIP level recovered for user %: 0 -> %', user_id_param, recovered_vip_level;
    RETURN recovered_vip_level;
  END IF;
  
  -- Nếu không có đơn hàng, giữ VIP 0
  RETURN 0;
END;
$$;

-- Update existing users who might have VIP level 0 to VIP level 1
UPDATE public.profiles 
SET vip_level = 1 
WHERE vip_level = 0 AND user_id IN (
  SELECT DISTINCT user_id FROM public.orders WHERE status = 'completed'
);

-- Ensure all users have at least VIP level 1
UPDATE public.profiles 
SET vip_level = 1 
WHERE vip_level = 0;
