
"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProducts, Product } from "@/lib/products";
import { getProductsSection, ProductsSection } from "@/lib/products-section";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { NativeShareButton } from "@/components/ui/native-share-button";
import { cn } from "@/lib/utils";


function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.imageUrl;
  const productUrl = `/products/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}`;
  const [isExpanded, setIsExpanded] = useState(false);

  // Ensure we get the full URL for sharing
  const [fullProductUrl, setFullProductUrl] = useState('');
  useEffect(() => {
    setFullProductUrl(window.location.origin + productUrl);
  }, [productUrl]);

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <Link href={productUrl}>
        {imageSrc && (
            <div className="relative h-56 w-full">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <CardHeader className="p-0 relative">
           <div className="flex justify-between items-start">
              <CardTitle className="font-headline text-xl flex-1 pr-10">
                <Link href={productUrl} className="hover:text-primary transition-colors">
                    {product.name}
                </Link>
              </CardTitle>
              <NativeShareButton
                url={fullProductUrl}
                title={product.name}
                description={product.description}
                className="absolute top-0 right-0 h-8 w-8 text-muted-foreground hover:text-primary"
              />
            </div>
          <CardDescription className="pt-2">
             <span className={cn(!isExpanded && "line-clamp-4")}>
                {product.description}
              </span>
              {product.description.length > 150 && (
                  <button onClick={() => setIsExpanded(!isExpanded)} className="text-destructive text-sm font-medium hover:underline focus:outline-none">
                      {isExpanded ? 'Read less' : 'Read more'}
                  </button>
              )}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-4 flex-1 flex flex-col gap-4">
           {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-base mb-2">Specifications:</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
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
                  <h3 className="font-semibold text-base mb-2">Available Varieties:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.varieties.map((variety) => (
                      <Badge key={variety} variant="secondary">{variety}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.certifications && product.certifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-base mb-2">Certifications:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert) => (
                      <Badge key={cert} className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1"/>
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
        </CardContent>
        <div className="!mt-auto pt-4">
          <Button asChild className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              <Link href="/contact">Request a Quote</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function Products({ isHomePage = false }: { isHomePage?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sectionContent, setSectionContent] = useState<ProductsSection | null>(null);

  useEffect(() => {
    getProducts().then(setProducts);
    getProductsSection().then(setSectionContent);
  }, []);

  const displayedProducts = isHomePage ? products.slice(0, 3) : products;

  return (
    <section id="products" className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sectionContent?.title || "Our Premium Rice Selection"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {sectionContent?.description || "We offer a diverse range of high-quality rice to meet the needs of every customer, from households to large-scale businesses."}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {isHomePage && products.length > 3 && (
          <div className="mt-16 text-center">
            <Button asChild size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              <Link href="/products">See All Products</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
    