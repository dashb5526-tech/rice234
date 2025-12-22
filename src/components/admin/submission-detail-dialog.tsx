"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Submission } from "@/lib/submissions";

interface SubmissionDetailDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    submission: Submission | null;
}

export function SubmissionDetailDialog({ isOpen, setIsOpen, submission }: SubmissionDetailDialogProps) {
    if (!submission) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submission Details</DialogTitle>
                    <DialogDescription>
                        Full details for the submission received on {new Date(submission.timestamp).toLocaleString()}.
                    </DialogDescription>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogClose>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-muted-foreground">Type:</span>
                        <span className="col-span-2">{submission.type}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-muted-foreground">Name:</span>
                        <span className="col-span-2">{submission.name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-muted-foreground">Email:</span>
                        <span className="col-span-2">{submission.email}</span>
                    </div>

                    {submission.type === 'contact' && submission.phone && (
                        <div className="grid grid-cols-3 gap-2">
                            <span className="font-semibold text-muted-foreground">Phone:</span>
                            <span className="col-span-2">{submission.phone}</span>
                        </div>
                    )}

                    {submission.type === 'order' && (
                        <>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-muted-foreground">Company:</span>
                                <span className="col-span-2">{submission.company || '-'}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-muted-foreground">Phone:</span>
                                <span className="col-span-2">{submission.phone}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-muted-foreground">Rice Type:</span>
                                <span className="col-span-2">{submission.riceType}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <span className="font-semibold text-muted-foreground">Quantity:</span>
                                <span className="col-span-2">{submission.quantity}</span>
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                        <span className="font-semibold text-muted-foreground">Message:</span>
                        <div className="col-span-3 mt-1 p-3 bg-muted rounded-md whitespace-pre-wrap">{submission.message}</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
