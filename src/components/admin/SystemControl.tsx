import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSystemContext } from '@/contexts/SystemContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, Power, Settings, Save, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SystemControl = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { systemStatus, isLoading, error, updateSystemStatus } = useSystemContext();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localStatus, setLocalStatus] = useState({
    is_enabled: systemStatus?.is_enabled ?? true,
    maintenance_message: systemStatus?.maintenance_message ?? 'Hệ thống đã ngừng hoạt động, vui lòng quay lại vào ngày hôm sau'
  });

  const handleToggleSystem = async () => {
    try {
      setIsUpdating(true);
      const newStatus = !localStatus.is_enabled;
      
      await updateSystemStatus({
        is_enabled: newStatus,
        maintenance_message: localStatus.maintenance_message
      });

      setLocalStatus(prev => ({ ...prev, is_enabled: newStatus }));

      toast({
        title: newStatus ? 'Hệ thống đã được bật' : 'Hệ thống đã được tắt',
        description: newStatus 
          ? 'Người dùng có thể sử dụng chức năng tìm kiếm đơn hàng (Real-time)' 
          : 'Người dùng không thể sử dụng chức năng tìm kiếm đơn hàng (Real-time)',
        variant: newStatus ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Error updating system status:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật trạng thái hệ thống',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveMessage = async () => {
    try {
      setIsUpdating(true);
      
      await updateSystemStatus({
        is_enabled: localStatus.is_enabled,
        maintenance_message: localStatus.maintenance_message
      });

              toast({
          title: 'Thành công',
          description: 'Tin nhắn thông báo đã được cập nhật',
        });
    } catch (error) {
      console.error('Error updating maintenance message:', error);
              toast({
          title: 'Lỗi',
          description: 'Không thể cập nhật tin nhắn thông báo',
          variant: 'destructive',
        });
    } finally {
      setIsUpdating(false);
    }
  };

  // Cập nhật local state khi systemStatus thay đổi
  React.useEffect(() => {
    if (systemStatus) {
      setLocalStatus({
        is_enabled: systemStatus.is_enabled,
        maintenance_message: systemStatus.maintenance_message
      });
    }
  }, [systemStatus]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quản lý hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Lỗi khi tải thông tin hệ thống: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Quản lý hệ thống
          <div className="flex items-center gap-1 ml-2">
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-600 font-normal">Real-time</span>
          </div>
        </CardTitle>
        <CardDescription>
          Bật/tắt hệ thống và cập nhật tin nhắn thông báo. Thay đổi sẽ được áp dụng real-time cho tất cả người dùng.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* System Status Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">Trạng thái hệ thống</Label>
            <p className="text-sm text-muted-foreground">
              {localStatus.is_enabled 
                ? 'Hệ thống đang hoạt động bình thường' 
                : 'Hệ thống đang bảo trì'
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="system-status"
              checked={localStatus.is_enabled}
              onCheckedChange={(checked) => 
                setLocalStatus(prev => ({ ...prev, is_enabled: checked }))
              }
              disabled={isUpdating}
            />
            <Button
              onClick={handleToggleSystem}
              disabled={isUpdating}
              variant={localStatus.is_enabled ? "destructive" : "default"}
              size="sm"
              className="flex items-center gap-2"
            >
              <Power className="w-4 h-4" />
              {localStatus.is_enabled ? 'Tắt hệ thống' : 'Bật hệ thống'}
            </Button>
          </div>
        </div>

        {/* Maintenance Message */}
        <div className="space-y-3">
          <Label htmlFor="maintenance-message">Tin nhắn thông báo</Label>
          <Textarea
            id="maintenance-message"
            placeholder="Nhập tin nhắn thông báo hiển thị cho người dùng khi hệ thống bị tắt..."
            value={localStatus.maintenance_message}
            onChange={(e) => 
              setLocalStatus(prev => ({ ...prev, maintenance_message: e.target.value }))
            }
            disabled={isUpdating}
            rows={3}
          />
                  <Button
          onClick={handleSaveMessage}
          disabled={isUpdating}
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Lưu tin nhắn thông báo
        </Button>
        </div>

                 {/* Current Status Display */}
         {/* <div className="pt-4 border-t">
           <div className="flex items-center gap-2 mb-2">
             <div className={`w-3 h-3 rounded-full ${
               localStatus.is_enabled ? 'bg-green-500' : 'bg-red-500'
             }`} />
             <span className="font-medium">
               Trạng thái hiện tại: {localStatus.is_enabled ? 'Đang hoạt động' : 'Đang bảo trì'}
             </span>
             <div className="flex items-center gap-1 ml-2">
               <Wifi className="w-4 h-4 text-green-500" />
               <span className="text-xs text-green-600">Real-time</span>
             </div>
           </div>
           {!localStatus.is_enabled && (
             <p className="text-sm text-muted-foreground">
               Tin nhắn thông báo: {localStatus.maintenance_message}
             </p>
           )}
         </div> */}

                 {/* Warning */}
         {!localStatus.is_enabled && (
           <Alert>
             <AlertCircle className="h-4 w-4" />
             <AlertDescription>
               <strong>Chú ý:</strong> Khi hệ thống bị tắt, người dùng sẽ không thể sử dụng chức năng tìm kiếm đơn hàng trong TaskCenter. Thay đổi này sẽ được áp dụng ngay lập tức cho tất cả người dùng.
             </AlertDescription>
           </Alert>
         )}

         {/* Real-time Status Info */}
         <Alert>
           <Wifi className="h-4 w-4 text-green-500" />
           <AlertDescription>
             <strong>Real-time:</strong> Tất cả thay đổi trạng thái hệ thống sẽ được cập nhật ngay lập tức cho tất cả người dùng thông qua Supabase Realtime. Không cần refresh trang.
           </AlertDescription>
         </Alert>
      </CardContent>
    </Card>
  );
};

export default SystemControl;
