
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getHomeContent, HomeContent } from '@/lib/home';
import { useEffect, useState } from 'react';

export function Hero() {
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    getHomeContent().then(setContent);
  }, []);

  if (!content) {
    return (
        <section id="home" className="relative h-screen min-h-[600px] w-full bg-secondary">
            <div className="flex h-full items-center justify-center">Loading...</div>
        </section>
    );
  }

  const { hero } = content;

  return (
    <section id="home" className="relative h-screen min-h-[600px] w-full">
      {hero.imageUrl && (
        <Image
          src={hero.imageUrl}
          alt={hero.imageHint || "Hero background"}
          fill
          className="object-cover"
          priority
          data-ai-hint={hero.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
      <div className="relative z-10 flex h-full items-center justify-center text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {hero.headline}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-200 sm:text-xl">
              {hero.subheadline}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/products">View Our Products</Link>
              </Button>
              <Button asChild size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
    
