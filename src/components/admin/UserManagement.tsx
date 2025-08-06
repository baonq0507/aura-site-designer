import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Crown, Mail, Calendar, Shield } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  phone_number: string | null;
  created_at: string;
  email?: string;
  roles?: string[];
}

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles with auth users data
      const { data: profiles } = await supabase
        .from('profiles')
        .select(`
          *
        `);

      if (profiles) {
        // Fetch roles for each user
        const usersWithRoles = await Promise.all(
          profiles.map(async (profile) => {
            const { data: authUser } = await supabase.auth.admin.getUserById(profile.user_id);
            const { data: roles } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', profile.user_id);

            return {
              ...profile,
              email: authUser.user?.email,
              roles: roles?.map(r => r.role) || ['user']
            };
          })
        );

        setUsers(usersWithRoles);
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Badge variant="outline">{users.length} Total Users</Badge>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>{user.username || 'No username'}</span>
                </div>
                <div className="flex space-x-1">
                  {user.roles?.map((role) => (
                    <Badge key={role} variant={getRoleBadgeVariant(role)}>
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email || 'No email'}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Select 
                    value={user.roles?.[0] || 'user'} 
                    onValueChange={(value) => updateUserRole(user.user_id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {user.phone_number && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Phone: {user.phone_number}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}