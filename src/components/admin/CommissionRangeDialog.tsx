import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Settings, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CommissionRangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  username: string | null;
  currentSettings: {
    use_custom_commission: boolean;
    custom_commission_min: number | null;
    custom_commission_max: number | null;
  };
  onSuccess: () => void;
}

export function CommissionRangeDialog({
  open,
  onOpenChange,
  userId,
  username,
  currentSettings,
  onSuccess
}: CommissionRangeDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    use_custom_commission: false,
    custom_commission_min: null as number | null,
    custom_commission_max: null as number | null,
  });

  useEffect(() => {
    if (open && currentSettings) {
      setSettings({
        use_custom_commission: currentSettings.use_custom_commission || false,
        custom_commission_min: currentSettings.custom_commission_min,
        custom_commission_max: currentSettings.custom_commission_max,
      });
    }
  }, [open, currentSettings]);

  const handleSave = async () => {
    if (!settings.use_custom_commission) {
      // Nếu tắt custom commission, reset về null
      setSettings(prev => ({
        ...prev,
        custom_commission_min: null,
        custom_commission_max: null,
      }));
    }

    if (settings.use_custom_commission) {
      if (!settings.custom_commission_min || !settings.custom_commission_max) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng nhập cả giá trị min và max khi bật hoa hồng tùy chỉnh',
          variant: 'destructive',
        });
        return;
      }

      if (settings.custom_commission_max <= settings.custom_commission_min) {
        toast({
          title: 'Lỗi',
          description: 'Giá trị max phải lớn hơn giá trị min',
          variant: 'destructive',
        });
        return;
      }

      if (settings.custom_commission_min < 0 || settings.custom_commission_max < 0) {
        toast({
          title: 'Lỗi',
          description: 'Giá trị hoa hồng không được âm',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          use_custom_commission: settings.use_custom_commission,
          custom_commission_min: settings.custom_commission_min,
          custom_commission_max: settings.custom_commission_max,
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Cài đặt hoa hồng đã được cập nhật',
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating commission settings:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật cài đặt hoa hồng',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      use_custom_commission: false,
      custom_commission_min: null,
      custom_commission_max: null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Cài đặt hoa hồng tùy chỉnh
          </DialogTitle>
          <DialogDescription>
            Thiết lập khoảng hoa hồng tùy chỉnh cho người dùng {username || userId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin hiện tại */}
          <div className="p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Thông tin hiện tại
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Trạng thái:</span>
                <Badge variant={currentSettings.use_custom_commission ? 'default' : 'outline'}>
                  {currentSettings.use_custom_commission ? 'Bật' : 'Tắt'}
                </Badge>
              </div>
              {currentSettings.use_custom_commission && (
                <div className="flex items-center justify-between">
                  <span>Khoảng hoa hồng:</span>
                  <Badge variant="outline">
                    ${currentSettings.custom_commission_min || 0} - ${currentSettings.custom_commission_max || 0}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Cài đặt mới */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="custom-commission" className="text-base font-medium">
                Bật hoa hồng tùy chỉnh
              </Label>
              <Switch
                id="custom-commission"
                checked={settings.use_custom_commission}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, use_custom_commission: checked }))}
              />
            </div>

            {settings.use_custom_commission && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                                 <div className="text-sm text-muted-foreground">
                   Khi bật, hệ thống sẽ tìm đơn hàng theo VIP level và tính hoa hồng trung bình trong khoảng này
                 </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-commission">Giá trị tối thiểu ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="min-commission"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="300"
                        value={settings.custom_commission_min || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          custom_commission_min: parseFloat(e.target.value) || null
                        }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max-commission">Giá trị tối đa ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="max-commission"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="1000"
                        value={settings.custom_commission_max || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          custom_commission_max: parseFloat(e.target.value) || null
                        }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {settings.custom_commission_min && settings.custom_commission_max && 
                 settings.custom_commission_max > settings.custom_commission_min && (
                                     <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                     <div className="text-sm text-green-800">
                       <strong>Xem trước:</strong> Hoa hồng trung bình sẽ từ ${settings.custom_commission_min} đến ${settings.custom_commission_max}. 
                       Hệ thống sẽ tìm đơn hàng phù hợp để đạt được hoa hồng trong khoảng này.
                     </div>
                   </div>
                )}
              </div>
            )}
          </div>

                     {/* Cảnh báo */}
           <Alert>
             <Info className="h-4 w-4" />
             <AlertDescription>
               <strong>Lưu ý:</strong> Khi bật hoa hồng tùy chỉnh, hệ thống sẽ:
               <br />• Vẫn tìm kiếm đơn hàng theo VIP level của người dùng
               <br />• Tính hoa hồng trung bình trong khoảng min-max đã thiết lập
               <br />• Tìm các đơn hàng có giá trị phù hợp để đạt được hoa hồng trung bình đó
             </AlertDescription>
           </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset} disabled={isLoading}>
            Đặt lại
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
