import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const RutTien = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    amount: "",
    password: ""
  });
  const [balance] = useState("0.00");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawAll = () => {
    setFormData(prev => ({ ...prev, amount: balance }));
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast({
        title: "Lỗi",
        description: "Số tiền rút phải lớn hơn 0",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(formData.amount) > parseFloat(balance)) {
      toast({
        title: "Lỗi",
        description: "Số dư không đủ",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Thành công",
      description: `Đã gửi yêu cầu rút tiền ${formData.amount} USD`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Rút tiền</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Balance Section */}
        <Card className="max-w-md mx-auto bg-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">USD {balance}</div>
              <div className="text-sm text-gray-600 mt-1">Số dư tài khoản</div>
            </div>
          </CardContent>
        </Card>

        {/* Available Balance */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-600 font-medium">Số dư khả dụng</span>
              <span className="text-sm font-semibold">{balance} USD</span>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 space-y-4">
            {/* Withdrawal Amount Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Số tiền rút ra</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWithdrawAll}
                  className="text-xs px-3 py-1 h-auto"
                >
                  Rút toàn bộ số tiền
                </Button>
              </div>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Nhập số tiền cần rút"
                className="h-12"
              />
            </div>

            {/* Withdrawal Password */}
            <div className="space-y-2">
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Nhập mật khẩu rút tiền"
                className="h-12"
              />
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              className="w-full h-12 text-base font-semibold bg-blue hover:bg-blue/90 text-blue-foreground"
            >
              RÚT TIỀN NGAY
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RutTien;