
"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { getUsers, AppUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function UsersTab() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users data", error);
            toast({
                title: "Error",
                description: "Failed to load users.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="pt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Registered Users</CardTitle>
                    <CardDescription>View all users who have signed up on your website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Registration Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {users.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">No users have registered yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
