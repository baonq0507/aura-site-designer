-- Fix RLS policies for anonymous users in support chats

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own chats" ON public.support_chats;
DROP POLICY IF EXISTS "Users can view their own chats" ON public.support_chats;
DROP POLICY IF EXISTS "Users can create messages in their chats" ON public.support_messages;
DROP POLICY IF EXISTS "Users can view messages in their chats" ON public.support_messages;

-- Create updated policies for support_chats
CREATE POLICY "Users can create their own chats" 
ON public.support_chats 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) 
  OR 
  (user_id IS NULL AND browser_id IS NOT NULL)
);

CREATE POLICY "Users can view their own chats" 
ON public.support_chats 
FOR SELECT 
USING (
  (auth.uid() = user_id) 
  OR 
  (user_id IS NULL AND browser_id IS NOT NULL)
);

CREATE POLICY "Users can update their own chats" 
ON public.support_chats 
FOR UPDATE 
USING (
  (auth.uid() = user_id) 
  OR 
  (user_id IS NULL AND browser_id IS NOT NULL)
);

-- Create updated policies for support_messages  
CREATE POLICY "Users can create messages in their chats" 
ON public.support_messages 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.support_chats sc 
    WHERE sc.id = support_messages.chat_id 
    AND (
      (sc.user_id = auth.uid()) 
      OR 
      (sc.user_id IS NULL AND sc.browser_id IS NOT NULL)
    )
  )
);

CREATE POLICY "Users can view messages in their chats" 
ON public.support_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.support_chats sc 
    WHERE sc.id = support_messages.chat_id 
    AND (
      (sc.user_id = auth.uid()) 
      OR 
      (sc.user_id IS NULL AND sc.browser_id IS NOT NULL)
    )
  )
);

CREATE POLICY "Users can update messages in their chats" 
ON public.support_messages 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.support_chats sc 
    WHERE sc.id = support_messages.chat_id 
    AND (
      (sc.user_id = auth.uid()) 
      OR 
      (sc.user_id IS NULL AND sc.browser_id IS NOT NULL)
    )
  )
);