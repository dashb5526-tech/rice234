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
import { getAboutContent, saveAboutContent, AboutContent } from "@/lib/about";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { AboutEditDialog } from "@/components/admin/about-edit-dialog";

export function AboutTab() {
    const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
    const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getAboutContent();
            setAboutContent(data);
        } catch (error) {
            console.error("Failed to fetch about content", error);
            toast({
                title: "Error",
                description: "Failed to load about content.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAboutSave = async (content: AboutContent, selectedFile: File | null) => {
        try {
            let finalImageUrl = content.main.imageUrl;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (response.ok) {
                    const result = await response.json();
                    finalImageUrl = result.imageUrl;
                }
            }

            const newContent = {
                ...content,
                main: {
                    ...content.main,
                    imageUrl: finalImageUrl,
                }
            };

            await saveAboutContent(newContent);
            setAboutContent(newContent);
            setIsAboutDialogOpen(false);
            toast({ title: "About Content Saved", description: "About page content has been updated." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save about content.", variant: "destructive" });
        }
    };

    return (
        <div className="pt-6">
            <Card className="mt-4"> {/* Added mt-4 for top margin */}>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            About Page Management
                        </CardTitle>
                        <CardDescription>
                            Edit the content of your "About Us" page.
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsAboutDialogOpen(true)} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={!aboutContent}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Content
                    </Button>
                </CardHeader>
                <CardContent>
                    {aboutContent ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">Main Content</h4>
                                <p className="text-sm text-muted-foreground">{aboutContent.main.title}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Services</h4>
                                <p className="text-sm text-muted-foreground">{aboutContent.services.items.length} services listed.</p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading about page content...</p>
                    )}
                </CardContent>
            </Card>

            {aboutContent && (
                <AboutEditDialog
                    isOpen={isAboutDialogOpen}
                    setIsOpen={setIsAboutDialogOpen}
                    content={aboutContent}
                    onSave={handleAboutSave}
                />
            )}
        </div>
    );
}
