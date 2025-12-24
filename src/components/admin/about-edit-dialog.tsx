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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '../../hooks/use-toast';
import { X } from 'lucide-react';
import { type AboutContent } from '../../lib/about';
import { generateAboutContent } from '../../lib/ai';
import { AiPromptDialog } from './ai-prompt-dialog';
import { MainContentForm } from './about-edit-dialog/main-content-form';
import { ServicesForm } from './about-edit-dialog/services-form';
import { SeoForm } from './about-edit-dialog/seo-form';

interface AboutEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  content: AboutContent;
  onSave: (content: AboutContent, selectedFile: File | null) => void;
}

export function AboutEditDialog({ isOpen, setIsOpen, content, onSave }: AboutEditDialogProps) {
  const [currentContent, setCurrentContent] = useState<AboutContent>(content);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    content.main.imageUrl
  );
  const { toast } = useToast();
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentContent(content);
      setPreviewUrl(content.main.imageUrl);
      setSelectedFile(null);
    }
  }, [isOpen, content]);

  const handleMainContentChange = (
    field: keyof Omit<AboutContent['main'], 'imageUrl'>,
    value: string
  ) => {
    setCurrentContent((prev) => ({
      ...prev,
      main: { ...prev.main, [field]: value },
    }));
  };

  const handleSeoChange = (
    field: 'title' | 'description' | 'keywords',
    value: string
  ) => {
    setCurrentContent((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  const handleServiceChange = (
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    const newItems = [...currentContent.services.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setCurrentContent((prev) => ({
      ...prev,
      services: { ...prev.services, items: newItems },
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 10MB.',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

 const handleAiGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setIsAiPromptOpen(false);
    try {
        const parsedResult = await generateAboutContent(prompt);
        if (!parsedResult) {
            throw new Error("AI returned no result.");
        }

        setCurrentContent((prev) => ({
            ...prev,
            main: {
                ...prev.main,
                title: parsedResult.title || prev.main.title,
                paragraph1: parsedResult.paragraph1 || prev.main.paragraph1,
                paragraph2: parsedResult.paragraph2 || prev.main.paragraph2,
                imageHint: parsedResult.imageHint || prev.main.imageHint,
            },
        }));
        toast({ title: 'AI Content Generated' });

    } catch (error: any) {
        toast({
            title: 'AI Generation Failed',
            description: error.message || 'An unknown error occurred.',
            variant: 'destructive',
        });
    } finally {
        setIsGenerating(false);
    }
  };


  const handleSubmit = () => {
    onSave(currentContent, selectedFile);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit About Page Content</DialogTitle>
            <DialogDescription>
              Make changes to the content of your About Us page.
            </DialogDescription>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </DialogHeader>
          <ScrollArea className="h-[75vh] pr-6">
            <MainContentForm
              content={currentContent.main}
              onContentChange={handleMainContentChange}
              onFileChange={handleFileChange}
              previewUrl={previewUrl}
              onAiGenerate={() => setIsAiPromptOpen(true)}
            />
            <ServicesForm
              services={currentContent.services}
              onServiceChange={handleServiceChange}
            />
            <SeoForm
              seo={currentContent.seo}
              onSeoChange={handleSeoChange}
            />
          </ScrollArea>
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
