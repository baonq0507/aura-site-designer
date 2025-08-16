import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLocked: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isLocked: false
  });
  
  const isCheckingLock = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isInitialized = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (isInitialized.current) return;
      
      try {
        // Check existing session first
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (isMounted && !isInitialized.current) {
          setAuthState(prev => ({
            ...prev,
            session: existingSession,
            user: existingSession?.user ?? null,
            loading: false
          }));
          
          if (existingSession?.user) {
            await checkUserLockStatus(existingSession.user.id);
          }
          
          isInitialized.current = true;
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (isMounted && !isInitialized.current) {
          setAuthState(prev => ({ ...prev, loading: false }));
          isInitialized.current = true;
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        setAuthState(prev => ({
          ...prev,
          session: newSession,
          user: newSession?.user ?? null,
          loading: false
        }));
        
        if (newSession?.user) {
          await checkUserLockStatus(newSession.user.id);
        } else {
          setAuthState(prev => ({ ...prev, isLocked: false }));
        }
      }
    );

    // Initialize auth
    initializeAuth();

    // Add timeout to prevent infinite loading - tăng từ 8s lên 15s
    timeoutRef.current = setTimeout(() => {
      if (isMounted && !isInitialized.current) {
        console.warn('Auth initialization timeout - forcing completion');
        setAuthState(prev => ({ ...prev, loading: false }));
        isInitialized.current = true;
      }
    }, 15000); // 15 second timeout

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const checkUserLockStatus = async (userId: string) => {
    if (isCheckingLock.current) return;
    
    isCheckingLock.current = true;
    
    try {
      // Add timeout to prevent hanging - tăng từ 3s lên 8s
      const lockCheckPromise = supabase
        .from('profiles')
        .select('is_locked')
        .eq('user_id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Lock check timeout')), 8000); // 8 second timeout
      });

      const { data: profile, error } = await Promise.race([
        lockCheckPromise,
        timeoutPromise
      ]) as any;

      if (error) {
        console.error('Error checking user lock status:', error);
        // Không return để tiếp tục xử lý
        setAuthState(prev => ({ ...prev, isLocked: false }));
        return;
      }

      if (profile?.is_locked) {
        setAuthState(prev => ({ ...prev, isLocked: true }));
        // Sign out the locked user
        await supabase.auth.signOut();
      } else {
        setAuthState(prev => ({ ...prev, isLocked: false }));
      }
    } catch (error: any) {
      console.error('Error in checkUserLockStatus:', error);
      if (error.message === 'Lock check timeout') {
        console.warn('Lock check timed out, continuing without lock status');
        // Đặt isLocked = false khi timeout để tránh blocking
        setAuthState(prev => ({ ...prev, isLocked: false }));
      }
    } finally {
      isCheckingLock.current = false;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    ...authState,
    signOut,
    isAuthenticated: !!authState.user && !!authState.session && !authState.isLocked
  };
};
