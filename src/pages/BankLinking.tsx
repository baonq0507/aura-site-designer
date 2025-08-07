import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  branch?: string;
}

const BankLinking = () => {
  const maskAccountNumber = (accountNumber: string) => {
    if (accountNumber.length <= 4) return accountNumber;
    const lastFour = accountNumber.slice(-4);
    const maskedPart = "*".repeat(accountNumber.length - 4);
    return maskedPart + lastFour;
  };
  const navigate = useNavigate();
  const { t } = useLanguage();
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
    
    if (!formData.bankName || !formData.accountNumber || !formData.accountHolder) {
      toast({
        title: t('common.error'),
        description: t('bank.linking.error.fill.required'),
        variant: "destructive"
      });
      return;
    }
    
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
        title: t('common.success') || "Thành công",
        description: t('bank.linking.account.added')
      });

      setFormData({ bankName: "", accountNumber: "", accountHolder: "", branch: "" });
      setShowForm(false);
      loadBankAccounts(user.id);
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast({
        title: t('common.error'),
        description: t('bank.linking.error.fill.required'),
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
        title: t('common.success') || "Thành công",
        description: t('bank.linking.account.deleted')
      });

      setBankAccounts(prev => prev.filter(account => account.id !== id));
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast({
        title: t('common.error'),
        description: t('bank.linking.error.fill.required'),
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4 flex-shrink-0">
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
            <h1 className="text-lg font-semibold">{t('bank.linking.title')}</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto">{/* Fixed: Added flex-1 and overflow-auto */}
        {/* Add Bank Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{t('bank.linking.add.account')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">{t('bank.linking.select.bank')}</Label>
                  <select 
                    value={formData.bankName}
                    onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">{t('bank.linking.select.bank')}</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">{t('bank.linking.account.number')}</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder={t('bank.linking.account.number.placeholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountHolder">{t('bank.linking.account.holder')}</Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData(prev => ({ ...prev, accountHolder: e.target.value }))}
                    placeholder={t('bank.linking.account.holder.placeholder')}
                    required
                  />
                </div>


                <div className="flex space-x-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? t('bank.linking.adding') : t('bank.linking.add.account.button')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    {t('bank.linking.cancel')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Bank Accounts List */}
        {bankAccounts.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{t('bank.linking.account.details')}</h3>
            {bankAccounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">{account.bank_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {maskAccountNumber(account.account_number)} - {account.account_holder}
                        </div>
                        {account.branch && (
                          <div className="text-xs text-muted-foreground">
                            {t('bank.linking.branch')}: {account.branch}
                          </div>
                        )}
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('bank.linking.delete.confirm')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('bank.linking.delete.warning')}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('bank.linking.cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(account.id)}>
                            {t('common.delete')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !showForm && (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('bank.linking.no.accounts')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('bank.linking.no.accounts.desc')}
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('bank.linking.add.first')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BankLinking;