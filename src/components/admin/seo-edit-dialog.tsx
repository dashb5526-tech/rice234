'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, X } from 'lucide-react';
import { SeoContent } from '@/lib/seo';
import { AiPromptDialog } from './ai-prompt-dialog';
import { generateSeoContent } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';

interface SeoEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  content: SeoContent;
  onSave: (content: SeoContent) => void;
}

export function SeoEditDialog({
  isOpen,
  setIsOpen,
  content,
  onSave,
}: SeoEditDialogProps) {
  const [currentContent, setCurrentContent] = useState<SeoContent>(content);
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCurrentContent(content);
    }
  }, [isOpen, content]);

  const handleContentChange = (field: keyof SeoContent, value: string) => {
    setCurrentContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleAiGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setIsAiPromptOpen(false);
    try {
      const result = await generateSeoContent(prompt);
      if (result) {
        setCurrentContent(result);
        toast({ title: 'AI Content Generated' });
      }
    } catch (error) {
      toast({ title: 'AI Generation Failed', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    onSave(currentContent);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit SEO Settings</DialogTitle>
            <DialogDescription>
              Manage your site-wide title, description, and keywords.
            </DialogDescription>
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAiPromptOpen(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate with AI
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-title">Site Title</Label>
              <Input
                id="seo-title"
                value={currentContent.title}
                onChange={(e) => handleContentChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-description">Meta Description</Label>
              <Textarea
                id="seo-description"
                value={currentContent.description}
                onChange={(e) =>
                  handleContentChange('description', e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seo-keywords">Meta Keywords</Label>
              <Input
                id="seo-keywords"
                value={currentContent.keywords}
                onChange={(e) => handleContentChange('keywords', e.target.value)}
                placeholder="e.g., rice, basmati, export"
              />
              <p className="text-xs text-muted-foreground">
                Enter keywords separated by commas.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AiPromptDialog
        isOpen={isAiPromptOpen}
        setIsOpen={setIsAiPromptOpen}
        onGenerate={handleAiGenerate}
        isGenerating={isGenerating}
      />
    </>
  );
}
