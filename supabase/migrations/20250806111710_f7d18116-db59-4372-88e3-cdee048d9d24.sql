-- Add RLS policies for vip_levels table to allow admin to update
CREATE POLICY "Admins can update VIP levels" 
ON public.vip_levels 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert VIP levels" 
ON public.vip_levels 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete VIP levels" 
ON public.vip_levels 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Update the image URLs manually for the uploaded images
UPDATE public.vip_levels 
SET image_url = 'https://zkgglasdvehqqcyzpbgz.supabase.co/storage/v1/object/public/vip-images/vip-0-1754478942828.png'
WHERE id = 0;

UPDATE public.vip_levels 
SET image_url = 'https://zkgglasdvehqqcyzpbgz.supabase.co/storage/v1/object/public/vip-images/vip-1-1754478953580.png'
WHERE id = 1;