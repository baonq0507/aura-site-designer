-- Add bonus order fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN bonus_order_count integer DEFAULT 0,
ADD COLUMN bonus_amount numeric DEFAULT 0;