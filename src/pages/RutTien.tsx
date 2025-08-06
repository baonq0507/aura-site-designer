import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  branch?: string;
}

const RutTien = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    realName: "",
    selectedBankId: ""
  });
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadBanks();
  }, []);

  const checkAuthAndLoadBanks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      await loadBankAccounts(session.user.id);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBankAccounts = async (userId: string) => {
    try {
      // Load from localStorage
      const savedData = localStorage.getItem(`bank-accounts-${userId}`);
      if (savedData) {
        setBankAccounts(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    }
  };

  const handleSubmit = () => {
    if (!formData.realName || !formData.selectedBankId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive"
      });
      return;
    }

    const selectedBank = bankAccounts.find(bank => bank.id === formData.selectedBankId);
    
    toast({
      title: "Thành công",
      description: `Đã gửi yêu cầu rút tiền về ${selectedBank?.bank_name} - ${selectedBank?.account_number}`
    });
  };

  const getSelectedBankDisplay = () => {
    const selectedBank = bankAccounts.find(bank => bank.id === formData.selectedBankId);
    if (!selectedBank) return "VUI LÒNG CHỌN TÀI KHOẢN NGÂN HÀNG";
    
    return `${selectedBank.bank_name} - ${selectedBank.account_number} - ${selectedBank.account_holder}`;
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
      <div className="p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Thẻ ngân hàng của tôi</h2>
            </div>

            {bankAccounts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Bạn chưa liên kết tài khoản ngân hàng nào
                </p>
                <Button 
                  onClick={() => navigate("/bank-linking")}
                  variant="outline"
                >
                  Liên kết ngân hàng
                </Button>
              </div>
            ) : (
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

                {/* Bank Selection */}
                <div className="space-y-2">
                  <Label htmlFor="bankSelect" className="text-sm font-medium text-gray-600">
                    CHỌN TÀI KHOẢN NGÂN HÀNG
                  </Label>
                  <Select 
                    value={formData.selectedBankId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, selectedBankId: value }))}
                  >
                    <SelectTrigger className="h-12 bg-white border border-input">
                      <SelectValue placeholder="VUI LÒNG CHỌN TÀI KHOẢN NGÂN HÀNG" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-input z-50">
                      {bankAccounts.map((bank) => (
                        <SelectItem key={bank.id} value={bank.id} className="hover:bg-gray-100">
                          <div className="flex flex-col">
                            <span className="font-medium">{bank.bank_name}</span>
                            <span className="text-sm text-gray-600">
                              {bank.account_number} - {bank.account_holder}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit}
                  className="w-full h-12 text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white"
                >
                  GỬI ĐI
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RutTien;