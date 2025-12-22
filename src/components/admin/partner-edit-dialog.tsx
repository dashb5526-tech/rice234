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
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Partner } from "@/lib/partners";

interface PartnerEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    partner: Partner | null;
    onSave: (partnerData: Partner, selectedFile: File | null) => void;
}

export function PartnerEditDialog({ isOpen, setIsOpen, partner, onSave }: PartnerEditDialogProps) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (partner) {
                setId(partner.id);
                setName(partner.name);
                setPreviewUrl(partner.logoUrl);
            } else {
                setId(`partner-${Date.now()}`);
                setName("");
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [partner, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                toast({
                    title: "File Too Large",
                    description: "Please select an image smaller than 2MB.",
                    variant: "destructive",
                });
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async () => {
        if (!name) {
            toast({
                title: "Missing Name",
                description: "Please enter the partner's name.",
                variant: "destructive",
            });
            return;
        }

        if (!previewUrl && !selectedFile) {
            toast({
                title: "Missing Image",
                description: "Please select a logo image.",
                variant: "destructive",
            });
            return;
        }

        const partnerData: Partner = { id, name, logoUrl: partner?.logoUrl || "" };
        onSave(partnerData, selectedFile);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{partner ? 'Edit Partner' : 'Add New Partner'}</DialogTitle>
                    <DialogDescription>
                        {partner ? 'Update the details for this partner.' : 'Fill in the details for the new partner.'}
                    </DialogDescription>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogClose>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="partner-name" className="text-right">Partner Name</Label>
                        <Input id="partner-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Partner Logo</Label>
                        <div className="col-span-3">
                            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            <p className="text-xs text-muted-foreground mt-2">Max file size: 2MB</p>
                            {previewUrl && (
                                <div className="mt-2">
                                    <Image src={previewUrl} alt="Preview" width={100} height={40} className="object-contain rounded" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
