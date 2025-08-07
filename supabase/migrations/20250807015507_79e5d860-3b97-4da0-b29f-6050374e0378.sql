-- Add foreign key relationship between orders and profiles
ALTER TABLE public.orders 
ADD CONSTRAINT fk_orders_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Update orders status column to use enum instead of text for better type safety
ALTER TABLE public.orders 
ALTER COLUMN status TYPE text,
ADD CONSTRAINT check_order_status 
CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'));