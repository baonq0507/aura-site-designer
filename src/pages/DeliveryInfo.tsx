import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Phone, User } from "lucide-react";

const DeliveryInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    district: "",
    ward: ""
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/auth");
      return;
    }
    loadDeliveryInfo(session.user.id);
  };

  const loadDeliveryInfo = async (userId: string) => {
    try {
      // Load from localStorage for now
      const savedData = localStorage.getItem(`delivery-info-${userId}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        setFormData({
          fullName: data.fullName || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          city: data.city || "",
          district: data.district || "",
          ward: data.ward || ""
        });
      }
    } catch (error) {
      console.error('Error loading delivery info:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save to localStorage for now
      localStorage.setItem(`delivery-info-${user.id}`, JSON.stringify(formData));

      toast({
        title: "Thành công",
        description: "Đã lưu thông tin nhận hàng"
      });
    } catch (error) {
      console.error('Error saving delivery info:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin nhận hàng",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Thông tin nhận hàng</h1>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Địa chỉ giao hàng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Tỉnh/Thành phố</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Tỉnh/Thành phố"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  placeholder="Quận/Huyện"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ward">Phường/Xã</Label>
              <Input
                id="ward"
                value={formData.ward}
                onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                placeholder="Phường/Xã"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ cụ thể</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Số nhà, tên đường..."
              />
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryInfo;