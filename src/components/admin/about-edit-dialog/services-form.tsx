'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type AboutContent } from '../../../lib/about';

interface ServicesFormProps {
  services: AboutContent['services'];
  onServiceChange: (index: number, field: 'title' | 'description', value: string) => void;
}

export function ServicesForm({ services, onServiceChange }: ServicesFormProps) {
  return (
    <div>
      <h3 className="font-semibold text-lg border-b pb-2 pt-6">Services Section</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {services.items.map((service, index) => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="text-base">{`Service ${index + 1}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input
                  value={service.title}
                  onChange={(e) => onServiceChange(index, 'title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => onServiceChange(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
