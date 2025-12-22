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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X, Facebook, Instagram, Linkedin } from "lucide-react";
import { XIcon } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { SocialLink } from "@/lib/social-links";

interface SocialLinkEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    socialLink: SocialLink | null;
    onSave: (linkData: SocialLink) => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
    Facebook: <Facebook className="h-5 w-5" />,
    X: <XIcon className="h-5 w-5" />,
    Instagram: <Instagram className="h-5 w-5" />,
    Linkedin: <Linkedin className="h-5 w-5" />,
};

export function SocialLinkEditDialog({ isOpen, setIsOpen, socialLink, onSave }: SocialLinkEditDialogProps) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [icon, setIcon] = useState("Facebook");
    const [id, setId] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (socialLink) {
                setName(socialLink.name || "");
                setUrl(socialLink.url);
                setIcon(socialLink.icon);
                setId(socialLink.id || "");
            } else {
                setName("");
                setUrl("");
                setIcon("Facebook");
                setId(`social-${Date.now()}`);
            }
        }
    }, [socialLink, isOpen]);

    const handleSubmit = async () => {
        if (!name || !url || !icon) {
            toast({
                title: "Missing Fields",
                description: "Please fill out all fields before saving.",
                variant: "destructive",
            });
            return;
        }

        const linkData: SocialLink = { id, name, url, icon };
        onSave(linkData);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{socialLink ? 'Edit Social Link' : 'Add New Social Link'}</DialogTitle>
                    <DialogDescription>
                        {socialLink ? 'Update the details for this social link.' : 'Fill in the details for the new social link.'}
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
                        <Label htmlFor="social-name" className="text-right">Name</Label>
                        <Input id="social-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="social-icon" className="text-right">Icon</Label>
                        <Select onValueChange={setIcon} defaultValue={icon}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(iconMap).map(iconKey => (
                                    <SelectItem key={iconKey} value={iconKey}>
                                        <div className="flex items-center gap-2">
                                            {iconMap[iconKey]}
                                            {iconKey}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="social-url" className="text-right">URL</Label>
                        <Input id="social-url" value={url} onChange={(e) => setUrl(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
