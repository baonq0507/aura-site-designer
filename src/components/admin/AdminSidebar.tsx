import { Users, Crown, Package, BarChart3, LogOut, History, CreditCard, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const getMenuItems = (t: (key: string) => string) => [
  { id: "dashboard", title: t('admin.dashboard.overview'), icon: BarChart3 },
  { id: "users", title: t('admin.user.management'), icon: Users },
  { id: "vip", title: t('admin.vip.management'), icon: Crown },
  { id: "products", title: t('admin.product.management'), icon: Package },
  { id: "deposits", title: t('admin.deposit.history'), icon: History },
  { id: "withdrawals", title: t('admin.withdrawal.management'), icon: CreditCard },
  { id: "support", title: "Quản lý tin nhắn", icon: MessageCircle },
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { t } = useLanguage();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const menuItems = getMenuItems(t);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data, error } = await supabase
          .from('support_messages')
          .select('id')
          .eq('sender_type', 'user')
          .eq('is_read', false);

        if (error) throw error;
        setUnreadCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadCount();

    // Real-time subscription for new messages
    const channel = supabase
      .channel('admin_unread_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages',
          filter: 'sender_type=eq.user'
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('admin.dashboard.title')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.id)}
                    className={activeSection === item.id ? "bg-primary text-primary-foreground" : ""}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                    {item.id === "support" && unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto text-xs h-5 w-5 flex items-center justify-center p-0 min-w-[20px]"
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{t('common.logout')}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}