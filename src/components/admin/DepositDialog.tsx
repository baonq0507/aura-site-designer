import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface DepositDialogProps {
  userId: string;
  username: string;
  onSuccess: () => void;
}

export function DepositDialog({ userId, username, onSuccess }: DepositDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const depositAmount = parseFloat(amount);

      // Create deposit transaction record
      const { error: depositError } = await supabase
        .from('deposit_transactions')
        .insert({
          user_id: userId,
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          amount: depositAmount,
          notes: notes || null
        });

      if (depositError) throw depositError;

      // Update user balance - first get current balance
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', userId)
        .single();

      const currentBalance = currentProfile?.balance || 0;
      const newBalance = currentBalance + depositAmount;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          balance: newBalance
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Successfully added $${depositAmount.toFixed(2)} to ${username}'s account`
      });

      setOpen(false);
      setAmount("");
      setNotes("");
      onSuccess();
    } catch (error) {
      console.error('Error processing deposit:', error);
      toast({
        title: "Error",
        description: "Failed to process deposit",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Money
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Money to Account</DialogTitle>
          <DialogDescription>
            Add money to {username}'s account. This will be recorded in the transaction history.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="0.00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Optional notes for this deposit"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleDeposit}
            disabled={loading || !amount}
          >
            {loading ? "Processing..." : "Add Money"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}