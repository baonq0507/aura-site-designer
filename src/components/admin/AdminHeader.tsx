import { User } from "@supabase/supabase-js";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminHeaderProps {
  user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className="text-sm text-muted-foreground">Welcome back,</span>
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{user.email}</span>
        </div>
      </div>
    </header>
  );
}