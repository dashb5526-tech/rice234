
import { getProducts, Product } from '@/lib/products';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductDetailPageClient } from '@/components/product-detail-page';

export async function generateMetadata({ params }: { params: { productName: string } }): Promise<Metadata> {
  const allProducts = await getProducts();
  const decodedSlug = decodeURIComponent(params.productName).replace(/-/g, ' ');
  const product = allProducts.find(p => p.name.toLowerCase() === decodedSlug.toLowerCase());

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description,
    keywords: product.seoKeywords || product.name,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { productName: string } }) {
  const allProducts = await getProducts();
  const decodedSlug = decodeURIComponent(params.productName).replace(/-/g, ' ');
  const product = allProducts.find(p => p.name.toLowerCase() === decodedSlug.toLowerCase());

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <ProductDetailPageClient product={product} />
      <Footer />
    </div>
  );
}

