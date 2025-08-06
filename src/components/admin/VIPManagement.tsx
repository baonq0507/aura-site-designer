import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Crown, Save, Edit2, Plus, Trash2, Upload, Image, MoreVertical, Lock, Unlock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VIPLevel {
  id: number;
  level_name: string;
  min_orders: number;
  min_spent: number;
  commission_rate: number;
  image_url?: string;
  created_at: string;
}

interface EditingVIP {
  [key: number]: {
    level_name: string;
    min_orders: number;
    min_spent: number;
    commission_rate: number;
  };
}

export function VIPManagement() {
  const { t } = useLanguage();
  const [vipLevels, setVipLevels] = useState<VIPLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVIPs, setEditingVIPs] = useState<EditingVIP>({});
  const [savingVIPs, setSavingVIPs] = useState<Set<number>>(new Set());
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newVIP, setNewVIP] = useState({
    level_name: '',
    min_orders: 0,
    min_spent: 0,
    commission_rate: 0
  });
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchVIPLevels();
  }, []);

  const fetchVIPLevels = async () => {
    try {
      const { data: vipLevels } = await supabase
        .from('vip_levels')
        .select('*')
        .order('id');

      if (vipLevels) {
        setVipLevels(vipLevels);
      }
    } catch (error) {
      console.error('Error fetching VIP levels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch VIP levels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (vip: VIPLevel) => {
    setEditingVIPs(prev => ({
      ...prev,
      [vip.id]: {
        level_name: vip.level_name,
        min_orders: vip.min_orders,
        min_spent: vip.min_spent,
        commission_rate: vip.commission_rate,
      }
    }));
  };

  const cancelEditing = (vipId: number) => {
    setEditingVIPs(prev => {
      const { [vipId]: _, ...rest } = prev;
      return rest;
    });
  };

  const updateEditingField = (vipId: number, field: string, value: any) => {
    setEditingVIPs(prev => ({
      ...prev,
      [vipId]: {
        ...prev[vipId],
        [field]: value
      }
    }));
  };

  const saveVIP = async (vipId: number) => {
    const editingData = editingVIPs[vipId];
    if (!editingData) return;

    setSavingVIPs(prev => new Set(prev).add(vipId));

    try {
      await supabase
        .from('vip_levels')
        .update({
          level_name: editingData.level_name,
          min_orders: editingData.min_orders,
          min_spent: editingData.min_spent,
          commission_rate: editingData.commission_rate,
        })
        .eq('id', vipId);

      cancelEditing(vipId);
      
      toast({
        title: "Success",
        description: "VIP level updated successfully"
      });

      fetchVIPLevels();
    } catch (error) {
      console.error('Error updating VIP level:', error);
      toast({
        title: "Error",
        description: "Failed to update VIP level",
        variant: "destructive"
      });
    } finally {
      setSavingVIPs(prev => {
        const newSet = new Set(prev);
        newSet.delete(vipId);
        return newSet;
      });
    }
  };

  const addNewVIP = async () => {
    try {
      const { error } = await supabase
        .from('vip_levels')
        .insert({
          level_name: newVIP.level_name,
          min_orders: newVIP.min_orders,
          min_spent: newVIP.min_spent,
          commission_rate: newVIP.commission_rate,
        } as any);

      setIsAddingNew(false);
      setNewVIP({
        level_name: '',
        min_orders: 0,
        min_spent: 0,
        commission_rate: 0
      });

      toast({
        title: "Success",
        description: "New VIP level added successfully"
      });

      fetchVIPLevels();
    } catch (error) {
      console.error('Error adding VIP level:', error);
      toast({
        title: "Error",
        description: "Failed to add VIP level",
        variant: "destructive"
      });
    }
  };

  const uploadVIPImage = async (vipId: number, file: File) => {
    setUploadingImages(prev => new Set(prev).add(vipId));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `vip-${vipId}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('vip-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('vip-images')
        .getPublicUrl(filePath);

      // Update VIP level with image URL
      await supabase
        .from('vip_levels')
        .update({ image_url: publicUrl })
        .eq('id', vipId);

      toast({
        title: "Success",
        description: "VIP image uploaded successfully"
      });

      // Force refresh by adding timestamp to bypass cache
      setTimeout(() => {
        fetchVIPLevels();
      }, 1000);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(vipId);
        return newSet;
      });
    }
  };

  const handleFileChange = (vipId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive"
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      uploadVIPImage(vipId, file);
    }
  };

  const deleteVIP = async (vipId: number) => {
    if (!confirm('Are you sure you want to delete this VIP level?')) return;

    try {
      await supabase
        .from('vip_levels')
        .delete()
        .eq('id', vipId);

      toast({
        title: "Success",
        description: "VIP level deleted successfully"
      });

      fetchVIPLevels();
    } catch (error) {
      console.error('Error deleting VIP level:', error);
      toast({
        title: "Error",
        description: "Failed to delete VIP level",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getVIPColor = (level: number) => {
    if (level <= 3) return "text-amber-600";
    if (level <= 6) return "text-purple-600";
    if (level <= 8) return "text-blue-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('admin.vip.management')}</h2>
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
        <h2 className="text-2xl font-bold">{t('admin.vip.management')}</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{vipLevels.length} VIP Levels</Badge>
          <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
            <Plus className="w-4 h-4 mr-2" />
            {t('admin.vip.add.new')}
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.level.id')}</TableHead>
              <TableHead>{t('admin.image')}</TableHead>
              <TableHead>{t('admin.level.name')}</TableHead>
              <TableHead>{t('admin.min.orders')}</TableHead>
              <TableHead>{t('admin.min.spent')}</TableHead>
              <TableHead>{t('admin.commission.rate')}</TableHead>
              <TableHead>{t('admin.created.date')}</TableHead>
              <TableHead>{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Add New Row */}
            {isAddingNew && (
              <TableRow className="bg-muted/50">
                <TableCell>
                  <Badge variant="secondary">{t('admin.new')}</Badge>
                </TableCell>
                <TableCell>
                  <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                    <Image className="w-6 h-6 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Level name"
                    value={newVIP.level_name}
                    onChange={(e) => setNewVIP(prev => ({ ...prev, level_name: e.target.value }))}
                    className="w-32"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newVIP.min_orders}
                    onChange={(e) => setNewVIP(prev => ({ ...prev, min_orders: parseInt(e.target.value) || 0 }))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newVIP.min_spent}
                    onChange={(e) => setNewVIP(prev => ({ ...prev, min_spent: parseFloat(e.target.value) || 0 }))}
                    className="w-32"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newVIP.commission_rate}
                    onChange={(e) => setNewVIP(prev => ({ ...prev, commission_rate: parseFloat(e.target.value) || 0 }))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" onClick={addNewVIP}>
                      <Save className="w-3 h-3 mr-1" />
                      {t('admin.add')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingNew(false)}
                    >
                      {t('admin.cancel')}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Existing VIP Levels */}
            {vipLevels.map((vip) => {
              const isEditing = editingVIPs[vip.id];
              const isSaving = savingVIPs.has(vip.id);

              return (
                <TableRow key={vip.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Crown className={`w-4 h-4 ${getVIPColor(vip.id)}`} />
                      <Badge variant="outline">#{vip.id}</Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="relative">
                      {vip.image_url ? (
                        <img 
                          src={vip.image_url} 
                          alt={vip.level_name}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center border">
                          <Image className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Upload Button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 p-1 h-6 w-6"
                        onClick={() => fileInputRefs.current[vip.id]?.click()}
                        disabled={uploadingImages.has(vip.id)}
                      >
                        {uploadingImages.has(vip.id) ? (
                          <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3" />
                        )}
                      </Button>
                      
                      {/* Hidden File Input */}
                      <input
                        ref={(el) => (fileInputRefs.current[vip.id] = el)}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(vip.id, e)}
                      />
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={isEditing.level_name}
                        onChange={(e) => updateEditingField(vip.id, 'level_name', e.target.value)}
                        className="w-32"
                      />
                    ) : (
                      vip.level_name
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={isEditing.min_orders}
                        onChange={(e) => updateEditingField(vip.id, 'min_orders', parseInt(e.target.value) || 0)}
                        className="w-24"
                      />
                    ) : (
                      vip.min_orders.toLocaleString()
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={isEditing.min_spent}
                        onChange={(e) => updateEditingField(vip.id, 'min_spent', parseFloat(e.target.value) || 0)}
                        className="w-32"
                      />
                    ) : (
                      formatCurrency(vip.min_spent)
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={isEditing.commission_rate}
                        onChange={(e) => updateEditingField(vip.id, 'commission_rate', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                    ) : (
                      <Badge variant="secondary">
                        {(vip.commission_rate * 100).toFixed(2)}%
                      </Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {new Date(vip.created_at).toLocaleDateString()}
                  </TableCell>
                  
                   <TableCell>
                     <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                           <MoreVertical className="w-4 h-4" />
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-48 z-50 bg-background border border-border shadow-lg">
                         {!isEditing ? (
                           <>
                             <DropdownMenuItem onClick={() => startEditing(vip)}>
                               <Edit2 className="w-4 h-4 mr-2" />
                               {t('admin.edit')}
                             </DropdownMenuItem>
                             <DropdownMenuItem 
                               onClick={() => deleteVIP(vip.id)}
                               className="text-red-600"
                             >
                               <Trash2 className="w-4 h-4 mr-2" />
                               {t('common.delete')}
                             </DropdownMenuItem>
                           </>
                         ) : (
                           <>
                             <DropdownMenuItem onClick={() => saveVIP(vip.id)} disabled={isSaving}>
                               <Save className="w-4 h-4 mr-2" />
                               {isSaving ? t('admin.saving') : t('common.save')}
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => cancelEditing(vip.id)} disabled={isSaving}>
                               {t('admin.cancel')}
                             </DropdownMenuItem>
                           </>
                         )}
                       </DropdownMenuContent>
                     </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}