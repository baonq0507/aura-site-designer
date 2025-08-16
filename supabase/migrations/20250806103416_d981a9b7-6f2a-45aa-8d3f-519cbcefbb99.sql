-- Add VIP level tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN vip_level integer NOT NULL DEFAULT 0,
ADD COLUMN total_orders integer NOT NULL DEFAULT 0,
ADD COLUMN total_spent numeric NOT NULL DEFAULT 0;

-- Create VIP levels configuration table
CREATE TABLE public.vip_levels (
  id integer PRIMARY KEY,
  level_name text NOT NULL,
  commission_rate numeric NOT NULL,
  min_orders integer NOT NULL DEFAULT 0,
  min_spent numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on vip_levels table
ALTER TABLE public.vip_levels ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read VIP levels (public information)
CREATE POLICY "VIP levels are viewable by everyone" 
ON public.vip_levels 
FOR SELECT 
USING (true);

-- Insert default VIP levels with commission rates
INSERT INTO public.vip_levels (id, level_name, commission_rate, min_orders, min_spent) VALUES
(0, 'VIP Base', 0.06, 0, 0),
(1, 'VIP 1', 0.08, 10, 100),
(2, 'VIP 2', 0.10, 25, 250),
(3, 'VIP 3', 0.12, 50, 500),
(4, 'VIP 4', 0.14, 100, 1000),
(5, 'VIP 5', 0.16, 200, 2500),
(6, 'VIP 6', 0.18, 400, 5000),
(7, 'VIP 7', 0.20, 800, 10000),
(8, 'VIP 8', 0.22, 1500, 20000),
(9, 'VIP 9', 0.24, 3000, 50000),
(10, 'VIP 10', 0.26, 6000, 100000);

-- Create function to calculate and update user VIP level
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
  
  -- Only update VIP level if user qualifies for a higher level
  -- Never downgrade to VIP 0 unless explicitly required
  IF new_vip_level >= current_vip_level THEN
    -- Update user's profile with new VIP level and stats
    UPDATE public.profiles 
    SET 
      vip_level = new_vip_level,
      total_orders = user_orders,
      total_spent = user_spent,
      updated_at = now()
    WHERE user_id = user_id_param;
  ELSE
    -- Keep current VIP level, only update stats
    UPDATE public.profiles 
    SET 
      total_orders = user_orders,
      total_spent = user_spent,
      updated_at = now()
    WHERE user_id = user_id_param;
    
    new_vip_level := current_vip_level;
  END IF;
  
  RETURN new_vip_level;
END;
$$;

-- Create trigger to automatically update VIP level when orders are completed
CREATE OR REPLACE FUNCTION public.update_vip_level_on_order_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only update VIP level when order status changes to completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM public.calculate_user_vip_level(NEW.user_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for order completion
CREATE TRIGGER update_vip_level_on_order_completion
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vip_level_on_order_completion();