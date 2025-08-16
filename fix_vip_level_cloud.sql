-- Fix VIP level reset issue for Supabase Cloud
-- Copy và paste toàn bộ nội dung này vào Supabase Dashboard SQL Editor

-- 1. Cập nhật function calculate_user_vip_level để tránh race condition
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
  lock_key text;
BEGIN
  -- Sử dụng advisory lock để tránh race condition
  lock_key := 'vip_calc_' || user_id_param::text;
  
  -- Chờ tối đa 5 giây để lấy lock
  IF NOT pg_try_advisory_xact_lock(lock_key::bigint) THEN
    -- Nếu không lấy được lock, trả về VIP level hiện tại
    SELECT COALESCE(vip_level, 1) INTO current_vip_level
    FROM public.profiles 
    WHERE user_id = user_id_param;
    RETURN current_vip_level;
  END IF;

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

-- 2. Tạo function mới để khôi phục VIP level một cách an toàn
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

-- 3. Khôi phục VIP level cho các user bị reset về 0
UPDATE public.profiles 
SET vip_level = 1 
WHERE vip_level = 0 AND user_id IN (
  SELECT DISTINCT user_id FROM public.orders WHERE status = 'completed'
);

-- 4. Đảm bảo tất cả user có ít nhất VIP level 1
UPDATE public.profiles 
SET vip_level = 1 
WHERE vip_level = 0;

-- 5. Hiển thị kết quả
SELECT 
  'Migration completed successfully!' as status,
  COUNT(*) as total_users,
  COUNT(CASE WHEN vip_level = 0 THEN 1 END) as users_with_vip_0,
  COUNT(CASE WHEN vip_level > 0 THEN 1 END) as users_with_vip_1_plus
FROM public.profiles;
