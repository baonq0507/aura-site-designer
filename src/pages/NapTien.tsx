import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NapTien = () => {
  const navigate = useNavigate();

  const paymentMethods = [
    { id: "card", name: "Thẻ tín dụng/Ghi nợ", icon: CreditCard },
    { id: "wallet", name: "Ví điện tử", icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-background font-crimson">
      {/* Header */}
      <div className="bg-secondary/30 p-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="font-playfair"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            QUAY LẠI
          </Button>
          <h1 className="text-2xl font-playfair font-bold text-foreground tracking-wide">
            NẠP TIỀN VÀO TÀI KHOẢN
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <Card className="shadow-classic border border-border/30">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-playfair tracking-wide">CHỌN PHƯƠNG THỨC THANH TOÁN</CardTitle>
            <CardDescription className="font-crimson italic">
              Chọn phương thức phù hợp để nạp tiền vào tài khoản của bạn
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-4">
              <Label htmlFor="amount" className="font-playfair font-semibold tracking-wide">
                SỐ TIỀN NẠP
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="Nhập số tiền (VNĐ)"
                className="text-center font-crimson text-lg"
              />
              
              <div className="grid grid-cols-3 gap-3">
                {[100000, 500000, 1000000].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="font-playfair tracking-wide"
                  >
                    {amount.toLocaleString()} VNĐ
                  </Button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <Label className="font-playfair font-semibold tracking-wide">
                PHƯƠNG THỨC THANH TOÁN
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      className="p-4 border border-border/30 rounded-none hover:border-primary/30 cursor-pointer transition-all duration-300 hover:shadow-classic"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6 text-primary" />
                        <span className="font-playfair font-medium">{method.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              variant="copper" 
              size="lg" 
              className="w-full font-playfair font-semibold tracking-wide shadow-classic-hover"
            >
              TIẾN HÀNH NẠP TIỀN
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NapTien;