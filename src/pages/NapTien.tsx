import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import TranslatedRoute from "@/components/TranslatedRoute";

const NapTien = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
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
        title: t("error"),
        description: t("pleaseEnterValidAmount"),
        variant: "destructive"
      });
      return;
    }

    // Redirect to customer service - replace with actual customer service link
    toast({
      title: t("redirect"),
      description: t("redirectingToCustomerService")
    });
    
    // Simulate redirect to customer service
    setTimeout(() => {
      window.open("https://zalo.me/your-cs-number", "_blank");
    }, 1000);
  };

  return (
    <TranslatedRoute titleKey="deposit" showBackButton={false}>
      <div className="p-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{t("depositAmount")}</h2>
            </div>

            {/* Amount Input */}
            <div className="space-y-4">
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder={t("enterAmountPlaceholder")}
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
              className="w-full h-12 text-base font-semibold bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              {t("depositNow")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </TranslatedRoute>
  );
};

export default NapTien;