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
import { getTermsContent, saveTermsContent, TermsContent } from "@/lib/terms";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import { TermsEditDialog } from "@/components/admin/terms-edit-dialog";

export function LegalTab() {
    const [termsContent, setTermsContent] = useState<TermsContent | null>(null);
    const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const data = await getTermsContent();
            setTermsContent(data);
        } catch (error) {
            console.error("Failed to fetch terms data", error);
            toast({
                title: "Error",
                description: "Failed to load legal content.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTermsSave = async (content: TermsContent) => {
        try {
            await saveTermsContent(content);
            setTermsContent(content);
            setIsTermsDialogOpen(false);
            toast({ title: "Terms Saved", description: "Terms and conditions updated." });
            window.dispatchEvent(new CustomEvent('content-updated'));
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save terms.", variant: "destructive" });
        }
    };

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            Legal Content
                        </CardTitle>
                        <CardDescription>
                            Edit the content of your legal pages like Terms and Conditions.
                        </CardDescription>
                    </div>
                    <Button onClick={() => setIsTermsDialogOpen(true)} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={!termsContent}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Terms & Conditions
                    </Button>
                </CardHeader>
                <CardContent>
                    {termsContent ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">Terms & Conditions</h4>
                                <p className="text-sm text-muted-foreground truncate">{termsContent.content}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading legal content...</p>
                    )}
                </CardContent>
            </Card>

            {termsContent && (
                <TermsEditDialog
                    isOpen={isTermsDialogOpen}
                    setIsOpen={setIsTermsDialogOpen}
                    content={termsContent}
                    onSave={handleTermsSave}
                />
            )}
        </div>
    );
}
