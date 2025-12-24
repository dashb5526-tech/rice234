"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CertificatesSection } from "@/lib/certificates-section";

interface CertificatesSectionEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    content: CertificatesSection;
    onSave: (content: CertificatesSection) => void;
}

export function CertificatesSectionEditDialog({ isOpen, setIsOpen, content, onSave }: CertificatesSectionEditDialogProps) {
    const [currentContent, setCurrentContent] = useState<CertificatesSection>(content);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setCurrentContent(content);
        }
    }, [isOpen, content]);

    const handleContentChange = (field: 'title' | 'description', value: string) => {
        setCurrentContent(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        onSave(currentContent);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Certificates Section</DialogTitle>
                        <DialogDescription>
                            Update the title and description for the certificates section.
                        </DialogDescription>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DialogClose>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="certificates-title">Title</Label>
                            <Input id="certificates-title" value={currentContent.title} onChange={(e) => handleContentChange('title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="certificates-description">Description</Label>
                            <Textarea id="certificates-description" value={currentContent.description} onChange={(e) => handleContentChange('description', e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
