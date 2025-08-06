import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Lock, Unlock, Shield, Edit2, Search, Filter, MoreVertical } from "lucide-react";
import { DepositDialog } from "./DepositDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  phone_number: string | null;
  created_at: string;
  email?: string;
  roles?: string[];
  vip_level: number;
  total_spent: number;
  balance?: number;
  is_locked?: boolean;
  task_locked?: boolean;
  bonus_order_count?: number;
  bonus_amount?: number;
}

interface EditingUser {
  [key: string]: {
    username: string;
    email: string;
    phone_number: string;
    balance: number;
    is_locked: boolean;
    task_locked: boolean;
    vip_level: number;
    bonus_order_count: number;
    bonus_amount: number;
  };
}

interface VipLevel {
  id: number;
  level_name: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [vipLevels, setVipLevels] = useState<VipLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUsers, setEditingUsers] = useState<EditingUser>({});
  const [savingUsers, setSavingUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const { toast } = useToast();

  // Filter users based on search term and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => {
        if (statusFilter === "active") return !user.is_locked;
        if (statusFilter === "locked") return user.is_locked;
        return true;
      });
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => 
        user.roles?.includes(roleFilter)
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter, roleFilter]);

  useEffect(() => {
    fetchUsers();
    fetchVipLevels();
  }, []);

  const fetchVipLevels = async () => {
    try {
      const { data: vipLevels } = await supabase
        .from('vip_levels')
        .select('id, level_name')
        .order('id', { ascending: true });

      if (vipLevels) {
        // Add VIP BASE level for level 0
        setVipLevels([
          { id: 0, level_name: 'VIP BASE' },
          ...vipLevels
        ]);
      }
    } catch (error) {
      console.error('Error fetching VIP levels:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch profiles with all fields including new ones
      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          *
        `);

      if (profiles) {
        // Fetch roles and auth data for each user
        const usersWithDetails = await Promise.all(
          profiles.map(async (profile) => {
            try {
              const { data: authUser } = await supabase.auth.admin.getUserById(profile.user_id);
              const { data: roles } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', profile.user_id);

              return {
                ...profile,
                email: authUser.user?.email,
                roles: roles?.map(r => r.role) || ['user'],
                balance: profile.balance || 0,
                is_locked: profile.is_locked || false,
                task_locked: profile.task_locked || false,
                bonus_order_count: profile.bonus_order_count || 0,
                bonus_amount: profile.bonus_amount || 0,
              };
            } catch (error) {
              console.error(`Error fetching data for user ${profile.user_id}:`, error);
              return {
                ...profile,
                email: 'Error loading',
                roles: ['user'],
                balance: profile.balance || 0,
                is_locked: profile.is_locked || false,
                task_locked: profile.task_locked || false,
                bonus_order_count: profile.bonus_order_count || 0,
                bonus_amount: profile.bonus_amount || 0,
              };
            }
          })
        );

        setUsers(usersWithDetails);
        setFilteredUsers(usersWithDetails);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (user: UserProfile) => {
    setEditingUsers(prev => ({
      ...prev,
      [user.user_id]: {
        username: user.username || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        balance: user.balance || 0,
        is_locked: user.is_locked || false,
        task_locked: user.task_locked || false,
        vip_level: user.vip_level || 0,
        bonus_order_count: user.bonus_order_count || 0,
        bonus_amount: user.bonus_amount || 0,
      }
    }));
  };

  const cancelEditing = (userId: string) => {
    setEditingUsers(prev => {
      const { [userId]: _, ...rest } = prev;
      return rest;
    });
  };

  const updateEditingField = (userId: string, field: string, value: any) => {
    setEditingUsers(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const saveUser = async (userId: string) => {
    const editingData = editingUsers[userId];
    if (!editingData) return;

    setSavingUsers(prev => new Set(prev).add(userId));

    try {
      // Update profile data including balance, lock status, and VIP level
      await supabase
        .from('profiles')
        .update({
          username: editingData.username,
          phone_number: editingData.phone_number,
          balance: editingData.balance,
          is_locked: editingData.is_locked,
          task_locked: editingData.task_locked,
          vip_level: editingData.vip_level,
          bonus_order_count: editingData.bonus_order_count,
          bonus_amount: editingData.bonus_amount,
        })
        .eq('user_id', userId);

      // Update auth email if changed
      const currentUser = users.find(u => u.user_id === userId);
      if (currentUser?.email !== editingData.email) {
        await supabase.auth.admin.updateUserById(userId, {
          email: editingData.email
        });
      }

      // Cancel editing mode
      cancelEditing(userId);
      
      toast({
        title: "Success",
        description: "User updated successfully"
      });

      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    } finally {
      setSavingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Remove existing roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Add new role
      await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: newRole as 'admin' | 'moderator' | 'user' });

      toast({
        title: "Success",
        description: "User role updated successfully"
      });

      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error", 
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const toggleUserLock = async (userId: string, isLocked: boolean) => {
    try {
      // This would update a user lock status in the database
      // For now, we'll just show a toast
      toast({
        title: "Success",
        description: `User ${isLocked ? 'locked' : 'unlocked'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user lock status",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive' as const;
      case 'moderator':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const renderMobileCard = (user: UserProfile) => {
    const isEditing = editingUsers[user.user_id];
    const isSaving = savingUsers.has(user.user_id);

    return (
      <Card key={user.id} className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                {isEditing ? (
                  <Input
                    value={isEditing.username}
                    onChange={(e) => updateEditingField(user.user_id, 'username', e.target.value)}
                    className="w-40"
                  />
                ) : (
                  user.username || 'No username'
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {isEditing ? (
                  <Input
                    value={isEditing.email}
                    onChange={(e) => updateEditingField(user.user_id, 'email', e.target.value)}
                    className="w-48 mt-1"
                    type="email"
                  />
                ) : (
                  user.email || 'No email'
                )}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isEditing ? (
                  <>
                    <DropdownMenuItem onClick={() => startEditing(user)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit User
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => saveUser(user.user_id)} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => cancelEditing(user.user_id)} disabled={isSaving}>
                      Cancel
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                {isEditing ? (
                  <Input
                    value={isEditing.phone_number}
                    onChange={(e) => updateEditingField(user.user_id, 'phone_number', e.target.value)}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm">{user.phone_number || 'No phone'}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Balance</p>
                {isEditing ? (
                  <Input
                    value={isEditing.balance}
                    onChange={(e) => updateEditingField(user.user_id, 'balance', parseFloat(e.target.value) || 0)}
                    type="number"
                    step="0.01"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-sm font-bold text-green-600">${(user.balance || 0).toFixed(2)}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {user.roles?.map((role) => (
                  <Badge key={role} variant={getRoleBadgeVariant(role)}>
                    {role}
                  </Badge>
                ))}
              </div>
              <Badge variant="outline">
                {vipLevels.find(level => level.id === user.vip_level)?.level_name || `VIP ${user.vip_level}`}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Account:</span>
                  {isEditing ? (
                    <Switch
                      checked={!isEditing.is_locked}
                      onCheckedChange={(checked) => updateEditingField(user.user_id, 'is_locked', !checked)}
                    />
                  ) : (
                    <Badge variant={user.is_locked ? 'destructive' : 'secondary'} className="text-xs">
                      {user.is_locked ? 'Locked' : 'Active'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Tasks:</span>
                  {isEditing ? (
                    <Switch
                      checked={!isEditing.task_locked}
                      onCheckedChange={(checked) => updateEditingField(user.user_id, 'task_locked', !checked)}
                    />
                  ) : (
                    <Badge variant={user.task_locked ? 'destructive' : 'secondary'} className="text-xs">
                      {user.task_locked ? 'Locked' : 'Active'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {!isEditing && (
              <div className="flex justify-end pt-2">
                <DepositDialog
                  userId={user.user_id}
                  username={user.username || 'Unknown User'}
                  onSuccess={fetchUsers}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Badge variant="outline">{filteredUsers.length} of {users.length} Users</Badge>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by username, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle for Mobile */}
          <div className="flex border rounded-md lg:hidden">
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none"
            >
              Cards
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none"
            >
              Table
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {viewMode === "cards" ? (
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => renderMobileCard(user))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all" || roleFilter !== "all" 
                      ? "No users found matching the current filters" 
                      : "No users found"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="border rounded-lg">
            <ScrollArea className="w-full">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">User</TableHead>
                      <TableHead className="min-w-[120px]">Role</TableHead>
                      <TableHead className="min-w-[100px]">Balance</TableHead>
                      <TableHead className="min-w-[120px]">Status</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const isEditing = editingUsers[user.user_id];
                        const isSaving = savingUsers.has(user.user_id);

                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.username || 'No username'}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {user.roles?.map((role) => (
                                <Badge key={role} variant={getRoleBadgeVariant(role)} className="mr-1">
                                  {role}
                                </Badge>
                              ))}
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">${(user.balance || 0).toFixed(2)}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.is_locked ? 'destructive' : 'secondary'}>
                                {user.is_locked ? 'Locked' : 'Active'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => startEditing(user)}>
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          {searchTerm || statusFilter !== "all" || roleFilter !== "all" 
                            ? "No users found matching the current filters" 
                            : "No users found"
                          }
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="border rounded-lg">
          <ScrollArea className="w-full">
            <div className="min-w-[1200px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Username</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Phone</TableHead>
                    <TableHead className="min-w-[120px]">Role</TableHead>
                    <TableHead className="min-w-[120px]">VIP Level</TableHead>
                    <TableHead className="min-w-[100px]">Total Spent</TableHead>
                    <TableHead className="min-w-[100px]">Balance</TableHead>
                    <TableHead className="min-w-[100px]">Bonus Orders</TableHead>
                    <TableHead className="min-w-[120px]">Bonus Amount</TableHead>
                    <TableHead className="min-w-[120px]">Account Status</TableHead>
                    <TableHead className="min-w-[120px]">Task Status</TableHead>
                    <TableHead className="min-w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
              const isEditing = editingUsers[user.user_id];
              const isSaving = savingUsers.has(user.user_id);

              return (
                <TableRow key={user.id}>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={isEditing.username}
                        onChange={(e) => updateEditingField(user.user_id, 'username', e.target.value)}
                        className="w-32"
                      />
                    ) : (
                      user.username || 'No username'
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={isEditing.email}
                        onChange={(e) => updateEditingField(user.user_id, 'email', e.target.value)}
                        className="w-48"
                        type="email"
                      />
                    ) : (
                      user.email || 'No email'
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={isEditing.phone_number}
                        onChange={(e) => updateEditingField(user.user_id, 'phone_number', e.target.value)}
                        className="w-32"
                      />
                    ) : (
                      user.phone_number || 'No phone'
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.roles?.map((role) => (
                        <Badge key={role} variant={getRoleBadgeVariant(role)}>
                          {role}
                        </Badge>
                      ))}
                      <Select 
                        value={user.roles?.[0] || 'user'} 
                        onValueChange={(value) => updateUserRole(user.user_id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Mod</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Select 
                        value={isEditing.vip_level.toString()} 
                        onValueChange={(value) => updateEditingField(user.user_id, 'vip_level', parseInt(value))}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {vipLevels.map((level) => (
                            <SelectItem key={level.id} value={level.id.toString()}>
                              {level.level_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">
                        {vipLevels.find(level => level.id === user.vip_level)?.level_name || `VIP ${user.vip_level}`}
                      </Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    ${user.total_spent.toFixed(2)}
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={isEditing.balance}
                        onChange={(e) => updateEditingField(user.user_id, 'balance', parseFloat(e.target.value) || 0)}
                        className="w-24"
                        type="number"
                        step="0.01"
                      />
                    ) : (
                      `$${(user.balance || 0).toFixed(2)}`
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={isEditing.bonus_order_count}
                        onChange={(e) => updateEditingField(user.user_id, 'bonus_order_count', parseInt(e.target.value) || 0)}
                        className="w-20"
                        type="number"
                        min="0"
                      />
                    ) : (
                      user.bonus_order_count || 0
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={isEditing.bonus_amount}
                        onChange={(e) => updateEditingField(user.user_id, 'bonus_amount', parseFloat(e.target.value) || 0)}
                        className="w-24"
                        type="number"
                        step="0.01"
                        min="0"
                      />
                    ) : (
                      `$${(user.bonus_amount || 0).toFixed(2)}`
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <Switch
                          checked={!isEditing.is_locked}
                          onCheckedChange={(checked) => updateEditingField(user.user_id, 'is_locked', !checked)}
                        />
                      ) : (
                        <Badge variant={user.is_locked ? 'destructive' : 'secondary'}>
                          {user.is_locked ? (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 mr-1" />
                              Active
                            </>
                          )}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <Switch
                          checked={!isEditing.task_locked}
                          onCheckedChange={(checked) => updateEditingField(user.user_id, 'task_locked', !checked)}
                        />
                      ) : (
                        <Badge variant={user.task_locked ? 'destructive' : 'secondary'}>
                          {user.task_locked ? (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 mr-1" />
                              Active
                            </>
                          )}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => saveUser(user.user_id)}
                            disabled={isSaving}
                          >
                            <Save className="w-3 h-3 mr-1" />
                            {isSaving ? 'Saving...' : 'Save'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancelEditing(user.user_id)}
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
                            onClick={() => startEditing(user)}
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <DepositDialog
                            userId={user.user_id}
                            username={user.username || 'Unknown User'}
                            onSuccess={fetchUsers}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                {searchTerm || statusFilter !== "all" || roleFilter !== "all" 
                  ? "No users found matching the current filters" 
                  : "No users found"
                }
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </ScrollArea>
</div>
</div>
    </div>
  );
}