import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react";

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  branch?: string;
}

const BankLinking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    branch: ""
  });

  const banks = [
    "USDT",
    "JPMORGAN CHASE", "PERSONAL BANK", "BANK OF AMERICA", "NAVY FEDERAL CREDIT UNION",
    "WELLS FARGO", "CHASE BANK", "REGIONS BANK", "Commercial Bank", "USBANK",
    "CITIGROUP", "PNC BANK", "U.S. BANCORP", "PNC FINANCIAL SERVIES", "GOLDMAN SACHS",
    "TRUIST FINANCIAL", "CAPITAL ONE FINANCIAL", "TD GROUP HOLDINGS", "TD BANK",
    "SCOTIABANK", "RBC", "BMO - BANK OF MONTREAL", "AMEX BANK OF CANADA", "CANADA BRANCH",
    "BANK OF NOVA SCOTIA", "BANK WEST", "B2B BANK", "BDC", "CTB", "CANADIAN WESTERN BANK",
    "CAPITAL ONE", "CITI CANADA", "CFF BANK", "COMMONWEALTH BANK", "ANZ", "WESTPAC BANK",
    "HSBC BANK", "CITIBANK", "BANKWWEST", "VIRGIN MONEY AUTRALIA",
    "BIDV", "VIETCOMBANK", "VIETINBANK", "AGRIBANK", "ABBANK", "ACB", "ANZ", "BAC A BANK",
    "BANGKOK BANK", "BAO VIET BANK", "BFCE", "BIDC", "BNK", "BNP PARIBAS HCM", "BNP PARIBAS HN",
    "BOCHK", "BOCOM", "BOI-BANK OF INDIA", "BSP", "BVBANK TIMO", "CAKE", "CBBANK", "CCB",
    "CIMB", "CITIBANK", "CO-OPBANK", "CREDIT AGRICOLE", "CTBC", "CUB CL", "CUB HCM", "DBS",
    "DONG A BANK", "ESB", "EXIMBANK", "GPBANK", "HANOI ABC", "HD BANK", "HSBC", "ICBC",
    "IVB", "KIEN LONG BANK", "LPBANK", "MB BANK", "MSB", "NAM A BANK", "NAPAS", "NCB",
    "OCB", "OCBC", "OCEANBANK", "PBVN", "PGBANK", "PVCOMBANK", "SACOMBANK", "SAIGONBANK",
    "SCB", "SCVN", "SEABANK", "SHB", "SHINHAN", "SMBC", "SVFC", "TECHCOMBANK", "TPBANK",
    "UBANK", "UMEE", "UOB VIETNAM", "VBSP", "VDB", "VIB", "VIET A BANK", "VIET CAPITAL BANK",
    "VIETBANK", "VIETTEL MONEY", "VINASIAM BANK", "VNPT MONEY", "VPBANK", "VRB", "WOORI BANK",
    "SCSB", "VIKKI BY HDBANK", "WOORI BANK", "SHINHAN BANK", "ZELLE", "NONGHYUP", "KDB BANK",
    "KOOKMIN BANK", "UFJ BANK", "SMBC BANK", "YUCHO BANK", "MIZUHO BANK", "Long Hui Bank",
    "Columbus State Bank", "Colony Bank", "Columbia Bank", "Huntington Bank", "First Bank",
    "Santander Bank", "KeyBank", "Cadence Bank", "Citizens 1st Bank", "Citizens Bank",
    "Commercial Bank", "Comerica bank"
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/auth");
      return;
    }
    loadBankAccounts(session.user.id);
  };

  const loadBankAccounts = async (userId: string) => {
    try {
      // Load from localStorage for now
      const savedData = localStorage.getItem(`bank-accounts-${userId}`);
      if (savedData) {
        setBankAccounts(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newAccount: BankAccount = {
        id: Date.now().toString(),
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        account_holder: formData.accountHolder,
        branch: formData.branch
      };

      const savedData = localStorage.getItem(`bank-accounts-${user.id}`);
      const accounts = savedData ? JSON.parse(savedData) : [];
      accounts.push(newAccount);
      localStorage.setItem(`bank-accounts-${user.id}`, JSON.stringify(accounts));

      toast({
        title: "Thành công",
        description: "Đã thêm tài khoản ngân hàng"
      });

      setFormData({ bankName: "", accountNumber: "", accountHolder: "", branch: "" });
      setShowForm(false);
      loadBankAccounts(user.id);
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm tài khoản ngân hàng",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const savedData = localStorage.getItem(`bank-accounts-${user.id}`);
      if (savedData) {
        const accounts = JSON.parse(savedData);
        const filteredAccounts = accounts.filter((account: BankAccount) => account.id !== id);
        localStorage.setItem(`bank-accounts-${user.id}`, JSON.stringify(filteredAccounts));
      }

      toast({
        title: "Thành công",
        description: "Đã xóa tài khoản ngân hàng"
      });

      setBankAccounts(prev => prev.filter(account => account.id !== id));
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa tài khoản ngân hàng",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Liên kết ngân hàng</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="bg-white/15 border-white/30 text-white hover:bg-white/25"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4 relative">{/* Fixed container for proper dropdown positioning */}
        {/* Add Bank Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Thêm tài khoản ngân hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Ngân hàng</Label>
                  <div className="relative">
                    <Select 
                      value={formData.bankName} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, bankName: value }))}
                    >
                      <SelectTrigger className="w-full bg-background border-input">
                        <SelectValue placeholder="Chọn ngân hàng" />
                      </SelectTrigger>
                      <SelectContent 
                        className="z-[9999] bg-popover border-border shadow-xl max-h-[300px] overflow-hidden"
                        position="popper"
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        avoidCollisions={true}
                      >
                        <div className="max-h-[250px] overflow-y-auto">
                          {banks.map((bank) => (
                            <SelectItem 
                              key={bank} 
                              value={bank} 
                              className="cursor-pointer hover:bg-accent focus:bg-accent data-[highlighted]:bg-accent"
                            >
                              {bank}
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Số tài khoản</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="Nhập số tài khoản"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolder">Họ và tên</Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
                    placeholder="Tên chủ tài khoản"
                    required
                  />
                </div>


                <div className="flex space-x-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Đang thêm..." : "Thêm tài khoản"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Bank Accounts List */}
        {bankAccounts.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Tài khoản đã liên kết</h3>
            {bankAccounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">{account.bank_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {account.account_number} - {account.account_holder}
                        </div>
                        {account.branch && (
                          <div className="text-xs text-muted-foreground">
                            Chi nhánh: {account.branch}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(account.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !showForm && (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có tài khoản ngân hàng</h3>
              <p className="text-muted-foreground mb-4">
                Thêm tài khoản ngân hàng để thực hiện giao dịch
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm tài khoản
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BankLinking;