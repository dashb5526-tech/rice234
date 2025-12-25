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
import { getSeoContent, saveSeoContent, SeoContent } from "@/lib/seo";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { SeoEditDialog } from "@/components/admin/seo-edit-dialog";

export function SeoTab() {
    const [seoContent, setSeoContent] = useState<SeoContent | null>(null);
    const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getSeoContent();
            setSeoContent(data);
        } catch (error) {
            console.error("Failed to fetch SEO data", error);
            toast({
                title: "Error",
                description: "Failed to load SEO content.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSeoSave = async (content: SeoContent) => {
        try {
            await saveSeoContent(content);
            setSeoContent(content);
            setIsSeoDialogOpen(false);
            toast({ title: "SEO Saved", description: "SEO settings updated." });
            window.dispatchEvent(new CustomEvent('content-updated'));
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save SEO content.", variant: "destructive" });
        }
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            SEO Management
                        </CardTitle>
                        <CardDescription>
                            Manage your site-wide SEO settings.
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsSeoDialogOpen(true)} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={!seoContent}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit SEO
                    </Button>
                </CardHeader>
                <CardContent>
                    {seoContent ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">Site Title</h4>
                                <p className="text-sm text-muted-foreground">{seoContent.title}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Meta Description</h4>
                                <p className="text-sm text-muted-foreground">{seoContent.description}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Meta Keywords</h4>
                                <p className="text-sm text-muted-foreground">{seoContent.keywords}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading SEO content...</p>
                    )}
                </CardContent>
            </Card>

            {seoContent && (
                <SeoEditDialog
                    isOpen={isSeoDialogOpen}
                    setIsOpen={setIsSeoDialogOpen}
                    content={seoContent}
                    onSave={handleSeoSave}
                />
            )}
        </div>
    );
}
