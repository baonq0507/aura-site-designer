import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, MessageCircle, User, Clock, CheckCircle2, X, Paperclip, Download, Image as ImageIcon, Edit, Trash2, Save, RotateCcw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { playNotificationSound, showNotification, requestNotificationPermission } from "@/utils/notifications";

interface SupportMessage {
  id: string;
  chat_id: string;
  message: string;
  sender_type: 'user' | 'admin';
  sender_id: string | null;
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
  user_id: string | null;
  browser_id: string;
  title: string | null;
  status: 'open' | 'closed' | 'resolved';
  created_at: string;
  last_message_at: string | null;
  unread_count?: number;
}

const SupportChatManagement = () => {
  const { toast } = useToast();
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<SupportChat | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    loadChats();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      markMessagesAsRead(selectedChat.id);
    }
  }, [selectedChat]);

  // Real-time subscriptions
  useEffect(() => {
    const chatChannel = supabase
      .channel('support_chats_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_chats'
        },
        () => {
          loadChats();
        }
      )
      .subscribe();

    const messageChannel = supabase
      .channel('support_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages'
        },
        (payload) => {
          const newMessage = payload.new as SupportMessage;
          
          // Update messages if it's for the current chat
          if (selectedChat && newMessage.chat_id === selectedChat.id) {
            setMessages(prev => [...prev, newMessage]);
            
            // Auto-mark as read if from user
            if (newMessage.sender_type === 'user') {
              setTimeout(() => markMessagesAsRead(selectedChat.id), 500);
            }
          }
          
          // Show notification and play sound for user messages
          if (newMessage.sender_type === 'user') {
            playNotificationSound();
            showNotification("Tin nhắn mới từ khách hàng", newMessage.message.substring(0, 100) + (newMessage.message.length > 100 ? "..." : ""));
            toast({
              title: "Tin nhắn mới từ khách hàng",
              description: newMessage.message.substring(0, 100) + (newMessage.message.length > 100 ? "..." : ""),
            });
          }
          
          // Refresh chat list to update unread counts
          loadChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [selectedChat, toast]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChats = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('support_chats')
        .select('*')
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get unread message counts for each chat
      const chatsWithUnread = await Promise.all(
        (data || []).map(async (chat) => {
          const { count } = await supabase
            .from('support_messages')
            .select('*', { count: 'exact', head: true })
            .eq('chat_id', chat.id)
            .eq('sender_type', 'user')
            .eq('is_read', false);

          return {
            ...chat,
            unread_count: count || 0
          };
        })
      );

      setChats(chatsWithUnread as SupportChat[]);
    } catch (error) {
      console.error('Error loading chats:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách chat",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data || []) as SupportMessage[]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markMessagesAsRead = async (chatId: string) => {
    try {
      await supabase
        .from('support_messages')
        .update({ is_read: true })
        .eq('chat_id', chatId)
        .eq('sender_type', 'user')
        .eq('is_read', false);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${selectedChat?.id}/${fileName}`;

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
    if ((!newMessage.trim() && !selectedFile) || !selectedChat) return;

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let fileUrl = null;
      let messageType = 'text';

      // Upload file if selected
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile);
        messageType = selectedFile.type.startsWith('image/') ? 'image' : 'file';
      }

      const messageData = {
        chat_id: selectedChat.id,
        sender_type: 'admin' as const,
        sender_id: user.id,
        message: newMessage.trim() || (selectedFile ? selectedFile.name : ''),
        message_type: messageType,
        image_url: fileUrl,
        file_name: selectedFile?.name || null,
        file_size: selectedFile?.size || null,
        file_type: selectedFile?.type || null
      };

      const { error } = await supabase
        .from('support_messages')
        .insert([messageData]);

      if (error) throw error;

      // Update chat's last message time
      await supabase
        .from('support_chats')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedChat.id);

      setNewMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi tin nhắn",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const updateChatStatus = async (chatId: string, status: 'open' | 'closed' | 'resolved') => {
    try {
      const { error } = await supabase
        .from('support_chats')
        .update({ status })
        .eq('id', chatId);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: `Đã cập nhật trạng thái chat thành ${status}`,
      });

      loadChats();
      if (selectedChat?.id === chatId) {
        setSelectedChat({ ...selectedChat, status });
      }
    } catch (error) {
      console.error('Error updating chat status:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive"
      });
    }
  };

  const editMessage = async (messageId: string, newText: string) => {
    try {
      const { error } = await supabase
        .from('support_messages')
        .update({ message: newText })
        .eq('id', messageId);

      if (error) throw error;

      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, message: newText } : msg
        )
      );

      setEditingMessageId(null);
      setEditingText("");

      toast({
        title: "Thành công",
        description: "Đã cập nhật tin nhắn",
      });
    } catch (error) {
      console.error('Error editing message:', error);
      toast({
        title: "Lỗi",
        description: "Không thể sửa tin nhắn",
        variant: "destructive"
      });
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      // Update local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));

      toast({
        title: "Thành công",
        description: "Đã xóa tin nhắn",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa tin nhắn",
        variant: "destructive"
      });
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    
    if (!confirm('Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Tất cả tin nhắn sẽ bị xóa vĩnh viễn.')) return;

    try {
      // First delete all messages in the chat
      const { error: messagesError } = await supabase
        .from('support_messages')
        .delete()
        .eq('chat_id', chatId);

      if (messagesError) throw messagesError;

      // Then delete the chat
      const { error: chatError } = await supabase
        .from('support_chats')
        .delete()
        .eq('id', chatId);

      if (chatError) throw chatError;

      // Update local state
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If this was the selected chat, clear selection
      if (selectedChat?.id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }

      toast({
        title: "Thành công",
        description: "Đã xóa cuộc trò chuyện",
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa cuộc trò chuyện",
        variant: "destructive"
      });
    }
  };

  const startEdit = (message: SupportMessage) => {
    setEditingMessageId(message.id);
    setEditingText(message.message);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="default">Đang mở</Badge>;
      case 'closed':
        return <Badge variant="secondary">Đã đóng</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-green-600">Đã giải quyết</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="h-full flex">
      {/* Chat List */}
      <div className="w-1/3 border-r bg-muted/30">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Tin nhắn hỗ trợ</h3>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="open">Đang mở</SelectItem>
                <SelectItem value="closed">Đã đóng</SelectItem>
                <SelectItem value="resolved">Đã giải quyết</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-2 space-y-2">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có cuộc trò chuyện nào</p>
              </div>
            ) : (
              chats.map((chat) => (
                <Card
                  key={chat.id}
                  className={`cursor-pointer transition-all hover:bg-muted/50 ${
                    selectedChat?.id === chat.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {chat.user_id ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <MessageCircle className="w-4 h-4" />
                        )}
                        <span className="font-medium text-sm">
                          {chat.title || `Chat #${chat.browser_id.slice(-6)}`}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {chat.unread_count && chat.unread_count > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {chat.unread_count}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => deleteChat(chat.id, e)}
                          className="h-6 w-6 p-0 opacity-70 hover:opacity-100 text-destructive"
                          title="Xóa cuộc trò chuyện"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(chat.status)}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {chat.last_message_at ? formatTime(chat.last_message_at) : formatTime(chat.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {selectedChat.title || `Chat #${selectedChat.browser_id.slice(-6)}`}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{selectedChat.user_id ? 'Người dùng đã đăng nhập' : 'Khách ẩn danh'}</span>
                    <span>•</span>
                    <span>ID: {selectedChat.browser_id.slice(-6)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(selectedChat.status)}
                  <Select
                    value={selectedChat.status}
                    onValueChange={(value: 'open' | 'closed' | 'resolved') => 
                      updateChatStatus(selectedChat.id, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Đang mở</SelectItem>
                      <SelectItem value="closed">Đã đóng</SelectItem>
                      <SelectItem value="resolved">Đã giải quyết</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 border-b">
              <ScrollArea className="h-full p-4 max-h-[60vh]">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${message.sender_type === 'admin' ? 'order-1' : 'order-2'}`}>
                        <Card className={`p-3 ${
                          message.sender_type === 'admin' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            {message.sender_type === 'admin' ? (
                              <User className="w-3 h-3" />
                            ) : (
                              <MessageCircle className="w-3 h-3" />
                            )}
                            <span className="text-xs opacity-70">
                              {message.sender_type === 'admin' ? 'Admin' : 'Khách hàng'}
                            </span>
                            <span className="text-xs opacity-70">
                              {formatTime(message.created_at)}
                            </span>
                            {message.sender_type === 'user' && message.is_read && (
                              <CheckCircle2 className="w-3 h-3 opacity-70" />
                            )}
                          </div>
                          
                          {/* Message content based on type */}
                          {message.message_type === 'image' && message.image_url ? (
                            <div className="space-y-2">
                              <img 
                                src={message.image_url} 
                                alt={message.file_name || "Uploaded image"} 
                                className="max-w-64 max-h-48 w-auto h-auto rounded-lg cursor-pointer hover:opacity-80 transition-opacity object-cover"
                                onClick={() => window.open(message.image_url, '_blank')}
                              />
                              {message.file_name && (
                                <p className="text-xs opacity-70">{message.file_name}</p>
                              )}
                              {editingMessageId === message.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        editMessage(message.id, editingText);
                                      }
                                      if (e.key === 'Escape') {
                                        cancelEdit();
                                      }
                                    }}
                                    placeholder="Chú thích cho hình ảnh..."
                                    className="text-sm"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      onClick={() => editMessage(message.id, editingText)}
                                      className="h-6 text-xs"
                                    >
                                      <Save className="w-3 h-3 mr-1" />
                                      Lưu
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={cancelEdit}
                                      className="h-6 text-xs"
                                    >
                                      <RotateCcw className="w-3 h-3 mr-1" />
                                      Hủy
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {message.message && (
                                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                  )}
                                  {/* Admin controls for image messages */}
                                  <div className="flex items-center space-x-1 pt-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => startEdit(message)}
                                      className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                                      title="Sửa chú thích"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteMessage(message.id)}
                                      className="h-5 w-5 p-0 opacity-70 hover:opacity-100 text-destructive"
                                      title="Xóa tin nhắn"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : message.message_type === 'file' && message.image_url ? (
                            <div className="space-y-2">
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
                              {editingMessageId === message.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        editMessage(message.id, editingText);
                                      }
                                      if (e.key === 'Escape') {
                                        cancelEdit();
                                      }
                                    }}
                                    placeholder="Chú thích cho file..."
                                    className="text-sm"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      onClick={() => editMessage(message.id, editingText)}
                                      className="h-6 text-xs"
                                    >
                                      <Save className="w-3 h-3 mr-1" />
                                      Lưu
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={cancelEdit}
                                      className="h-6 text-xs"
                                    >
                                      <RotateCcw className="w-3 h-3 mr-1" />
                                      Hủy
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {message.message && (
                                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                  )}
                                  {/* Admin controls for file messages */}
                                  <div className="flex items-center space-x-1 pt-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => startEdit(message)}
                                      className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                                      title="Sửa chú thích"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteMessage(message.id)}
                                      className="h-5 w-5 p-0 opacity-70 hover:opacity-100 text-destructive"
                                      title="Xóa tin nhắn"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div>
                              {editingMessageId === message.id ? (
                                <div className="space-y-2">
                                  <Input
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        editMessage(message.id, editingText);
                                      }
                                      if (e.key === 'Escape') {
                                        cancelEdit();
                                      }
                                    }}
                                    className="text-sm"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      onClick={() => editMessage(message.id, editingText)}
                                      className="h-6 text-xs"
                                    >
                                      <Save className="w-3 h-3 mr-1" />
                                      Lưu
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={cancelEdit}
                                      className="h-6 text-xs"
                                    >
                                      <RotateCcw className="w-3 h-3 mr-1" />
                                      Hủy
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                message.message && (
                                  <div className="space-y-2">
                                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                    {/* Admin controls for all messages */}
                                    <div className="flex items-center space-x-1 pt-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => startEdit(message)}
                                        className="h-5 w-5 p-0 opacity-70 hover:opacity-100"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteMessage(message.id)}
                                        className="h-5 w-5 p-0 opacity-70 hover:opacity-100 text-destructive"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </Card>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            {selectedChat.status === 'open' && (
              <div className="p-4 border-t bg-background">
                {selectedFile && (
                  <div className="mb-2 p-2 bg-muted rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {selectedFile.type.startsWith('image/') ? (
                        <ImageIcon className="w-4 h-4" />
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
                      id="admin-file-upload"
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
                      onClick={() => document.getElementById('admin-file-upload')?.click()}
                      className="h-9 w-9 p-0"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <input
                      type="file"
                      id="admin-image-upload"
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
                      onClick={() => document.getElementById('admin-image-upload')?.click()}
                      className="h-9 w-9 p-0"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn trả lời..."
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
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChatManagement;