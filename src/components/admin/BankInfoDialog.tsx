import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Save, X } from "lucide-react";
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

interface BankInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  username: string;
}

const BANKS = [
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

export function BankInfoDialog({ open, onOpenChange, userId, username }: BankInfoDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_holder: '',
    branch: ''
  });

  useEffect(() => {
    if (open && userId) {
      loadBankAccount();
    }
  }, [open, userId]);

  const loadBankAccount = () => {
    setLoading(true);
    try {
      // Load from localStorage based on userId (single bank account)
      const saved = localStorage.getItem(`bank-accounts-${userId}`);
      if (saved) {
        const accounts = JSON.parse(saved);
        setBankAccount(accounts.length > 0 ? accounts[0] : null);
      } else {
        setBankAccount(null);
      }
    } catch (error) {
      console.error('Error loading bank account:', error);
      setBankAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const saveBankAccount = (account: BankAccount | null) => {
    try {
      const accounts = account ? [account] : [];
      localStorage.setItem(`bank-accounts-${userId}`, JSON.stringify(accounts));
      setBankAccount(account);
    } catch (error) {
      console.error('Error saving bank account:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin ngân hàng",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bank_name || !formData.account_number || !formData.account_holder) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      ...formData
    };

    saveBankAccount(newAccount);
    
    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin ngân hàng"
    });

    resetForm();
  };

  const handleEdit = () => {
    if (bankAccount) {
      setFormData({
        bank_name: bankAccount.bank_name,
        account_number: bankAccount.account_number,
        account_holder: bankAccount.account_holder,
        branch: bankAccount.branch || ''
      });
      setShowForm(true);
    }
  };

  const handleDelete = () => {
    saveBankAccount(null);
    
    toast({
      title: "Thành công",
      description: "Đã xóa thông tin ngân hàng"
    });
  };

  const resetForm = () => {
    setFormData({
      bank_name: '',
      account_number: '',
      account_holder: '',
      branch: ''
    });
    setShowForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Thông tin ngân hàng - {username}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Thông tin ngân hàng
            </h3>
            {!bankAccount && (
              <Button
                onClick={() => setShowForm(true)}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm ngân hàng
              </Button>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {bankAccount ? 'Chỉnh sửa ngân hàng' : 'Thêm ngân hàng'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank_name">Ngân hàng *</Label>
                      <Select 
                        value={formData.bank_name} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, bank_name: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ngân hàng" />
                        </SelectTrigger>
                        <SelectContent>
                          {BANKS.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account_number">Số tài khoản *</Label>
                      <Input
                        id="account_number"
                        value={formData.account_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
                        placeholder="Nhập số tài khoản"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="account_holder">Chủ tài khoản *</Label>
                      <Input
                        id="account_holder"
                        value={formData.account_holder}
                        onChange={(e) => setFormData(prev => ({ ...prev, account_holder: e.target.value }))}
                        placeholder="Nhập tên chủ tài khoản"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch">Chi nhánh</Label>
                      <Input
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                        placeholder="Nhập chi nhánh (tùy chọn)"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      {bankAccount ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={resetForm}>
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Bank Account Display */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Đang tải...</p>
            </div>
          ) : !bankAccount ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chưa có ngân hàng nào được liên kết</p>
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm ngân hàng
              </Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{bankAccount.bank_name}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Số TK:</span> {bankAccount.account_number}
                      </div>
                      <div>
                        <span className="font-medium">Chủ TK:</span> {bankAccount.account_holder}
                      </div>
                      {bankAccount.branch && (
                        <div className="md:col-span-2">
                          <span className="font-medium">Chi nhánh:</span> {bankAccount.branch}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      size="sm"
                    >
                      Sửa
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa ngân hàng {bankAccount.bank_name} - {bankAccount.account_number}?
                            Hành động này không thể hoàn tác.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}