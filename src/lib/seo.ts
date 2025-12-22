import type { SeoContent } from '@/lib/types';
import seoData from '@/lib/data/seo.json';

export type { SeoContent };

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getSeoContent(): Promise<SeoContent> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/seo`);
        if (!response.ok) {
            return seoData;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching SEO content, falling back to local data', error);
        return seoData;
    }
}

export async function saveSeoContent(content: SeoContent): Promise<void> {
    await fetch('/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
}
