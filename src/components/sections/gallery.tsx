
"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getGalleryContent, GalleryContent } from '@/lib/gallery';

export function Gallery() {
  const [content, setContent] = useState<GalleryContent | null>(null);

  useEffect(() => {
    getGalleryContent().then(setContent);
  }, []);

  if (!content) {
    return (
      <section id="gallery" className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Loading...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {content.description}
          </p>
        </div>

        <div className="mt-12 columns-2 gap-4 sm:columns-3 xl:columns-4">
          {content.galleryImages.map((image, idx) => (
            <div key={image.id} className="mb-4 break-inside-avoid">
              <Image
                src={image.imageUrl}
                alt={image.description}
                width={400}
                height={600}
                className="h-auto w-full rounded-lg object-cover shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                data-ai-hint={image.imageHint}
                loading={idx > 3 ? "lazy" : "eager"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
    
