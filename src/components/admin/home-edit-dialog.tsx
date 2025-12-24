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
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, X } from 'lucide-react';
import { HomeContent } from '@/lib/home';
import { AiPromptDialog } from './ai-prompt-dialog';
import { generateHeroContent, generateBrand } from '@/lib/ai';

interface HomeEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  content: HomeContent;
  onSave: (
    content: HomeContent,
    files: { heroImage?: File | null; brandLogo?: File | null }
  ) => void;
}

export function HomeEditDialog({
  isOpen,
  setIsOpen,
  content,
  onSave,
}: HomeEditDialogProps) {
  const [currentContent, setCurrentContent] = useState<HomeContent>(content);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(
    content.hero.imageUrl
  );
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(
    content.brand.logoUrl
  );
  const { toast } = useToast();
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTarget, setAiTarget] = useState<'hero' | 'brand'>('hero');

  useEffect(() => {
    if (isOpen) {
      setCurrentContent(content);
      setHeroPreviewUrl(content.hero.imageUrl);
      setLogoPreviewUrl(content.brand.logoUrl);
      setHeroImageFile(null);
      setBrandLogoFile(null);
    }
  }, [isOpen, content]);

  const handleContentChange = (
    section: 'brand' | 'hero' | 'seo',
    field: string,
    value: string
  ) => {
    setCurrentContent((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as any), [field]: value },
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'hero' | 'logo'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const isLogo = type === 'logo';
      const maxSize = isLogo ? 2 * 1024 * 1024 : 10 * 1024 * 1024; // 2MB for logo, 10MB for hero
      if (file.size > maxSize) {
        toast({
          title: 'File Too Large',
          description: `Please select an image smaller than ${
            isLogo ? '2MB' : '10MB'
          }.`,
          variant: 'destructive',
        });
        return;
      }
      if (isLogo) {
        setBrandLogoFile(file);
        setLogoPreviewUrl(URL.createObjectURL(file));
      } else {
        setHeroImageFile(file);
        setHeroPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleAiGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setIsAiPromptOpen(false);
    try {
      if (aiTarget === 'hero') {
        const result = await generateHeroContent(prompt);
        setCurrentContent((prev) => ({
          ...prev,
          hero: { ...prev.hero, ...result },
        }));
      } else if (aiTarget === 'brand') {
        const result = await generateBrand(prompt);
        setCurrentContent((prev) => ({
          ...prev,
          brand: { ...prev.brand, ...result },
        }));
      }
      toast({ title: 'AI Content Generated' });
    } catch (error) {
      toast({ title: 'AI Generation Failed', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const openAiPrompt = (target: 'hero' | 'brand') => {
    setAiTarget(target);
    setIsAiPromptOpen(true);
  };

  const handleSubmit = () => {
    onSave(currentContent, { heroImage: heroImageFile, brandLogo: brandLogoFile });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Home Page Content</DialogTitle>
            <DialogDescription>
              Make changes to your homepage content and brand identity.
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
          <ScrollArea className="h-[75vh] pr-6">
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-semibold text-lg">Brand Identity</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAiPrompt('brand')}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Generate
                </Button>
              </div>
              <div className="grid gap-4">
                <Label>Brand Name</Label>
                <Input
                  value={currentContent.brand.name}
                  onChange={(e) =>
                    handleContentChange('brand', 'name', e.target.value)
                  }
                />
              </div>
              <div className="grid gap-4">
                <Label>Footer Description</Label>
                <Textarea
                  value={currentContent.brand.footerDescription}
                  onChange={(e) =>
                    handleContentChange(
                      'brand',
                      'footerDescription',
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="grid gap-4">
                <Label>Brand Logo</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'logo')}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 2MB
                </p>
                {logoPreviewUrl && (
                  <Image
                    src={logoPreviewUrl}
                    alt="Logo Preview"
                    width={100}
                    height={40}
                    className="object-contain rounded mt-2"
                  />
                )}
              </div>

              <div className="flex justify-between items-center border-b pb-2 pt-6">
                <h3 className="font-semibold text-lg">Hero Section</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAiPrompt('hero')}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Generate
                </Button>
              </div>
              <div className="grid gap-4">
                <Label>Headline</Label>
                <Input
                  value={currentContent.hero.headline}
                  onChange={(e) =>
                    handleContentChange('hero', 'headline', e.target.value)
                  }
                />
              </div>
              <div className="grid gap-4">
                <Label>Sub-headline</Label>
                <Textarea
                  value={currentContent.hero.subheadline}
                  onChange={(e) =>
                    handleContentChange('hero', 'subheadline', e.target.value)
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-4">
                <Label>Background Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'hero')}
                  className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max file size: 10MB
                </p>
                {heroPreviewUrl && (
                  <Image
                    src={heroPreviewUrl}
                    alt="Hero Preview"
                    width={200}
                    height={112}
                    className="rounded object-cover mt-2"
                  />
                )}
              </div>
              <div className="grid gap-4">
                <Label>Image Hint</Label>
                <Input
                  value={currentContent.hero.imageHint}
                  onChange={(e) =>
                    handleContentChange('hero', 'imageHint', e.target.value)
                  }
                />
              </div>

              <div className="space-y-4 pt-4 border-t mt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Home Page SEO</h3>
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="home-seoTitle">SEO Title</Label>
                  <Input
                    id="home-seoTitle"
                    value={currentContent.seo.title}
                    onChange={(e) =>
                      handleContentChange('seo', 'title', e.target.value)
                    }
                    placeholder="Custom title for search engines"
                  />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="home-seoDescription">SEO Description</Label>
                  <Textarea
                    id="home-seoDescription"
                    value={currentContent.seo.description}
                    onChange={(e) =>
                      handleContentChange('seo', 'description', e.target.value)
                    }
                    placeholder="Custom description for search engines"
                  />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="home-seoKeywords">SEO Keywords</Label>
                  <Input
                    id="home-seoKeywords"
                    value={currentContent.seo.keywords}
                    onChange={(e) =>
                      handleContentChange('seo', 'keywords', e.target.value)
                    }
                    placeholder="e.g., rice, basmati, export"
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
