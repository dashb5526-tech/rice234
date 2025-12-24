"use client";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, X } from "lucide-react";

interface AiPromptDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onGenerate: (promptText: string) => Promise<void>;
    isGenerating: boolean;
}

export function AiPromptDialog({ isOpen, setIsOpen, onGenerate, isGenerating }: AiPromptDialogProps) {
    const [prompt, setPrompt] = useState("");

    const handleGenerate = async () => {
        if (prompt.trim()) {
            await onGenerate(prompt);
            // Do not close on generate, let the parent component decide
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-accent" />
                        Generate with AI
                    </DialogTitle>
                    <DialogDescription>
                        Describe what you want to generate. Be specific for the best results.
                    </DialogDescription>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogClose>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        placeholder="e.g., A professional and welcoming section about our high-quality rice products."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}>
                        {isGenerating ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                        ) : (
                            'Generate'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
