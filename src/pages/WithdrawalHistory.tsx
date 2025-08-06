import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WithdrawalTransaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at?: string;
  notes?: string;
}

const WithdrawalHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<WithdrawalTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawalHistory();
  }, []);

  const fetchWithdrawalHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('withdrawal_transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching withdrawal history:', error);
        toast({
          title: "Lỗi",
          description: "Không thể tải lịch sử rút tiền",
          variant: "destructive"
        });
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Error fetching withdrawal history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ xử lý';
      case 'approved':
        return 'Đã duyệt';
      case 'completed':
        return 'Hoàn thành';
      case 'rejected':
        return 'Bị từ chối';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'approved':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
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
          <h1 className="text-lg font-semibold">Lịch sử rút tiền</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {transactions.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có giao dịch rút tiền nào</p>
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
                      Rút tiền ${transaction.amount.toFixed(2)}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      <Badge variant={getStatusVariant(transaction.status)}>
                        {getStatusLabel(transaction.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Ngày tạo:</span>
                      <span>{formatDate(transaction.created_at)}</span>
                    </div>
                    {transaction.processed_at && (
                      <div className="flex justify-between">
                        <span>Ngày xử lý:</span>
                        <span>{formatDate(transaction.processed_at)}</span>
                      </div>
                    )}
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

export default WithdrawalHistory;