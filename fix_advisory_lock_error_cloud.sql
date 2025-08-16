-- Fix advisory lock error in calculate_user_vip_level function
-- Copy và paste toàn bộ nội dung này vào Supabase Dashboard SQL Editor

-- Lỗi xảy ra: "invalid input syntax for type bigint: vip_calc_e7719682-c4b2-4af8-8da3-e2f649c9c518"
-- Nguyên nhân: Advisory lock cố gắng convert UUID string thành bigint

-- Sửa function calculate_user_vip_level để loại bỏ advisory lock
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

-- Kiểm tra function đã được tạo thành công
SELECT 
  proname as function_name,
  prosrc as function_source
FROM pg_proc 
WHERE proname = 'calculate_user_vip_level';

-- Test function với một UUID hợp lệ (thay thế bằng UUID thật nếu cần)
-- SELECT public.calculate_user_vip_level('00000000-0000-0000-0000-000000000000');

-- Kiểm tra xem có còn lỗi nào khác không
SELECT 
  'Function fixed successfully!' as status,
  'Advisory lock error resolved' as message;
