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
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { ContactInfo } from "@/lib/contact-info";

interface ContactInfoEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    info: ContactInfo;
    onSave: (info: ContactInfo, selectedFile: File | null) => void;
}

export function ContactInfoEditDialog({ isOpen, setIsOpen, info, onSave }: ContactInfoEditDialogProps) {
    const [currentInfo, setCurrentInfo] = useState<ContactInfo>(info);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(info.imageUrl || null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setCurrentInfo(info);
            setPreviewUrl(info.imageUrl || null);
            setSelectedFile(null);
        }
    }, [isOpen, info]);

    const handleInfoChange = (field: keyof Omit<ContactInfo, 'imageUrl' | 'coordinates'>, value: string) => {
        setCurrentInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast({ title: "File Too Large", description: "Please select an image smaller than 10MB.", variant: "destructive" });
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = () => {
        onSave(currentInfo, selectedFile);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Contact Information</DialogTitle>
                    <DialogDescription>
                        Update the contact details and map image for your website.
                    </DialogDescription>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogClose>
                </DialogHeader>
                <ScrollArea className="h-[70vh] pr-6">
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" value={currentInfo.address} onChange={(e) => handleInfoChange('address', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" value={currentInfo.phone} onChange={(e) => handleInfoChange('phone', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={currentInfo.email} onChange={(e) => handleInfoChange('email', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsappNumber">WhatsApp No.</Label>
                            <Input id="whatsappNumber" value={currentInfo.whatsappNumber} onChange={(e) => handleInfoChange('whatsappNumber', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Map Image</Label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB</p>
                            {previewUrl && <Image src={previewUrl} alt="Map Preview" width={200} height={150} className="rounded object-cover mt-2" />}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imageHint">Map Image Hint</Label>
                            <Input id="imageHint" value={currentInfo.imageHint} onChange={(e) => handleInfoChange('imageHint', e.target.value)} />
                        </div>
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
