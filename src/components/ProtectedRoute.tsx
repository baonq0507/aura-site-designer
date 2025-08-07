import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if user is locked when session changes
        if (session?.user) {
          setTimeout(() => {
            checkUserLockStatus(session.user.id);
          }, 0);
        } else {
          setIsLocked(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserLockStatus(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserLockStatus = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_locked')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error checking user lock status:', error);
        return;
      }

      if (profile?.is_locked) {
        setIsLocked(true);
        toast({
          variant: "destructive",
          title: t('auth.signin.failed'),
          description: t('auth.account.locked'),
        });
        // Sign out the locked user
        await supabase.auth.signOut();
      } else {
        setIsLocked(false);
      }
    } catch (error) {
      console.error('Error in checkUserLockStatus:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Đang kiểm tra đăng nhập...</div>
        </div>
      </div>
    );
  }

  if (!user || !session || isLocked) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;