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
import { AdminPagination } from "./AdminPagination";
import { usePagination } from "@/hooks/use-pagination";
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  // Pagination hook
  const pagination = usePagination({
    data: filteredUsers,
    itemsPerPage
  });

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
              <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">
                {isEditing ? (
                  <Input
                    value={isEditing.email}
                    onChange={(e) => updateEditingField(user.user_id, 'email', e.target.value)}
                    className="w-full mt-1 text-sm"
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
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Phone</p>
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
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Balance</p>
                {isEditing ? (
                  <Input
                    value={isEditing.balance}
                    onChange={(e) => updateEditingField(user.user_id, 'balance', parseFloat(e.target.value) || 0)}
                    type="number"
                    step="0.01"
                    className="mt-1 text-sm"
                  />
                ) : (
                  <p className="text-sm sm:text-base font-bold text-green-600">${(user.balance || 0).toFixed(2)}</p>
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 gap-2 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">User Management</h2>
        <Badge variant="outline" className="self-start sm:self-center">{filteredUsers.length} of {users.length} Users</Badge>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg">
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by username, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
        
        <div className="flex flex-col xs:flex-row sm:flex-row md:flex-row gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full xs:w-[120px] sm:w-[130px] md:w-[140px] text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full xs:w-[120px] sm:w-[130px] md:w-[140px] text-sm">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle for Mobile/Tablet */}
          <div className="flex border rounded-md md:hidden w-full xs:w-auto">
            <Button
              variant={viewMode === "cards" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-r-none flex-1 xs:flex-none text-xs"
            >
              Cards
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-l-none flex-1 xs:flex-none text-xs"
            >
              Table
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {viewMode === "cards" ? (
          <div className="space-y-3">
            {pagination.paginatedData.length > 0 ? (
              pagination.paginatedData.map((user) => renderMobileCard(user))
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
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-background">
              <div className="min-w-[600px]"> {/* Ensure minimum width for proper layout */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px] whitespace-nowrap sticky left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">User</TableHead>
                      <TableHead className="min-w-[80px] whitespace-nowrap">Role</TableHead>
                      <TableHead className="min-w-[80px] whitespace-nowrap">Balance</TableHead>
                      <TableHead className="min-w-[80px] whitespace-nowrap">Status</TableHead>
                      <TableHead className="min-w-[60px] whitespace-nowrap sticky right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagination.paginatedData.length > 0 ? (
                      pagination.paginatedData.map((user) => {
                      const isEditing = editingUsers[user.user_id];
                      const isSaving = savingUsers.has(user.user_id);

                      return (
                        <TableRow key={user.id}>
                          <TableCell className="whitespace-nowrap sticky left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="max-w-[120px]">
                              <p className="font-medium truncate">{user.username || 'No username'}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.map((role) => (
                                <Badge key={role} variant={getRoleBadgeVariant(role)} className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                           </TableCell>
                           <TableCell className="whitespace-nowrap">
                             <span className="font-medium text-sm">${(user.balance || 0).toFixed(2)}</span>
                           </TableCell>
                           <TableCell className="whitespace-nowrap">
                             <Badge variant={user.is_locked ? 'destructive' : 'secondary'} className="text-xs">
                               {user.is_locked ? 'Locked' : 'Active'}
                             </Badge>
                           </TableCell>
                           <TableCell className="whitespace-nowrap sticky right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <div className="border rounded-lg">
          <div className="overflow-x-auto">
            <div className="min-w-[1100px]"> {/* Ensure minimum width for proper layout */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] whitespace-nowrap sticky left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">Username</TableHead>
                    <TableHead className="min-w-[180px] whitespace-nowrap">Email</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">Phone</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">Role</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">VIP Level</TableHead>
                    <TableHead className="min-w-[90px] whitespace-nowrap">Total Spent</TableHead>
                    <TableHead className="min-w-[80px] whitespace-nowrap">Balance</TableHead>
                    <TableHead className="min-w-[80px] whitespace-nowrap">Bonus Orders</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">Bonus Amount</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">Account Status</TableHead>
                    <TableHead className="min-w-[100px] whitespace-nowrap">Task Status</TableHead>
                    <TableHead className="min-w-[140px] whitespace-nowrap sticky right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagination.paginatedData.length > 0 ? (
                    pagination.paginatedData.map((user) => {
              const isEditing = editingUsers[user.user_id];
              const isSaving = savingUsers.has(user.user_id);

              return (
                <TableRow key={user.id}>
                  <TableCell className="sticky left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
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
                  
                  <TableCell className="sticky right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
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
  </div>
</div>
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