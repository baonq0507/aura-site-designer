-- Add image support to support_messages table
ALTER TABLE public.support_messages 
ADD COLUMN message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image'));

ALTER TABLE public.support_messages 
ADD COLUMN image_url TEXT;

-- Update existing messages to have text type
UPDATE public.support_messages SET message_type = 'text' WHERE message_type IS NULL;