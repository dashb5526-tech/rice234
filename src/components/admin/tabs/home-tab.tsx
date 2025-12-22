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
import { getHomeContent, saveHomeContent, HomeContent } from "@/lib/home";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { HomeEditDialog } from "@/components/admin/home-edit-dialog";

export function HomeTab() {
    const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
    const [isHomeDialogOpen, setIsHomeDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getHomeContent();
            setHomeContent(data);
        } catch (error) {
            console.error("Failed to fetch home content", error);
            toast({
                title: "Error",
                description: "Failed to load home content.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleHomeSave = async (content: HomeContent, files: { heroImage?: File | null, brandLogo?: File | null }) => {
        try {
            let finalHeroImageUrl = content.hero.imageUrl;
            let finalBrandLogoUrl = content.brand.logoUrl;

            if (files.heroImage) {
                const formData = new FormData();
                formData.append('file', files.heroImage);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (response.ok) {
                    const result = await response.json();
                    finalHeroImageUrl = result.imageUrl;
                }
            }

            if (files.brandLogo) {
                const formData = new FormData();
                formData.append('file', files.brandLogo);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (response.ok) {
                    const result = await response.json();
                    finalBrandLogoUrl = result.imageUrl;
                }
            }

            const newContent = {
                ...content,
                hero: {
                    ...content.hero,
                    imageUrl: finalHeroImageUrl,
                },
                brand: {
                    ...content.brand,
                    logoUrl: finalBrandLogoUrl,
                }
            };

            await saveHomeContent(newContent);
            setHomeContent(newContent);
            setIsHomeDialogOpen(false);
            toast({ title: "Home Content Saved", description: "Home page content has been updated." });
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save home content.", variant: "destructive" });
        }
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            Home Page Management
                        </CardTitle>
                        <CardDescription>
                            Edit the content of your home page.
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsHomeDialogOpen(true)} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={!homeContent}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Content
                    </Button>
                </CardHeader>
                <CardContent>
                    {homeContent ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">Brand Name</h4>
                                <p className="text-sm text-muted-foreground">{homeContent.brand.name}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">Hero Headline</h4>
                                <p className="text-sm text-muted-foreground">{homeContent.hero.headline}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading home page content...</p>
                    )}
                </CardContent>
            </Card>

            {homeContent && (
                <HomeEditDialog
                    isOpen={isHomeDialogOpen}
                    setIsOpen={setIsHomeDialogOpen}
                    content={homeContent}
                    onSave={handleHomeSave}
                />
            )}
        </div>
    );
}
