import { User } from "@supabase/supabase-js";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

interface AdminHeaderProps {
  user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const { currentLanguage, setLanguage, t } = useLanguage();

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-2">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold">{t('admin.dashboard.title')}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Select value={currentLanguage.code} onValueChange={setLanguage}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue>
                <div className="flex items-center space-x-2">
                  <span>{currentLanguage.flag}</span>
                  <span className="text-sm">{currentLanguage.nativeName}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => (
                <SelectItem key={language.code} value={language.code}>
                  <div className="flex items-center space-x-2">
                    <span>{language.flag}</span>
                    <span>{language.nativeName}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">{t('admin.welcome.back')}</span>
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{user.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}