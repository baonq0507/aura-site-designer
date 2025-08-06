import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WithdrawalTransaction {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at?: string;
  notes?: string;
  withdrawal_password: string;
  user_profile?: {
    username: string | null;
    phone_number: string | null;
  };
}

export function WithdrawalManagement() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalTransaction | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      // Fetch withdrawals first
      const { data: withdrawalsData, error } = await supabase
        .from('withdrawal_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (withdrawalsData) {
        // Fetch user profiles separately
        const userIds = [...new Set(withdrawalsData.map(w => w.user_id))];

        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, username, phone_number')
          .in('user_id', userIds);

        // Combine the data
        const enrichedWithdrawals = withdrawalsData.map(withdrawal => ({
          ...withdrawal,
          user_profile: {
            username: profiles?.find(p => p.user_id === withdrawal.user_id)?.username || null,
            phone_number: profiles?.find(p => p.user_id === withdrawal.user_id)?.phone_number || null
          }
        }));

        setWithdrawals(enrichedWithdrawals);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch withdrawal requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessWithdrawal = async () => {
    if (!selectedWithdrawal || !actionType) return;

    setProcessingId(selectedWithdrawal.id);

    try {
      const newStatus = actionType === "approve" ? "approved" : "rejected";
      
      const { error } = await supabase
        .from('withdrawal_transactions')
        .update({
          status: newStatus,
          processed_at: new Date().toISOString(),
          notes: adminNotes || null
        })
        .eq('id', selectedWithdrawal.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Withdrawal request ${actionType === "approve" ? "approved" : "rejected"} successfully`
      });

      setDialogOpen(false);
      setSelectedWithdrawal(null);
      setAdminNotes("");
      setActionType(null);
      fetchWithdrawals(); // Refresh the list
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to process withdrawal request",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openProcessDialog = (withdrawal: WithdrawalTransaction, action: "approve" | "reject") => {
    setSelectedWithdrawal(withdrawal);
    setActionType(action);
    setDialogOpen(true);
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
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Withdrawal Management</h2>
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
        <h2 className="text-2xl font-bold">Withdrawal Management</h2>
        <Badge variant="outline">{withdrawals.length} Total Requests</Badge>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Processed</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawals.length > 0 ? (
              withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    {format(new Date(withdrawal.created_at), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {withdrawal.user_profile?.username || 'Unknown User'}
                  </TableCell>
                  <TableCell>
                    {withdrawal.user_profile?.phone_number || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-red-600">
                      -${withdrawal.amount.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(withdrawal.status)}
                      <Badge variant={getStatusBadgeVariant(withdrawal.status)}>
                        {getStatusLabel(withdrawal.status)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {withdrawal.processed_at ? 
                      format(new Date(withdrawal.processed_at), 'MMM dd, yyyy HH:mm') 
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {withdrawal.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => openProcessDialog(withdrawal, "approve")}
                            disabled={processingId === withdrawal.id}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => openProcessDialog(withdrawal, "reject")}
                            disabled={processingId === withdrawal.id}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Withdrawal Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <strong>Customer:</strong> {withdrawal.user_profile?.username || 'Unknown'}
                            </div>
                            <div>
                              <strong>Amount:</strong> ${withdrawal.amount.toFixed(2)}
                            </div>
                            <div>
                              <strong>Status:</strong> {getStatusLabel(withdrawal.status)}
                            </div>
                            <div>
                              <strong>Created:</strong> {format(new Date(withdrawal.created_at), 'MMM dd, yyyy HH:mm')}
                            </div>
                            {withdrawal.processed_at && (
                              <div>
                                <strong>Processed:</strong> {format(new Date(withdrawal.processed_at), 'MMM dd, yyyy HH:mm')}
                              </div>
                            )}
                            {withdrawal.notes && (
                              <div>
                                <strong>Admin Notes:</strong>
                                <p className="text-sm text-muted-foreground mt-1">{withdrawal.notes}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No withdrawal requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Process Withdrawal Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve" : "Reject"} Withdrawal Request
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" 
                ? "Confirm approval of this withdrawal request. The customer will be notified."
                : "Provide a reason for rejecting this withdrawal request."
              }
            </DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <div><strong>Customer:</strong> {selectedWithdrawal.user_profile?.username}</div>
                <div><strong>Amount:</strong> ${selectedWithdrawal.amount.toFixed(2)}</div>
                <div><strong>Date:</strong> {format(new Date(selectedWithdrawal.created_at), 'MMM dd, yyyy HH:mm')}</div>
              </div>
              <div>
                <Label htmlFor="admin-notes">
                  {actionType === "approve" ? "Notes (optional)" : "Reason for rejection"}
                </Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={actionType === "approve" 
                    ? "Optional notes for this approval"
                    : "Please provide a reason for rejection"
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={processingId === selectedWithdrawal?.id}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessWithdrawal}
              disabled={processingId === selectedWithdrawal?.id || (actionType === "reject" && !adminNotes.trim())}
              variant={actionType === "approve" ? "default" : "destructive"}
            >
              {processingId === selectedWithdrawal?.id ? "Processing..." : 
                actionType === "approve" ? "Approve Request" : "Reject Request"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}