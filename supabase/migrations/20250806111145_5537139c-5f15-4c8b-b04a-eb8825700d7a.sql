-- Create storage bucket for VIP images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vip-images', 'vip-images', true);

-- Create storage policies for VIP images
CREATE POLICY "VIP images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'vip-images');

CREATE POLICY "Admins can upload VIP images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'vip-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update VIP images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'vip-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete VIP images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'vip-images' AND has_role(auth.uid(), 'admin'));

-- Add image_url column to vip_levels table
ALTER TABLE public.vip_levels 
ADD COLUMN IF NOT EXISTS image_url TEXT;