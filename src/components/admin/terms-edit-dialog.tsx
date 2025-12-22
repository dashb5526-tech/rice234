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
import { Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TermsContent } from "@/lib/terms";
import { generateContent } from "@/lib/ai-dummy";
import { AiPromptDialog } from "./ai-prompt-dialog";

interface TermsEditDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    content: TermsContent;
    onSave: (content: TermsContent) => void;
}

export function TermsEditDialog({ isOpen, setIsOpen, content, onSave }: TermsEditDialogProps) {
    const [currentContent, setCurrentContent] = useState<TermsContent>(content);
    const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (isOpen) {
            setCurrentContent(content);
        }
    }, [isOpen, content]);

    const handleContentChange = (field: keyof TermsContent, value: string) => {
        setCurrentContent(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave(currentContent);
    };

    const handleAiGenerate = async (promptText: string) => {
        setIsGenerating(true);
        setIsAiPromptOpen(false);
        try {
            const result = await generateContent({ topic: "Terms and conditions page", prompt: `Generate a title and full terms and conditions content based on: ${promptText}` });
            if (result) {
                setCurrentContent({ title: result.title, content: result.description });
                toast({ title: "AI Content Generated" });
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
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Terms & Conditions</DialogTitle>
                        <DialogDescription>
                            Make changes to your Terms and Conditions page.
                        </DialogDescription>
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </DialogClose>
                    </DialogHeader>
                    <ScrollArea className="h-[70vh] pr-6">
                        <div className="space-y-6 py-4">
                            <div className="flex justify-end">
                                <Button variant="outline" size="sm" onClick={() => setIsAiPromptOpen(true)}>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    AI Generate
                                </Button>
                            </div>
                            <div className="grid gap-4">
                                <Label>Title</Label>
                                <Input value={currentContent.title} onChange={e => handleContentChange('title', e.target.value)} />
                            </div>
                            <div className="grid gap-4">
                                <Label>Content</Label>
                                <Textarea value={currentContent.content} onChange={e => handleContentChange('content', e.target.value)} rows={15} />
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
