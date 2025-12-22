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
import { X, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Testimonial } from "@/lib/testimonials";
import { generateContent } from "@/lib/ai-dummy";
import { AiPromptDialog } from "@/components/admin/ai-prompt-dialog";

interface TestimonialEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    testimonial: Testimonial | null;
    onSave: (testimonialData: Testimonial, selectedFile: File | null) => void;
    brandName?: string | null;
}

export function TestimonialEditDialog({ isOpen, setIsOpen, testimonial, onSave, brandName }: TestimonialEditDialogProps) {
    const [name, setName] = useState("");
    const [title, setTitle] = useState("");
    const [quote, setQuote] = useState("");
    const [rating, setRating] = useState(5);
    const [id, setId] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { toast } = useToast();
    const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (testimonial) {
                setName(testimonial.name);
                setTitle(testimonial.title);
                setQuote(testimonial.quote);
                setRating(testimonial.rating);
                setId(testimonial.id);
                setPreviewUrl(testimonial.authorImageUrl);
            } else {
                setName("");
                setTitle("");
                setQuote("");
                setRating(5);
                setId(`testimonial-${Date.now()}`);
                setPreviewUrl(null);
            }
            setSelectedFile(null);
        }
    }, [testimonial, isOpen]);

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
        if (!name || !title || !quote) {
            toast({
                title: "Missing Fields",
                description: "Please fill out all fields before saving.",
                variant: "destructive",
            });
            return;
        }

        const testimonialData: Testimonial = { id, name, title, quote, rating, authorImageUrl: testimonial?.authorImageUrl || "" };
        onSave(testimonialData, selectedFile);
    }

    const handleAiGenerate = async (prompt: string) => {
        setIsGenerating(true);
        setIsAiPromptOpen(false);
        try {
            const topic = `A testimonial quote for a rice trading company named "${brandName || 'the company'}"`;
            const result = await generateContent({
                topic: topic,
                prompt: `Generate a quote from ${name}, the ${title}. Keywords: ${prompt}`
            });
            if (result) {
                setQuote(result.description);
                toast({ title: "AI Quote Generated!" });
            }
        } catch (error) {
            toast({ title: "AI Generation Failed", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
                        <DialogDescription>
                            {testimonial ? 'Update the details for this testimonial.' : 'Fill in the details for the new testimonial.'}
                        </DialogDescription>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DialogClose>
                    </DialogHeader>
                    <ScrollArea className="h-[70vh] pr-6">
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="testimonial-name" className="text-right">Author Name</Label>
                                <Input id="testimonial-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="testimonial-title" className="text-right">Author Title</Label>
                                <Input id="testimonial-title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="testimonial-rating" className="text-right">Rating</Label>
                                <div className="col-span-3 flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn(
                                                "h-6 w-6 cursor-pointer",
                                                i < rating ? "text-accent fill-accent" : "text-muted-foreground/50"
                                            )}
                                            onClick={() => setRating(i + 1)}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Author Image</Label>
                                <div className="col-span-3">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                                    <p className="text-xs text-muted-foreground mt-2">Max file size: 2MB</p>
                                    {previewUrl && (
                                        <div className="mt-2">
                                            <Image src={previewUrl} alt="Preview" width={80} height={80} className="object-cover rounded-full" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 items-start gap-4">
                                <div className="flex justify-between items-center col-span-4">
                                    <Label htmlFor="testimonial-quote">Quote</Label>
                                    <Button variant="outline" size="sm" onClick={() => setIsAiPromptOpen(true)}>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        AI Generate
                                    </Button>
                                </div>
                                <Textarea id="testimonial-quote" value={quote} onChange={(e) => setQuote(e.target.value)} className="col-span-4" rows={5} />
                            </div>
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button type="button" onClick={handleSubmit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AiPromptDialog isOpen={isAiPromptOpen} setIsOpen={setIsAiPromptOpen} onGenerate={handleAiGenerate} isGenerating={isGenerating} />
        </>
    );
}
