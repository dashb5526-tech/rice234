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
import { PlusCircle, Trash2, X, Sparkles } from 'lucide-react';
import { Product } from '@/lib/products';
import { AiPromptDialog } from './ai-prompt-dialog';
import { generateProductDetails } from '@/lib/ai';

interface ProductEditDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  product: Product | null;
  onSave: (
    productData: Omit<Product, 'id'>,
    id: string,
    selectedFile: File | null
  ) => void;
}

export function ProductEditDialog({
  isOpen,
  setIsOpen,
  product,
  onSave,
}: ProductEditDialogProps) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageId, setImageId] = useState('');
  const [specifications, setSpecifications] = useState<
    { key: string; value: string }[]
  >([]);
  const [varietiesInput, setVarietiesInput] = useState('');
  const [certificationsInput, setCertificationsInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const { toast } = useToast();
  const [isAiPromptOpen, setIsAiPromptOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setId(product.id);
        setName(product.name);
        setDescription(product.description);
        setImageId(product.imageId);
        setSpecifications(product.specifications || []);
        setVarietiesInput(product.varieties?.join(', ') || '');
        setCertificationsInput(product.certifications?.join(', ') || '');
        setPreviewUrl(product.imageUrl);
        setSeoTitle(product.seoTitle || '');
        setSeoDescription(product.seoDescription || '');
        setSeoKeywords(product.seoKeywords || '');
      } else {
        setId(`prod-${Date.now()}`);
        setName('');
        setDescription('');
        setImageId('');
        setSpecifications([{ key: '', value: '' }]);
        setVarietiesInput('');
        setCertificationsInput('');
        setPreviewUrl(null);
        setSeoTitle('');
        setSeoDescription('');
        setSeoKeywords('');
      }
      setSelectedFile(null);
    }
  }, [product, isOpen]);

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

  const handleSpecificationChange = (
    index: number,
    field: 'key' | 'value',
    value: string
  ) => {
    const newSpecs = [...specifications];
    if (!newSpecs[index]) {
      newSpecs[index] = { key: '', value: '' };
    }
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpecification = () =>
    setSpecifications([...specifications, { key: '', value: '' }]);
  const removeSpecification = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
  };

  const handleAiGenerate = async (prompt: string) => {
    setIsGenerating(true);
    setIsAiPromptOpen(false);
    try {
      const result = await generateProductDetails(prompt);
      if (result) {
        setName(result.name || prompt);
        setDescription(result.description || '');
        setImageId(result.imageId || '');
        setSpecifications(result.specifications || []);
        setVarietiesInput(result.varieties?.join(', ') || '');
        setCertificationsInput(result.certifications?.join(', ') || '');
        setSeoTitle(result.seoTitle || '');
        setSeoDescription(result.seoDescription || '');
        setSeoKeywords(result.seoKeywords || '');
        toast({ title: 'AI Content Generated' });
      }
    } catch (error: any) {
      toast({
        title: 'AI Generation Failed',
        description: error.message || 'An unknown error occurred.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !imageId) {
      toast({
        title: 'Missing Fields',
        description:
          'Please fill out Name, Description, and Image ID before saving.',
        variant: 'destructive',
      });
      return;
    }

    const productData = {
      name,
      description,
      imageId,
      imageUrl: product?.imageUrl || previewUrl || '',
      specifications,
      varieties: varietiesInput.split(',').map((tag) => tag.trim()).filter(tag => tag),
      certifications: certificationsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(tag => tag),
      seoTitle,
      seoDescription,
      seoKeywords,
    };

    onSave(productData, id, selectedFile);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {product ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {
                product
                  ? 'Update the details for this product.'
                  : 'Fill in the details for the new product.'
              }
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
          <ScrollArea className="h-[70vh] pr-6">
            <div className="space-y-6 py-4">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAiPromptOpen(true)}
                  disabled={isGenerating}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </Button>
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="imageId">Image ID</Label>
                <Input
                  id="imageId"
                  value={imageId}
                  onChange={(e) => setImageId(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., basmati-grain"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label>Image</Label>
                <div className="col-span-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Max file size: 10MB
                  </p>
                  {previewUrl && (
                    <div className="mt-2">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Specifications</Label>
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Key"
                      value={spec.key}
                      onChange={(e) =>
                        handleSpecificationChange(index, 'key', e.target.value)
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecificationChange(index, 'value', e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpecification(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addSpecification}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Spec
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="varieties">Available Varieties</Label>
                <Input
                  id="varieties"
                  value={varietiesInput}
                  onChange={(e) => setVarietiesInput(e.target.value)}
                  placeholder="e.g., 1121 Basmati, Pusa Basmati"
                />
                <p className="text-xs text-muted-foreground">
                  Enter tags separated by commas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Input
                  id="certifications"
                  value={certificationsInput}
                  onChange={(e) => setCertificationsInput(e.target.value)}
                  placeholder="e.g., Organic, Export Grade"
                />
                <p className="text-xs text-muted-foreground">
                  Enter tags separated by commas.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Product SEO</h3>
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="col-span-3"
                    placeholder="Custom title for search engines"
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="col-span-3"
                    placeholder="Custom description for search engines"
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="seoKeywords">SEO Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., product, rice, basmati"
                  />
                  <p className="col-span-4 text-xs text-muted-foreground">
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
