
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { getOrders, deleteSubmission, Submission } from "@/lib/submissions";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingCart, View } from "lucide-react";
import { SubmissionDetailDialog } from "@/components/admin/submission-detail-dialog";

export function OrdersTab() {
    const [orders, setOrders] = useState<Submission[]>([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Submission | null>(null);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders data", error);
            toast({
                title: "Error",
                description: "Failed to load orders.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteSubmission(id, 'order');
            setOrders(prev => prev.filter(s => s.id !== id));
            toast({ title: "Order Deleted", description: "The order has been removed." });
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not delete order.", variant: "destructive" });
        }
    };

    const openDetail = (order: Submission) => {
        setSelectedOrder(order);
        setIsDetailOpen(true);
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Order Submissions</CardTitle>
                    <CardDescription>View all bulk order requests from your website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact No.</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell>{sub.name}</TableCell>
                                    <TableCell>{sub.email}</TableCell>
                                    <TableCell>{sub.phone}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                        <span>{sub.quantity}kg of {sub.riceType}</span>
                                    </TableCell>
                                    <TableCell>{new Date(sub.timestamp).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => openDetail(sub)}>
                                            <View className="h-4 w-4" />
                                            <span className="sr-only">View</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(sub.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {orders.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">No orders yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <SubmissionDetailDialog
                isOpen={isDetailOpen}
                setIsOpen={setIsDetailOpen}
                submission={selectedOrder}
            />
        </div>
    );
}
