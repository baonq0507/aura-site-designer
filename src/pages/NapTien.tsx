import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NapTien = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const quickAmounts = [200, 500, 1000, 3000, 5000, 10000, 30000, 50000];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseInt(value);
    if (quickAmounts.includes(numValue)) {
      setSelectedAmount(numValue);
    } else {
      setSelectedAmount(null);
    }
  };

  const handleDeposit = () => {
    const amount = parseInt(customAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tiền hợp lệ",
        variant: "destructive"
      });
      return;
    }

    // Redirect to customer service - replace with actual customer service link
    toast({
      title: "Chuyển hướng",
      description: "Đang chuyển đến bộ phận chăm sóc khách hàng..."
    });
    
    // Simulate redirect to customer service
    setTimeout(() => {
      window.open("https://zalo.me/your-cs-number", "_blank");
    }, 1000);
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
          <h1 className="text-lg font-semibold">Nạp tiền</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Số tiền nạp</h2>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="Vui lòng nhập số tiền cần nạp"
                className="text-center text-lg h-12"
              />

              {/* Quick Amount Selection */}
              <div className="grid grid-cols-2 gap-3">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    onClick={() => handleAmountSelect(amount)}
                    className="h-12 text-base"
                  >
                    {amount.toLocaleString()}
                  </Button>
                ))}
              </div>
            </div>

            {/* Deposit Button */}
            <Button 
              onClick={handleDeposit}
              className="w-full h-12 text-base font-semibold bg-blue-500 hover:bg-blue-600 text-white"
            >
              NAP TIỀN NGAY BÂY GIỜ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NapTien;