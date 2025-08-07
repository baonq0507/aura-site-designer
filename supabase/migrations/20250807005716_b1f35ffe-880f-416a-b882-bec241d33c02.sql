-- Create support chats table for tracking chat sessions
CREATE TABLE public.support_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NULL, -- Null for anonymous users
  browser_id TEXT NOT NULL, -- For anonymous users
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'resolved')),
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create support messages table for chat messages
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID NOT NULL REFERENCES public.support_chats(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  sender_id UUID NULL, -- Null for anonymous users
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.support_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_chats
CREATE POLICY "Users can view their own chats" 
ON public.support_chats 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (user_id IS NULL AND browser_id = auth.jwt() ->> 'browser_id')
);

CREATE POLICY "Users can create their own chats" 
ON public.support_chats 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  (user_id IS NULL AND browser_id IS NOT NULL)
);

CREATE POLICY "Admins can view all chats" 
ON public.support_chats 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for support_messages
CREATE POLICY "Users can view messages in their chats" 
ON public.support_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.support_chats sc 
    WHERE sc.id = chat_id AND (
      sc.user_id = auth.uid() OR 
      (sc.user_id IS NULL AND sc.browser_id = auth.jwt() ->> 'browser_id')
    )
  )
);

CREATE POLICY "Users can create messages in their chats" 
ON public.support_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_chats sc 
    WHERE sc.id = chat_id AND (
      sc.user_id = auth.uid() OR 
      (sc.user_id IS NULL AND sc.browser_id = auth.jwt() ->> 'browser_id')
    )
  )
);

CREATE POLICY "Admins can view all messages" 
ON public.support_messages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create indexes for better performance
CREATE INDEX idx_support_chats_user_id ON public.support_chats(user_id);
CREATE INDEX idx_support_chats_browser_id ON public.support_chats(browser_id);
CREATE INDEX idx_support_chats_status ON public.support_chats(status);
CREATE INDEX idx_support_messages_chat_id ON public.support_messages(chat_id);
CREATE INDEX idx_support_messages_sender_type ON public.support_messages(sender_type);

-- Create trigger for updating timestamps
CREATE TRIGGER update_support_chats_updated_at
BEFORE UPDATE ON public.support_chats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for the tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;

-- Set replica identity for realtime
ALTER TABLE public.support_chats REPLICA IDENTITY FULL;
ALTER TABLE public.support_messages REPLICA IDENTITY FULL;