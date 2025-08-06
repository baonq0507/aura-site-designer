import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const RutTien = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    realName: "",
    bankName: "",
    accountNumber: ""
  });

  const banks = [
    "Vietcombank", "BIDV", "VietinBank", "Agribank", "OCB", "Techcombank",
    "MBBank", "ACB", "VPBank", "SHB", "Eximbank", "Sacombank", "HDBank"
  ];

  const handleSubmit = () => {
    if (!formData.realName || !formData.bankName || !formData.accountNumber) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Thành công",
      description: "Đã gửi yêu cầu rút tiền"
    });
  };

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
      <div className="p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Thẻ ngân hàng của tôi</h2>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Real Name */}
              <div className="space-y-2">
                <Label htmlFor="realName" className="text-sm font-medium text-gray-600">
                  HỌ TÊN THẬT
                </Label>
                <Input
                  id="realName"
                  value={formData.realName}
                  onChange={(e) => setFormData(prev => ({ ...prev, realName: e.target.value }))}
                  placeholder="Họ tên thật"
                  className="h-12"
                />
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-sm font-medium text-gray-600">
                  TÊN NGÂN HÀNG
                </Label>
                <Select 
                  value={formData.bankName} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bankName: value }))}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="VUI LÒNG CHỌN THẺ NGÂN HÀNG" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-600">
                  SỐ TÀI KHOẢN NGÂN HÀNG
                </Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="Số Tài khoản ngân hàng"
                  className="h-12"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              className="w-full h-12 text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white"
            >
              GỬI ĐI
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RutTien;