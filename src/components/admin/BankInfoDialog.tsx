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
  'Vietcombank', 'BIDV', 'VietinBank', 'Agribank', 'Techcombank',
  'ACB', 'MB Bank', 'TPBank', 'VPBank', 'SHB', 'Sacombank',
  'OCB', 'MSB', 'HDBank', 'VIB', 'LienVietPostBank', 'Eximbank',
  'SeABank', 'VietCapitalBank', 'NCB', 'BaoVietBank', 'KienLongBank',
  'DongA Bank', 'VietABank', 'PVcomBank', 'BacABank', 'GPBank'
];

export function BankInfoDialog({ open, onOpenChange, userId, username }: BankInfoDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    account_holder: '',
    branch: ''
  });

  useEffect(() => {
    if (open && userId) {
      loadBankAccounts();
    }
  }, [open, userId]);

  const loadBankAccounts = () => {
    setLoading(true);
    try {
      // Load from localStorage based on userId
      const saved = localStorage.getItem(`bankAccounts_${userId}`);
      if (saved) {
        setBankAccounts(JSON.parse(saved));
      } else {
        setBankAccounts([]);
      }
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      setBankAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const saveBankAccounts = (accounts: BankAccount[]) => {
    try {
      localStorage.setItem(`bankAccounts_${userId}`, JSON.stringify(accounts));
      setBankAccounts(accounts);
    } catch (error) {
      console.error('Error saving bank accounts:', error);
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
      id: editingAccount || Date.now().toString(),
      ...formData
    };

    let updatedAccounts;
    if (editingAccount) {
      // Update existing account
      updatedAccounts = bankAccounts.map(account => 
        account.id === editingAccount ? newAccount : account
      );
    } else {
      // Add new account
      updatedAccounts = [...bankAccounts, newAccount];
    }

    saveBankAccounts(updatedAccounts);
    
    toast({
      title: "Thành công",
      description: editingAccount ? "Đã cập nhật thông tin ngân hàng" : "Đã thêm tài khoản ngân hàng mới"
    });

    resetForm();
  };

  const handleEdit = (account: BankAccount) => {
    setFormData({
      bank_name: account.bank_name,
      account_number: account.account_number,
      account_holder: account.account_holder,
      branch: account.branch || ''
    });
    setEditingAccount(account.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedAccounts = bankAccounts.filter(account => account.id !== id);
    saveBankAccounts(updatedAccounts);
    
    toast({
      title: "Thành công",
      description: "Đã xóa tài khoản ngân hàng"
    });
  };

  const resetForm = () => {
    setFormData({
      bank_name: '',
      account_number: '',
      account_holder: '',
      branch: ''
    });
    setEditingAccount(null);
    setShowAddForm(false);
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
              Danh sách tài khoản ngân hàng ({bankAccounts.length})
            </h3>
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm tài khoản
            </Button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {editingAccount ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}
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
                      {editingAccount ? 'Cập nhật' : 'Thêm mới'}
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

          {/* Bank Accounts List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Đang tải...</p>
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chưa có tài khoản ngân hàng nào được liên kết</p>
              <Button
                onClick={() => setShowAddForm(true)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm tài khoản đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {bankAccounts.map((account) => (
                <Card key={account.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{account.bank_name}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Số TK:</span> {account.account_number}
                          </div>
                          <div>
                            <span className="font-medium">Chủ TK:</span> {account.account_holder}
                          </div>
                          {account.branch && (
                            <div className="md:col-span-2">
                              <span className="font-medium">Chi nhánh:</span> {account.branch}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          onClick={() => handleEdit(account)}
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
                                Bạn có chắc chắn muốn xóa tài khoản ngân hàng {account.bank_name} - {account.account_number}?
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(account.id)}
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
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}