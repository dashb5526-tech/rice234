
"use client";

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getHomeContent } from '@/lib/home';
import { Separator } from '@/components/ui/separator';
import { NativeShareButton } from '@/components/ui/native-share-button';
import { useEffect, useState } from 'react';
import { HomeContent } from '@/lib/home';

export function ProductDetailPageClient({ product }: { product: Product }) {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    async function fetchHomeData() {
      const homeData = await getHomeContent();
      setHomeContent(homeData);
    }
    fetchHomeData();
  }, []);

  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const imageUrl = product.imageUrl ? product.imageUrl : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: imageUrl,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: homeContent?.brand.name || 'Bhawani Shankar Rice Trader',
    },
    sku: product.imageId,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 bg-secondary py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <div>
              {product.imageUrl && (
                <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="space-y-6">
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
              
              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h2 className="font-semibold text-xl mb-3">Specifications:</h2>
                  <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    {product.specifications.map((spec, i) => (
                      <li key={i}>
                        <span className="font-medium text-foreground">{spec.key}:</span> {spec.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.varieties && product.varieties.length > 0 && (
                <div>
                  <h2 className="font-semibold text-xl mb-3">Available Varieties:</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.varieties.map((variety) => (
                      <Badge key={variety} variant="secondary" className="text-base">{variety}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.certifications && product.certifications.length > 0 && (
                <div>
                  <h2 className="font-semibold text-xl mb-3">Certifications:</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert) => (
                      <Badge key={cert} className="bg-green-100 text-green-800 border-green-200 text-base hover:bg-green-200">
                        <CheckCircle2 className="h-4 w-4 mr-1.5"/>
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-6">
                <Button asChild size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} className="w-full sm:w-auto">
                    <Link href="/contact">Request a Quote</Link>
                </Button>
                 <Separator className="my-6" />
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground">Share this product:</span>
                  <NativeShareButton url={productUrl} title={product.name} description={product.description} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
