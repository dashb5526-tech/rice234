import type { TermsContent } from '@/lib/types';
import termsData from '@/lib/data/terms.json';

export type { TermsContent };

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getTermsContent(): Promise<TermsContent> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/terms`);
        if (!response.ok) {
            console.error("API fetch failed, falling back to local import.");
            return termsData as TermsContent;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching terms content from API, falling back to local import:', error);
        return termsData as TermsContent;
    }
}

export async function saveTermsContent(content: TermsContent): Promise<void> {
    await fetch('/api/terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
}
