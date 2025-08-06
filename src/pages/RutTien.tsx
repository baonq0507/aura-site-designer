import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Banknote, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RutTien = () => {
  const navigate = useNavigate();

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
            RÚT TIỀN KHỎI TÀI KHOẢN
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Balance Display */}
        <Card className="shadow-classic border border-border/30 bg-gradient-elegant">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <Banknote className="w-8 h-8 text-primary" />
              <span className="text-2xl font-playfair font-bold text-foreground">SỐ DƯ KHỊA DỤNG</span>
            </div>
            <div className="text-4xl font-playfair font-bold text-primary">
              2,500,000 VNĐ
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-classic border border-border/30">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-playfair tracking-wide">THÔNG TIN RÚT TIỀN</CardTitle>
            <CardDescription className="font-crimson italic">
              Vui lòng điền đầy đủ thông tin để thực hiện giao dịch rút tiền
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Withdrawal Amount */}
            <div className="space-y-4">
              <Label htmlFor="withdraw-amount" className="font-playfair font-semibold tracking-wide">
                SỐ TIỀN RÚT
              </Label>
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="Nhập số tiền muốn rút (VNĐ)"
                className="text-center font-crimson text-lg"
              />
              
              <div className="grid grid-cols-3 gap-3">
                {[500000, 1000000, 2000000].map((amount) => (
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

            {/* Bank Information */}
            <div className="space-y-4">
              <Label className="font-playfair font-semibold tracking-wide">
                THÔNG TIN NGÂN HÀNG
              </Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank" className="font-playfair">Ngân hàng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngân hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vietcombank">Vietcombank</SelectItem>
                      <SelectItem value="techcombank">Techcombank</SelectItem>
                      <SelectItem value="bidv">BIDV</SelectItem>
                      <SelectItem value="vcb">VCB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="account-number" className="font-playfair">Số tài khoản</Label>
                  <Input
                    id="account-number"
                    placeholder="Nhập số tài khoản"
                    className="font-crimson"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-name" className="font-playfair">Tên chủ tài khoản</Label>
                <Input
                  id="account-name"
                  placeholder="Nhập tên chủ tài khoản"
                  className="font-crimson"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              variant="copper" 
              size="lg" 
              className="w-full font-playfair font-semibold tracking-wide shadow-classic-hover"
            >
              YÊU CẦU RÚT TIỀN
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RutTien;