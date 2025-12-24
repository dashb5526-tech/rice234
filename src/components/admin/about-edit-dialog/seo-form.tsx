'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type AboutContent } from '../../../lib/about';

interface SeoFormProps {
  seo: AboutContent['seo'];
  onSeoChange: (field: keyof AboutContent['seo'], value: string) => void;
}

export function SeoForm({ seo, onSeoChange }: SeoFormProps) {
  return (
    <div className="space-y-4 pt-4 border-t mt-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">About Page SEO</h3>
      </div>
      <div className="grid gap-4">
        <Label htmlFor="about-seoTitle">SEO Title</Label>
        <Input
          id="about-seoTitle"
          value={seo.title}
          onChange={(e) => onSeoChange('title', e.target.value)}
          placeholder="Custom title for search engines"
        />
      </div>
      <div className="grid gap-4">
        <Label htmlFor="about-seoDescription">SEO Description</Label>
        <Textarea
          id="about-seoDescription"
          value={seo.description}
          onChange={(e) => onSeoChange('description', e.target.value)}
          placeholder="Custom description for search engines"
        />
      </div>
      <div className="grid gap-4">
        <Label htmlFor="about-seoKeywords">SEO Keywords</Label>
        <Input
          id="about-seoKeywords"
          value={seo.keywords}
          onChange={(e) => onSeoChange('keywords', e.target.value)}
          placeholder="e.g., about us, rice company"
        />
        <p className="text-xs text-muted-foreground">
          Enter keywords separated by commas.
        </p>
      </div>
    </div>
  );
}
