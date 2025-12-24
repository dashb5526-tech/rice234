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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '../../hooks/use-toast';
import { Sparkles, X } from 'lucide-react';
import { type AboutContent } from '../../lib/about';
import { generateAboutContent } from '../../lib/ai';
import { AiPromptDialog } from './ai-prompt-dialog';

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
    field: 'title' | 'paragraph1' | 'paragraph2' | 'imageHint',
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
        const result = await generateAboutContent(prompt);
        if (result && result.text) {
            // The result from the API is a JSON object with a 'text' property
            // which is a stringified JSON. We need to parse it twice.
            let parsedResult;
            try {
                // First parse the 'text' property of the result
                parsedResult = JSON.parse(result.text);
            } catch (e) {
                // If parsing fails, it may not be a JSON string, so we use the text directly.
                // This part needs to be adjusted based on the actual API response format.
                // For now, let's assume it should have been a valid JSON.
                throw new Error("AI returned improperly formatted content.");
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
        } else {
          throw new Error("No content was generated.")
        }
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
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-semibold text-lg">Main Section</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAiPromptOpen(true)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Generate
                </Button>
              </div>
              <div className="grid gap-4">
                <Label>Title</Label>
                <Input
                  value={currentContent.main.title}
                  onChange={(e) =>
                    handleMainContentChange('title', e.target.value)
                  }
                />
              </div>
              <div className="grid gap-4">
                <Label>Paragraph 1</Label>
                <Textarea
                  value={currentContent.main.paragraph1}
                  onChange={(e) =>
                    handleMainContentChange('paragraph1', e.target.value)
                  }
                  rows={4}
                />
              </div>
              <div className="grid gap-4">
                <Label>Paragraph 2</Label>
                <Textarea
                  value={currentContent.main.paragraph2}
                  onChange={(e) =>
                    handleMainContentChange('paragraph2', e.target.value)
                  }
                  rows={4}
                />
              </div>
              <div className="grid gap-4">
                <Label>Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={133}
                    className="rounded object-cover mt-2"
                  />
                )}
              </div>
              <div className="grid gap-4">
                <Label>Image Hint</Label>
                <Input
                  value={currentContent.main.imageHint}
                  onChange={(e) =>
                    handleMainContentChange('imageHint', e.target.value)
                  }
                />
              </div>

              <h3 className="font-semibold text-lg border-b pb-2 pt-6">
                Services Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentContent.services.items.map((service, index) => (
                  <Card key={service.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{`Service ${
                        index + 1
                      }`}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2">
                        <Label>Title</Label>
                        <Input
                          value={service.title}
                          onChange={(e) =>
                            handleServiceChange(index, 'title', e.target.value)
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea
                          value={service.description}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              'description',
                              e.target.value
                            )
                          }
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">About Page SEO</h3>
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="about-seoTitle">SEO Title</Label>
                  <Input
                    id="about-seoTitle"
                    value={currentContent.seo.title}
                    onChange={(e) => handleSeoChange('title', e.target.value)}
                    placeholder="Custom title for search engines"
                  />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="about-seoDescription">SEO Description</Label>
                  <Textarea
                    id="about-seoDescription"
                    value={currentContent.seo.description}
                    onChange={(e) =>
                      handleSeoChange('description', e.target.value)
                    }
                    placeholder="Custom description for search engines"
                  />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="about-seoKeywords">SEO Keywords</Label>
                  <Input
                    id="about-seoKeywords"
                    value={currentContent.seo.keywords}
                    onChange={(e) => handleSeoChange('keywords', e.target.value)}
                    placeholder="e.g., about us, rice company"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter keywords separated by commas.
                  </p>
                </div>
              </div>
            </div>
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
