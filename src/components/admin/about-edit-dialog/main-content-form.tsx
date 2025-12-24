'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import { type AboutContent } from '../../../lib/about';

interface MainContentFormProps {
  content: AboutContent['main'];
  onContentChange: (
    field: 'title' | 'paragraph1' | 'paragraph2' | 'imageHint',
    value: string
  ) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  onAiGenerate: () => void;
}

export function MainContentForm({ 
    content, 
    onContentChange, 
    onFileChange, 
    previewUrl, 
    onAiGenerate 
}: MainContentFormProps) {
  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-semibold text-lg">Main Section</h3>
        <Button variant="outline" size="sm" onClick={onAiGenerate}>
          <Sparkles className="mr-2 h-4 w-4" />
          AI Generate
        </Button>
      </div>
      <div className="grid gap-4">
        <Label>Title</Label>
        <Input
          value={content.title}
          onChange={(e) => onContentChange('title', e.target.value)}
        />
      </div>
      <div className="grid gap-4">
        <Label>Paragraph 1</Label>
        <Textarea
          value={content.paragraph1}
          onChange={(e) => onContentChange('paragraph1', e.target.value)}
          rows={4}
        />
      </div>
      <div className="grid gap-4">
        <Label>Paragraph 2</Label>
        <Textarea
          value={content.paragraph2}
          onChange={(e) => onContentChange('paragraph2', e.target.value)}
          rows={4}
        />
      </div>
      <div className="grid gap-4">
        <Label>Image</Label>
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
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
          value={content.imageHint}
          onChange={(e) => onContentChange('imageHint', e.target.value)}
        />
      </div>
    </div>
  );
}
