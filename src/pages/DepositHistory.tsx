import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { History, Plus } from "lucide-react";
import TranslatedRoute from "@/components/TranslatedRoute";

interface DepositTransaction {
  id: string;
  amount: number;
  notes: string | null;
  created_at: string;
}

const DepositHistory = () => {
  const [deposits, setDeposits] = useState<DepositTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserDeposits();
  }, []);

  const fetchUserDeposits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to view deposit history",
          variant: "destructive"
        });
        return;
      }

      const { data: depositsData, error } = await supabase
        .from('deposit_transactions')
        .select('id, amount, notes, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDeposits(depositsData || []);
    } catch (error) {
      console.error('Error fetching deposit history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deposit history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TranslatedRoute titleKey="deposit_history">
        <div className="p-4 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </TranslatedRoute>
    );
  }

  return (
    <TranslatedRoute titleKey="deposit_history">
      <div className="p-4 space-y-6">
        <div className="flex items-center space-x-2">
          <History className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Deposit History</h1>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          View all money deposits made to your account by administrators.
        </div>

        {deposits.length > 0 ? (
          <div className="space-y-4">
            {deposits.map((deposit) => (
              <Card key={deposit.id} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Plus className="w-5 h-5 text-green-600" />
                      <span>Deposit</span>
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      +${deposit.amount.toFixed(2)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {format(new Date(deposit.created_at), 'MMM dd, yyyy at HH:mm')}
                  </CardDescription>
                </CardHeader>
                {deposit.notes && (
                  <CardContent className="pt-0">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> {deposit.notes}
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <History className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Deposit History
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                You haven't received any deposits yet. When administrators add money to your account, it will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TranslatedRoute>
  );
};

export default DepositHistory;