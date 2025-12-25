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
import { getGalleryContent, saveGalleryContent, GalleryContent, GalleryImage } from "@/lib/gallery";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { GalleryImageEditDialog } from "@/components/admin/gallery-image-edit-dialog";
import { GallerySectionEditDialog } from "@/components/admin/gallery-section-edit-dialog";

export function GalleryTab() {
    const [galleryContent, setGalleryContent] = useState<GalleryContent | null>(null);
    const [isGalleryImageDialogOpen, setIsGalleryImageDialogOpen] = useState(false);
    const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
    const [isGallerySectionDialogOpen, setIsGallerySectionDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getGalleryContent();
            setGalleryContent(data);
        } catch (error) {
            console.error("Failed to fetch gallery data", error);
            toast({
                title: "Error",
                description: "Failed to load gallery data.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGalleryImageSave = async (imageData: Omit<GalleryImage, 'imageUrl'>, selectedFile: File | null) => {
        if (!galleryContent) return;

        try {
            let finalImageUrl = "";
            if (!selectedFile && imageData.id) {
                const existing = galleryContent.galleryImages.find(img => img.id === imageData.id);
                if (existing) finalImageUrl = existing.imageUrl;
            }

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (response.ok) {
                    const result = await response.json();
                    finalImageUrl = result.imageUrl;
                }
            }

            const newImage: GalleryImage = { ...imageData, imageUrl: finalImageUrl };
            let newImages = [...galleryContent.galleryImages];
            const index = newImages.findIndex(img => img.id === imageData.id);
            if (index >= 0) {
                newImages[index] = newImage;
            } else {
                newImages.push(newImage);
            }

            const newContent = { ...galleryContent, galleryImages: newImages };
            await saveGalleryContent(newContent);
            setGalleryContent(newContent);
            setIsGalleryImageDialogOpen(false);
            toast({ title: "Image Saved", description: "Gallery image has been saved." });
        } catch (error) {
            console.error("Failed to save gallery image", error);
            toast({ title: "Save Failed", description: "Could not save the image.", variant: "destructive" });
        }
    };

    const handleGalleryImageDelete = async (id: string) => {
        if (!galleryContent) return;
        try {
            const newImages = galleryContent.galleryImages.filter(img => img.id !== id);
            const newContent = { ...galleryContent, galleryImages: newImages };
            await saveGalleryContent(newContent);
            setGalleryContent(newContent);
            toast({ title: "Image Deleted", description: "Gallery image has been removed." });
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not delete the image.", variant: "destructive" });
        }
    };

    const handleGallerySectionSave = async (content: Pick<GalleryContent, 'title' | 'description'>) => {
        if (!galleryContent) return;

        try {
            const newContent = { ...galleryContent, ...content };
            await saveGalleryContent(newContent);
            setGalleryContent(newContent);
            setIsGallerySectionDialogOpen(false);
            toast({ title: "Section Updated", description: "Gallery section content saved." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save section content.", variant: "destructive" });
        }
    };

    const openGalleryImageDialogForNew = () => {
        setEditingGalleryImage(null);
        setIsGalleryImageDialogOpen(true);
    };

    const openGalleryImageDialogForEdit = (image: GalleryImage) => {
        setEditingGalleryImage(image);
        setIsGalleryImageDialogOpen(true);
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            Gallery Management
                        </CardTitle>
                        <CardDescription>
                            Add, edit, or remove images from your gallery.
                        </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={() => setIsGallerySectionDialogOpen(true)} className="w-full sm:w-auto" variant="outline" disabled={!galleryContent}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Section Text
                        </Button>
                        <Button onClick={openGalleryImageDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Image
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {galleryContent ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {galleryContent.galleryImages.map((image) => (
                                <div key={image.id} className="relative group">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        width={200}
                                        height={200}
                                        className="rounded-lg object-cover aspect-square"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                        <Button variant="ghost" size="icon" onClick={() => openGalleryImageDialogForEdit(image)}>
                                            <Edit className="h-5 w-5 text-white" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleGalleryImageDelete(image.id)}>
                                            <Trash2 className="h-5 w-5 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Loading gallery content...</p>
                    )}
                </CardContent>
            </Card>

            <GalleryImageEditDialog
                isOpen={isGalleryImageDialogOpen}
                setIsOpen={setIsGalleryImageDialogOpen}
                image={editingGalleryImage}
                onSave={handleGalleryImageSave}
            />

            {galleryContent && (
                <GallerySectionEditDialog
                    isOpen={isGallerySectionDialogOpen}
                    setIsOpen={setIsGallerySectionDialogOpen}
                    content={galleryContent}
                    onSave={handleGallerySectionSave}
                />
            )}
        </div>
    );
}
