import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X, MessageCircle, User, Headphones, Paperclip, Image, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { playNotificationSound, showNotification, requestNotificationPermission } from "@/utils/notifications";

interface SupportMessage {
  id: string;
  message: string;
  sender_type: 'user' | 'admin';
  created_at: string;
  is_read: boolean;
  message_type?: string;
  image_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
}

interface SupportChat {
  id: string;
  title?: string;
  status: 'open' | 'closed' | 'resolved';
  created_at: string;
  last_message_at?: string;
}

interface SupportChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SupportChat = ({ open, onOpenChange }: SupportChatProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState<SupportChat | null>(null);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState<string | null>(null);
  const [browserId, setBrowserId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate or get browser ID for anonymous users
  useEffect(() => {
    let storedBrowserId = localStorage.getItem('support_browser_id');
    if (!storedBrowserId) {
      storedBrowserId = `browser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('support_browser_id', storedBrowserId);
    }
    setBrowserId(storedBrowserId);
    
    // Request notification permission when component mounts
    requestNotificationPermission();
  }, []);

  // Check auth status and fetch username
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Fetch username from profiles table if user exists
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single();
        
        setUsername(profile?.username || null);
      } else {
        setUsername(null);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      // Fetch username when user changes
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', session.user.id)
          .single();
        
        setUsername(profile?.username || null);
      } else {
        setUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load or create chat when dialog opens
  useEffect(() => {
    if (open && browserId) {
      loadOrCreateChat();
    }
  }, [open, user, browserId]);

  // Real-time subscription for messages
  useEffect(() => {
    if (!currentChat) return;

    const channel = supabase
      .channel('support_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `chat_id=eq.${currentChat.id}`
        },
        (payload) => {
          const newMessage = payload.new as SupportMessage;
          setMessages(prev => [...prev, newMessage]);
          
          // Show notification and play sound for admin messages
          if (newMessage.sender_type === 'admin') {
            playNotificationSound();
            showNotification(t("newMessageFromSupport"), newMessage.message.substring(0, 100) + (newMessage.message.length > 100 ? "..." : ""));
            toast({
              title: t("newMessageFromSupport"),
              description: newMessage.message.substring(0, 100) + (newMessage.message.length > 100 ? "..." : ""),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentChat, toast]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadOrCreateChat = async () => {
    try {
      setLoading(true);

      console.log('Loading chat for:', { user: user?.id, browserId });

      // First try to find existing chat
      let query = supabase
        .from('support_chats')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(1);

      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        // For anonymous users, find chat by browser_id with null user_id
        query = query.eq('browser_id', browserId).is('user_id', null);
      }

      const { data: existingChats, error } = await query;

      if (error) {
        console.error('Error finding existing chats:', error);
        throw error;
      }

      console.log('Existing chats found:', existingChats);

      let chat: SupportChat;

      if (existingChats && existingChats.length > 0) {
        chat = existingChats[0] as SupportChat;
        console.log('Using existing chat:', chat.id);
      } else {
        // Create new chat
        const chatData = {
          user_id: user?.id || null,
          browser_id: browserId,
          title: user ? `Chat với ${user.email}` : `Chat khách #${browserId.slice(-6)}`,
          status: 'open' as const
        };

        console.log('Creating new chat with data:', chatData);

        const { data: newChat, error: createError } = await supabase
          .from('support_chats')
          .insert([chatData])
          .select()
          .single();

        if (createError) {
          console.error('Error creating chat:', createError);
          throw createError;
        }
        
        chat = newChat as SupportChat;
        console.log('Created new chat:', chat.id);

        // Send initial message
        const initialMessageData = {
          chat_id: chat.id,
          sender_type: 'user' as const,
          sender_id: user?.id || null,
          message: t('support.initial.message')
        };

        console.log('Sending initial message:', initialMessageData);

        const { error: messageError } = await supabase
          .from('support_messages')
          .insert([initialMessageData]);

        if (messageError) {
          console.error('Error sending initial message:', messageError);
          // Don't throw here as chat was created successfully
        }
      }

      setCurrentChat(chat);
      await loadMessages(chat.id);
    } catch (error) {
      console.error('Error loading/creating chat:', error);
      toast({
        title: t("error"),
        description: t("errorLoadingChat"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      console.log('Loading messages for chat:', chatId);
      
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        throw error;
      }
      
      console.log('Messages loaded:', data?.length || 0);
      setMessages((data || []) as SupportMessage[]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${currentChat?.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('chat-attachments')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('chat-attachments')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !currentChat) return;

    try {
      setUploading(true);
      let fileUrl = null;
      let messageType = 'text';

      console.log('Sending message for chat:', currentChat.id, 'user:', user?.id, 'browser:', browserId);

      // Upload file if selected
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile);
        messageType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
      }

      const messageData = {
        chat_id: currentChat.id,
        sender_type: 'user' as const,
        sender_id: user?.id || null,
        message: newMessage.trim() || (selectedFile ? selectedFile.name : ''),
        message_type: messageType,
        image_url: fileUrl,
        file_name: selectedFile?.name || null,
        file_size: selectedFile?.size || null,
        file_type: selectedFile?.type || null
      };

      console.log('Message data:', messageData);

      const { error } = await supabase
        .from('support_messages')
        .insert([messageData]);

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      // Update chat's last message time
      await supabase
        .from('support_chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', currentChat.id);

      setNewMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t("error"),
        description: t("errorSendingMessage"),
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-[95vw] max-w-sm h-[80vh] max-h-[600px] flex flex-col p-0 sm:w-[400px] sm:max-w-[400px] sm:h-[600px] sm:max-h-[600px] md:w-[450px] md:max-w-[450px]" 
        hideCloseButton
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0,
          maxWidth: 'min(95vw, 450px)',
          width: 'min(95vw, 450px)',
          zIndex: 9999
        }}
      >
        <DialogHeader className="bg-gradient-primary text-white p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Headphones className="w-5 h-5" />
              <DialogTitle className="text-white">{t("supportChat")}</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {currentChat && (
            <div className="text-sm text-white/80">
              {user ? `Đăng nhập: ${username || user.email}` : `Khách: #${browserId.slice(-6)}`}
            </div>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender_type === 'user' ? 'order-1' : 'order-2'}`}>
                      <Card className={`p-3 ${
                        message.sender_type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          {message.sender_type === 'admin' ? (
                            <Headphones className="w-3 h-3" />
                          ) : (
                            <User className="w-3 h-3" />
                          )}
                          <span className="text-xs opacity-70">
                            {message.sender_type === 'admin' ? 'Hỗ trợ' : 'Bạn'}
                          </span>
                          <span className="text-xs opacity-70">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                        
                        {/* Message content based on type */}
                        {message.message_type === 'image' && message.image_url ? (
                          <div className="space-y-2">
                            <img 
                              src={message.image_url} 
                              alt={message.file_name || "Uploaded image"} 
                              className="max-w-48 max-h-32 w-auto h-auto rounded-lg cursor-pointer hover:opacity-80 transition-opacity object-cover"
                              onClick={() => window.open(message.image_url, '_blank')}
                            />
                            {message.file_name && (
                              <p className="text-xs opacity-70">{message.file_name}</p>
                            )}
                          </div>
                        ) : message.message_type === 'file' && message.image_url ? (
                          <div className="flex items-center space-x-2 p-2 bg-background/10 rounded-lg">
                            <Paperclip className="w-4 h-4" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{message.file_name}</p>
                              {message.file_size && (
                                <p className="text-xs opacity-70">
                                  {(message.file_size / 1024).toFixed(1)}KB
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(message.image_url, '_blank')}
                              className="h-6 w-6 p-0"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          message.message && (
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          )
                        )}
                      </Card>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background flex-shrink-0">
              {selectedFile && (
                <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {selectedFile.type.startsWith('image/') ? (
                      <Image className="w-4 h-4" />
                    ) : (
                      <Paperclip className="w-4 h-4" />
                    )}
                    <span className="text-sm truncate">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(selectedFile.size / 1024).toFixed(1)}KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
              <div className="flex space-x-2">
                <div className="flex space-x-1">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                    }}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="h-9 w-9 p-0"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setSelectedFile(file);
                    }}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="h-9 w-9 p-0"
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("enterMessage")}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={(!newMessage.trim() && !selectedFile) || uploading}
                  size="sm"
                >
                  {uploading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SupportChat;