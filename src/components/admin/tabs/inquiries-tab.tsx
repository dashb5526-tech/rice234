
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
import { getInquiries, deleteSubmission, Submission } from "@/lib/submissions";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Inbox, View } from "lucide-react";
import { SubmissionDetailDialog } from "@/components/admin/submission-detail-dialog";

export function InquiriesTab() {
    const [inquiries, setInquiries] = useState<Submission[]>([]);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<Submission | null>(null);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getInquiries();
            setInquiries(data);
        } catch (error) {
            console.error("Failed to fetch inquiries data", error);
            toast({
                title: "Error",
                description: "Failed to load inquiries.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteSubmission(id, 'contact');
            setInquiries(prev => prev.filter(s => s.id !== id));
            toast({ title: "Inquiry Deleted", description: "The inquiry has been removed." });
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not delete inquiry.", variant: "destructive" });
        }
    };

    const openDetail = (inquiry: Submission) => {
        setSelectedInquiry(inquiry);
        setIsDetailOpen(true);
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Inquiry Submissions</CardTitle>
                    <CardDescription>View all general inquiries from your website contact form.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact No.</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inquiries.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell>{sub.name}</TableCell>
                                    <TableCell>{sub.email}</TableCell>
                                    <TableCell>{sub.phone || 'N/A'}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                        <span>{sub.message}</span>
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
                    {inquiries.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">No inquiries yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <SubmissionDetailDialog
                isOpen={isDetailOpen}
                setIsOpen={setIsDetailOpen}
                submission={selectedInquiry}
            />
        </div>
    );
}
