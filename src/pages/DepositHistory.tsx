import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DepositTransaction {
  id: string;
  amount: number;
  notes: string | null;
  created_at: string;
}

const DepositHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<DepositTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepositHistory();
  }, []);

  const fetchDepositHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('deposit_transactions')
        .select('id, amount, notes, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deposit history:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải lịch sử nạp tiền",
          variant: "destructive"
        });
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Error fetching deposit history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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
          <h1 className="text-lg font-semibold">Lịch sử nạp tiền</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {transactions.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có giao dịch nạp tiền nào</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-md mx-auto space-y-3">
            {transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      Nạp tiền ${transaction.amount.toFixed(2)}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4 text-green-500" />
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Hoàn thành
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Ngày nạp:</span>
                      <span>{formatDate(transaction.created_at)}</span>
                    </div>
                    {transaction.notes && (
                      <div className="mt-2">
                        <span className="font-medium">Ghi chú:</span>
                        <p className="text-gray-500 mt-1">{transaction.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositHistory;