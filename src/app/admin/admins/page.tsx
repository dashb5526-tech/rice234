
"use client";

import { useEffect, useState } from "react";
import { getUsers, AppUser, updateUserAdminStatus } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default function ManageAdminsPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      toast({
        title: "Error fetching users",
        description: "Could not retrieve user list. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (user: AppUser, isAdmin: boolean) => {
    setIsSubmitting(true);
    try {
      await updateUserAdminStatus(user.id, isAdmin);
      toast({
        title: "Success",
        description: `${user.email} has been ${isAdmin ? 'made an admin' : 'removed from admins'}.`,
      });
      // Refresh the list to show the change
      fetchUsers(); 
    } catch (error) {
      toast({
        title: "Update Failed",
        description: `Could not update admin status for ${user.email}.`,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <AdminDashboard>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Manage Administrators</CardTitle>
                    <CardDescription>Grant or revoke administrator privileges for users.</CardDescription>
                </div>
                <Button onClick={fetchUsers} disabled={loading || isSubmitting}>
                    {loading ? "Refreshing..." : "Refresh"}
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Admin Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                      <TableCell className="text-right">
                        {user.isAdmin ? (
                          <Button 
                            variant="outline" 
                            onClick={() => handleToggleAdmin(user, false)}
                            disabled={isSubmitting}>
                            Remove Admin
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleToggleAdmin(user, true)}
                            disabled={isSubmitting}>
                            Make Admin
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
    </AdminDashboard>
  );
}
