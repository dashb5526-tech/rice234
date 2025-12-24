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
import { GalleryContent } from '@/lib/gallery';
import { AiPromptDialog } from './ai-prompt-dialog';
import { generateContent } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';

interface GallerySectionEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  content: Pick<GalleryContent, 'title' | 'description'>;
  onSave: (content: Pick<GalleryContent, 'title' | 'description'>) => void;
}

export function GallerySectionEditDialog({
  isOpen,
  setIsOpen,
  content,
  onSave,
}: GallerySectionEditDialogProps) {
  const [currentContent, setCurrentContent] = useState(content);
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCurrentContent(content);
    }
  }, [isOpen, content]);

  const handleContentChange = (field: 'title' | 'description', value: string) => {
    setCurrentContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAiGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setIsAiPromptOpen(false);
    try {
      const result = await generateContent(prompt);
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Gallery Section</DialogTitle>
            <DialogDescription>
              Update the title and description for the gallery section.
            </DialogDescription>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <Label htmlFor="gallery-title">Title</Label>
              <Input
                id="gallery-title"
                value={currentContent.title}
                onChange={(e) => handleContentChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gallery-description">Description</Label>
              <Textarea
                id="gallery-description"
                value={currentContent.description}
                onChange={(e) =>
                  handleContentChange('description', e.target.value)
                }
              />
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
