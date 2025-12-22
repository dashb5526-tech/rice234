import type { ProductsSection } from '@/lib/types';
import productsSectionData from '@/lib/data/products-section.json';

export type { ProductsSection };

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getProductsSection(): Promise<ProductsSection> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/products-section`);
        if (!response.ok) {
            return productsSectionData;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching products section content, falling back to local data', error);
        return productsSectionData;
    }
}

export async function saveProductsSection(content: ProductsSection): Promise<void> {
    await fetch('/api/products-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
}
