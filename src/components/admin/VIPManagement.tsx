import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Crown, Save, Edit2, Plus, Trash2 } from "lucide-react";

interface VIPLevel {
  id: number;
  level_name: string;
  min_orders: number;
  min_spent: number;
  commission_rate: number;
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
  const [vipLevels, setVipLevels] = useState<VIPLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVIPs, setEditingVIPs] = useState<EditingVIP>({});
  const [savingVIPs, setSavingVIPs] = useState<Set<number>>(new Set());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newVIP, setNewVIP] = useState({
    level_name: '',
    min_orders: 0,
    min_spent: 0,
    commission_rate: 0
  });
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
        <h2 className="text-2xl font-bold">VIP Management</h2>
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
        <h2 className="text-2xl font-bold">VIP Level Management</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{vipLevels.length} VIP Levels</Badge>
          <Button onClick={() => setIsAddingNew(true)} disabled={isAddingNew}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Level
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level ID</TableHead>
              <TableHead>Level Name</TableHead>
              <TableHead>Min Orders</TableHead>
              <TableHead>Min Spent</TableHead>
              <TableHead>Commission Rate (%)</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Add New Row */}
            {isAddingNew && (
              <TableRow className="bg-muted/50">
                <TableCell>
                  <Badge variant="secondary">New</Badge>
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
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsAddingNew(false)}
                    >
                      Cancel
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
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => saveVIP(vip.id)}
                            disabled={isSaving}
                          >
                            <Save className="w-3 h-3 mr-1" />
                            {isSaving ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelEditing(vip.id)}
                            disabled={isSaving}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(vip)}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteVIP(vip.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
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