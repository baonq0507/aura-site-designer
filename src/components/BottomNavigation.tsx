import { Home, Clock, Headphones, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import SupportChat from "./SupportChat";
import { useAuthContext } from "@/contexts/AuthContext";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuthContext();
  const [supportChatOpen, setSupportChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [browserId, setBrowserId] = useState("");

  // Generate or get browser ID for anonymous users
  useEffect(() => {
    let storedBrowserId = localStorage.getItem('support_browser_id');
    if (!storedBrowserId) {
      storedBrowserId = `browser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('support_browser_id', storedBrowserId);
    }
    setBrowserId(storedBrowserId);
  }, []);

  // Check for unread admin messages
  useEffect(() => {
    if (!browserId && !user) return;

    const checkUnreadMessages = async () => {
      try {
        // First get the user's chat
        let query = supabase
          .from('support_chats')
          .select('id')
          .eq('status', 'open')
          .limit(1);

        if (user) {
          query = query.eq('user_id', user.id);
        } else {
          query = query.eq('browser_id', browserId).is('user_id', null);
        }

        const { data: chats } = await query;
        
        if (!chats || chats.length === 0) {
          setUnreadCount(0);
          return;
        }

        // Count unread admin messages
        const { data: unreadMessages, error } = await supabase
          .from('support_messages')
          .select('id')
          .eq('chat_id', chats[0].id)
          .eq('sender_type', 'admin')
          .eq('is_read', false);

        if (!error) {
          setUnreadCount(unreadMessages?.length || 0);
        }
      } catch (error) {
        console.error('Error checking unread messages:', error);
      }
    };

    checkUnreadMessages();

    // Set up real-time subscription for new admin messages
    const channel = supabase
      .channel('unread_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages'
        },
        () => {
          checkUnreadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, browserId]);

  // Reset unread count when support chat opens
  useEffect(() => {
    if (supportChatOpen) {
      setUnreadCount(0);
    }
  }, [supportChatOpen]);

  // Use useMemo to ensure navItems updates when language changes
  const navItems = useMemo(() => [
    { icon: Home, label: t('nav.first.page'), path: "/" },
    { icon: Clock, label: t('nav.history'), path: "/history" },
    { type: "logo", label: "SOUTH COAST PLAZA", path: "/task-center" },
    { icon: Headphones, label: t('nav.support'), path: "/support" },
    { icon: User, label: t('nav.my.page'), path: "/profile" },
  ], [t, currentLanguage]); // Re-create when language changes

  return (
    <>
      <SupportChat open={supportChatOpen} onOpenChange={setSupportChatOpen} />
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-luxury backdrop-blur-sm">
      <div className="grid grid-cols-5 max-w-lg mx-auto px-2">
        {navItems.map((item, index) => {
          // Handle logo differently
          if (item.type === "logo") {
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center py-2 px-2 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mb-1 relative hover:scale-110 transition-all duration-300 shadow-glow hover:shadow-luxury group border-2 border-gray-600">
                  {/* Central Farfetch logo */}
                  <img 
                    src="/lovable-uploads/f354ad2c-8556-4a92-ac3f-90aa333327a6.png" 
                    alt="Farfetch logo"
                    className="w-8 h-8 object-contain transition-all duration-300 brightness-0 invert"
                  />
                  
                  {/* Curved text around the circle with rotation animation */}
                  <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] group-hover:animate-[spin_2s_linear_infinite]" viewBox="0 0 56 56">
                    <defs>
                      <path id="circle-path" d="M 28,28 m -22,0 a 22,22 0 1,1 44,0 a 22,22 0 1,1 -44,0" />
                    </defs>
                    <text className="fill-white text-[12px] font-bold transition-colors duration-300">
                      <textPath href="#circle-path" startOffset="0%">
                        FARFETCH • FARFETCH • 
                      </textPath>
                    </text>
                  </svg>
                  
                  {/* Glow ring effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              </button>
            );
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isSupport = item.label === t('nav.support');
          
          return (
            <button
              key={index}
              onClick={() => {
                if (isSupport) {
                  setSupportChatOpen(true);
                } else {
                  navigate(item.path);
                }
              }}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 ${
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-300 relative ${
                isActive ? "bg-gradient-primary shadow-glow" : ""
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : ""}`} />
                {isSupport && unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </div>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default BottomNavigation;