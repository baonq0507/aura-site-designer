-- Create storage bucket for chat attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', true);

-- Create storage policies for chat attachments
CREATE POLICY "Anyone can view chat attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'chat-attachments');

CREATE POLICY "Authenticated users can upload chat attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'chat-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own chat attachments" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'chat-attachments' AND auth.uid() IS NOT NULL);

-- Update support_messages table for attachments
ALTER TABLE public.support_messages 
ADD COLUMN file_name TEXT,
ADD COLUMN file_size INTEGER,
ADD COLUMN file_type TEXT;