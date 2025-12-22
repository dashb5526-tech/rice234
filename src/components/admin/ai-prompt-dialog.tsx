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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AiPromptDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onGenerate: (prompt: string) => void;
    isGenerating: boolean;
}

export function AiPromptDialog({ isOpen, setIsOpen, onGenerate, isGenerating }: AiPromptDialogProps) {
    const [prompt, setPrompt] = useState("");
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Generate Content with AI</DialogTitle>
                    <DialogDescription>
                        Enter some keywords or a short phrase to guide the AI. For example: "high-quality rice" or "what our customers say".
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Label htmlFor="ai-prompt">Prompt</Label>
                    <Input id="ai-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={() => onGenerate(prompt)} disabled={isGenerating || !prompt}>
                        {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
