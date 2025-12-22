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
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { GalleryImage } from "@/lib/gallery";

interface GalleryImageEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    image: GalleryImage | null;
    onSave: (imageData: Omit<GalleryImage, 'imageUrl'>, selectedFile: File | null) => void;
}

export function GalleryImageEditDialog({ isOpen, setIsOpen, image, onSave }: GalleryImageEditDialogProps) {
    const [id, setId] = useState("");
    const [description, setDescription] = useState("");
    const [imageHint, setImageHint] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            if (image) {
                setId(image.id);
                setDescription(image.description);
                setImageHint(image.imageHint);
                setPreviewUrl(image.imageUrl);
            } else {
                // Generate a new unique ID for a new image
                setId(`gallery-${Date.now()}`);
                setDescription("");
                setImageHint("");
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [image, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB
                toast({
                    title: "File Too Large",
                    description: "Please select an image smaller than 10MB.",
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
        if (!id || !description) {
            toast({
                title: "Missing Fields",
                description: "Please fill out ID and Description before saving.",
                variant: "destructive",
            });
            return;
        }

        if (!previewUrl && !selectedFile) {
            toast({
                title: "Missing Image",
                description: "Please select an image before saving.",
                variant: "destructive",
            });
            return;
        }

        const imageData = { id, description, imageHint };
        onSave(imageData, selectedFile);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{image ? 'Edit Gallery Image' : 'Add New Gallery Image'}</DialogTitle>
                    <DialogDescription>
                        {image ? 'Update the details for this image.' : 'Fill in the details for the new image.'}
                    </DialogDescription>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogClose>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-6">
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gallery-id" className="text-right">ID</Label>
                            <Input id="gallery-id" value={id} onChange={(e) => setId(e.target.value)} className="col-span-3" disabled={!!image} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gallery-description" className="text-right">Description</Label>
                            <Textarea id="gallery-description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gallery-hint" className="text-right">Image Hint</Label>
                            <Input id="gallery-hint" value={imageHint} onChange={(e) => setImageHint(e.target.value)} className="col-span-3" placeholder="e.g., rice paddy" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Image</Label>
                            <div className="col-span-3">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                <p className="text-xs text-muted-foreground mt-2">Max file size: 10MB</p>
                                {previewUrl && (
                                    <div className="mt-2">
                                        <Image src={previewUrl} alt="Preview" width={100} height={100} className="object-cover rounded" />
                                    </div>
                                )}
                            </div>
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
