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
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial, Testimonial } from "@/lib/testimonials";
import { getTestimonialsSection, saveTestimonialsSection, TestimonialsSection } from "@/lib/testimonials-section";
import { getHomeContent } from "@/lib/home"; // For brand name
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Star } from "lucide-react";
import { TestimonialEditDialog } from "@/components/admin/testimonial-edit-dialog";
import { TestimonialsSectionEditDialog } from "@/components/admin/testimonials-section-edit-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function TestimonialsTab() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [testimonialsSection, setTestimonialsSection] = useState<TestimonialsSection | null>(null);
    const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [isTestimonialsSectionDialogOpen, setIsTestimonialsSectionDialogOpen] = useState(false);
    const [brandName, setBrandName] = useState<string>("");
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getTestimonials();
            setTestimonials(data);
            const sectionData = await getTestimonialsSection();
            setTestimonialsSection(sectionData);

            // Also fetch home content for brand name used in AI generation
            const homeData = await getHomeContent();
            if (homeData) setBrandName(homeData.brand.name);

        } catch (error) {
            console.error("Failed to fetch testimonials data", error);
            toast({
                title: "Error",
                description: "Failed to load testimonials data.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTestimonialSave = async (testimonialData: Testimonial, selectedFile: File | null) => {
        try {
            let finalAuthorImageUrl = testimonialData.authorImageUrl;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (response.ok) {
                    const result = await response.json();
                    finalAuthorImageUrl = result.imageUrl;
                }
            }

            const newTestimonialData = { ...testimonialData, authorImageUrl: finalAuthorImageUrl };
            if(newTestimonialData.id) {
                await updateTestimonial(newTestimonialData.id, newTestimonialData)
            } else {
                await addTestimonial(newTestimonialData);
            }
            setTestimonials(prev => {
                const index = prev.findIndex(t => t.id === newTestimonialData.id);
                if (index >= 0) {
                    const newTestimonials = [...prev];
                    newTestimonials[index] = newTestimonialData;
                    return newTestimonials;
                } else {
                    return [...prev, newTestimonialData];
                }
            });
            setIsTestimonialDialogOpen(false);
            toast({ title: "Testimonial Saved", description: "The testimonial has been saved." });
        } catch (error) {
            console.error("Failed to save testimonial", error);
            toast({ title: "Save Failed", description: "Could not save testimonial.", variant: "destructive" });
        }
    };

    const handleTestimonialDelete = async (id: string) => {
        try {
            await deleteTestimonial(id);
            setTestimonials(prev => prev.filter(t => t.id !== id));
            toast({ title: "Testimonial Deleted", description: "The testimonial has been removed." });
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not delete testimonial.", variant: "destructive" });
        }
    };

    const handleTestimonialsSectionSave = async (content: TestimonialsSection) => {
        try {
            await saveTestimonialsSection(content);
            setTestimonialsSection(content);
            setIsTestimonialsSectionDialogOpen(false);
            toast({ title: "Section Updated", description: "Testimonials section content saved." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save section content.", variant: "destructive" });
        }
    };


    const openTestimonialDialogForNew = () => {
        setEditingTestimonial(null);
        setIsTestimonialDialogOpen(true);
    };

    const openTestimonialDialogForEdit = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setIsTestimonialDialogOpen(true);
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            Testimonial Management
                        </CardTitle>
                        <CardDescription>
                            Add, edit, or remove testimonials from your home page.
                        </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={() => setIsTestimonialsSectionDialogOpen(true)} className="w-full sm:w-auto" variant="outline" disabled={!testimonialsSection}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Section Text
                        </Button>
                        <Button onClick={openTestimonialDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Testimonial
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Author</TableHead>
                                <TableHead className="hidden sm:table-cell">Quote</TableHead>
                                <TableHead className="hidden sm:table-cell">Rating</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.map((testimonial) => (
                                <TableRow key={testimonial.id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={testimonial.authorImageUrl || undefined} alt={testimonial.name} />
                                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {testimonial.name}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground truncate max-w-sm hidden sm:table-cell">{testimonial.quote}</TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "h-4 w-4",
                                                        i < testimonial.rating
                                                            ? "text-accent fill-accent"
                                                            : "text-muted-foreground/50"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openTestimonialDialogForEdit(testimonial)}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleTestimonialDelete(testimonial.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <TestimonialEditDialog
                isOpen={isTestimonialDialogOpen}
                setIsOpen={setIsTestimonialDialogOpen}
                testimonial={editingTestimonial}
                onSave={handleTestimonialSave}
                brandName={brandName}
            />

            {testimonialsSection && (
                <TestimonialsSectionEditDialog
                    isOpen={isTestimonialsSectionDialogOpen}
                    setIsOpen={setIsTestimonialsSectionDialogOpen}
                    content={testimonialsSection}
                    onSave={handleTestimonialsSectionSave}
                />
            )}
        </div>
    );
}
