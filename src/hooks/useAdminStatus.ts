import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

interface AdminStatus {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  lastChecked: number | null;
}

const ADMIN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const adminStatusCache = new Map<string, { status: boolean; timestamp: number }>();

export const useAdminStatus = () => {
  const { user } = useAuthContext();
  const [adminStatus, setAdminStatus] = useState<AdminStatus>({
    isAdmin: false,
    loading: false,
    error: null,
    lastChecked: null
  });
  
  const isChecking = useRef(false);

  const checkAdminStatus = async (forceCheck = false) => {
    if (!user) {
      setAdminStatus(prev => ({ ...prev, isAdmin: false, loading: false }));
      return;
    }

    // Check cache first
    const cached = adminStatusCache.get(user.id);
    const now = Date.now();
    
    if (!forceCheck && cached && (now - cached.timestamp) < ADMIN_CACHE_DURATION) {
      setAdminStatus({
        isAdmin: cached.status,
        loading: false,
        error: null,
        lastChecked: cached.timestamp
      });
      return;
    }

    if (isChecking.current) return;
    
    isChecking.current = true;
    setAdminStatus(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Create a promise with timeout
      const adminCheckPromise = supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Admin check timeout')), 5000);
      });

      // Race between admin check and timeout
      const { data: userRoles, error: dbError } = await Promise.race([
        adminCheckPromise,
        timeoutPromise
      ]) as any;

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      const isAdmin = !!userRoles;
      
      // Update cache
      adminStatusCache.set(user.id, { status: isAdmin, timestamp: now });
      
      setAdminStatus({
        isAdmin,
        loading: false,
        error: null,
        lastChecked: now
      });

    } catch (error: any) {
      console.error('Error checking admin status:', error);
      
      let errorMessage = 'Có lỗi xảy ra khi kiểm tra quyền admin.';
      
      if (error.message === 'Admin check timeout') {
        errorMessage = 'Kiểm tra quyền admin bị timeout. Vui lòng thử lại.';
      } else if (error.message?.includes('Database error')) {
        errorMessage = 'Lỗi kết nối database. Vui lòng kiểm tra kết nối mạng.';
      }

      setAdminStatus(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    } finally {
      isChecking.current = false;
    }
  };

  const refreshAdminStatus = () => {
    checkAdminStatus(true);
  };

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setAdminStatus({
        isAdmin: false,
        loading: false,
        error: null,
        lastChecked: null
      });
    }
  }, [user]);

  return {
    ...adminStatus,
    refreshAdminStatus
  };
};
