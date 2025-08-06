import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { AdminPagination } from "./AdminPagination";
import { usePagination } from "@/hooks/use-pagination";
import { useLanguage } from "@/contexts/LanguageContext";

interface DepositTransaction {
  id: string;
  user_id: string;
  admin_id: string;
  amount: number;
  notes: string | null;
  created_at: string;
  user_profile?: {
    username: string | null;
  };
  admin_profile?: {
    username: string | null;
  };
}

export function DepositHistory() {
  const { t } = useLanguage();
  const [deposits, setDeposits] = useState<DepositTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  // Pagination hook
  const pagination = usePagination({
    data: deposits,
    itemsPerPage
  });

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      // Fetch deposits first
      const { data: depositsData, error } = await supabase
        .from('deposit_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (depositsData) {
        // Fetch user and admin profiles separately
        const userIds = [...new Set(depositsData.map(d => d.user_id))];
        const adminIds = [...new Set(depositsData.map(d => d.admin_id))];
        const allIds = [...new Set([...userIds, ...adminIds])];

        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, username')
          .in('user_id', allIds);

        // Combine the data
        const enrichedDeposits = depositsData.map(deposit => ({
          ...deposit,
          user_profile: {
            username: profiles?.find(p => p.user_id === deposit.user_id)?.username || null
          },
          admin_profile: {
            username: profiles?.find(p => p.user_id === deposit.admin_id)?.username || null
          }
        }));

        setDeposits(enrichedDeposits);
      }
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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('admin.deposit.history')}</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('admin.deposit.history')}</h2>
        <Badge variant="outline">{deposits.length} Total Deposits</Badge>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedData.length > 0 ? (
              pagination.paginatedData.map((deposit) => (
                <TableRow key={deposit.id}>
                  <TableCell>
                    {format(new Date(deposit.created_at), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {deposit.user_profile?.username || 'Unknown User'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      +${deposit.amount.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {deposit.admin_profile?.username || 'Unknown Admin'}
                  </TableCell>
                  <TableCell>
                    {deposit.notes || '-'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No deposit transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AdminPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        itemsPerPage={itemsPerPage}
        onPageChange={pagination.goToPage}
        onItemsPerPageChange={setItemsPerPage}
        onPrevious={pagination.goToPrevious}
        onNext={pagination.goToNext}
        hasNext={pagination.hasNext}
        hasPrevious={pagination.hasPrevious}
        getPageNumbers={pagination.getPageNumbers}
      />
    </div>
  );
}