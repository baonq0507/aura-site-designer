import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from './AuthContext';

interface SystemStatus {
  is_enabled: boolean;
  maintenance_message: string;
}

interface SystemContextType {
  systemStatus: SystemStatus | null;
  isLoading: boolean;
  error: string | null;
  updateSystemStatus: (status: Partial<SystemStatus>) => Promise<void>;
  refreshSystemStatus: () => Promise<void>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystemContext = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystemContext must be used within a SystemProvider');
  }
  return context;
};

interface SystemProviderProps {
  children: ReactNode;
}

export const SystemProvider: React.FC<SystemProviderProps> = ({ children }) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  const fetchSystemStatus = useCallback(async () => {
    try {
      console.log('🔍 Fetching system status...');
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'system_status')
        .single();

      console.log('📊 Database response:', { data, error: fetchError });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.value) {
        console.log('System status from database:', data.value);
        setSystemStatus(data.value as SystemStatus);
      } else {
        // Fallback nếu không có dữ liệu
        setSystemStatus({
          is_enabled: true,
          maintenance_message: 'Hệ thống đang hoạt động bình thường'
        });
      }
    } catch (err) {
      console.error('Error fetching system status:', err);
      setError(err instanceof Error ? err.message : 'Lỗi khi tải trạng thái hệ thống');
      // Fallback
      setSystemStatus({
        is_enabled: true,
        maintenance_message: 'Hệ thống đang hoạt động bình thường'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSystemStatus = useCallback(async (status: Partial<SystemStatus>) => {
    try {
      console.log('🔄 Updating system status:', status);
      if (!user) {
        throw new Error('Không có quyền cập nhật trạng thái hệ thống');
      }

      const newStatus = { ...systemStatus, ...status };
      console.log('📝 New status to save:', newStatus);
      
      const { error: updateError } = await supabase
        .from('system_settings')
        .update({ 
          value: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'system_status');

      console.log('💾 Update result:', { error: updateError });

      if (updateError) {
        throw updateError;
      }

      console.log('✅ Status updated successfully');
      setSystemStatus(newStatus);
    } catch (err) {
      console.error('❌ Error updating system status:', err);
      throw err;
    }
  }, [systemStatus, user]);

  const refreshSystemStatus = useCallback(async () => {
    await fetchSystemStatus();
  }, [fetchSystemStatus]);

  useEffect(() => {
    fetchSystemStatus();
  }, [fetchSystemStatus]);

  // Sử dụng Supabase Realtime để lắng nghe thay đổi
  useEffect(() => {
    const channel = supabase
      .channel('system_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'system_settings',
          filter: 'key=eq.system_status'
        },
        (payload) => {
          console.log('System settings changed:', payload);
          if (payload.eventType === 'UPDATE' && payload.new) {
            setSystemStatus(payload.new.value as SystemStatus);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const value: SystemContextType = {
    systemStatus,
    isLoading,
    error,
    updateSystemStatus,
    refreshSystemStatus,
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};
