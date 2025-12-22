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
import { getSubmissions, deleteSubmission, Submission } from "@/lib/submissions";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ShoppingCart, Inbox, View } from "lucide-react";
import { SubmissionDetailDialog } from "@/components/admin/submission-detail-dialog";

export function SubmissionsTab() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isSubmissionDetailOpen, setIsSubmissionDetailOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getSubmissions();
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to fetch submissions data", error);
            toast({
                title: "Error",
                description: "Failed to load submissions.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmissionDelete = async (id: string) => {
        try {
            await deleteSubmission(id);
            setSubmissions(prev => prev.filter(s => s.id !== id));
            toast({ title: "Submission Deleted", description: "The submission has been removed." });
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not delete submission.", variant: "destructive" });
        }
    };

    const openSubmissionDetail = (submission: Submission) => {
        setSelectedSubmission(submission);
        setIsSubmissionDetailOpen(true);
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Form Submissions</CardTitle>
                    <CardDescription>View all inquiries and order requests from your website.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Contact No.</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {submissions.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell>
                                        {sub.type === 'order' ? (
                                            <Badge variant="secondary"><ShoppingCart className="mr-1 h-3 w-3" /> Order</Badge>
                                        ) : (
                                            <Badge variant="outline"><Inbox className="mr-1 h-3 w-3" /> Inquiry</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{sub.name}</TableCell>
                                    <TableCell>{sub.email}</TableCell>
                                    <TableCell>{sub.type === 'order' ? sub.phone : sub.phone || 'N/A'}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                                        {sub.type === 'order' ? (
                                            <span>{sub.quantity}kg of {sub.riceType}</span>
                                        ) : (
                                            <span>{sub.message}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{new Date(sub.timestamp).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" onClick={() => openSubmissionDetail(sub)}>
                                            <View className="h-4 w-4" />
                                            <span className="sr-only">View</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleSubmissionDelete(sub.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {submissions.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">No submissions yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <SubmissionDetailDialog
                isOpen={isSubmissionDetailOpen}
                setIsOpen={setIsSubmissionDetailOpen}
                submission={selectedSubmission}
            />
        </div>
    );
}
