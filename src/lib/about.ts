import type { AboutContent, Service } from '@/lib/types';
import aboutData from '@/lib/data/about.json';

export type { AboutContent, Service };


function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getAboutContent(): Promise<AboutContent> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/about`);
        if (!response.ok) {
            console.error("API fetch failed, falling back to local import.");
            return aboutData as AboutContent;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching about content from API, falling back to local import:', error);
        return aboutData as AboutContent;
    }
}

export async function saveAboutContent(content: AboutContent): Promise<void> {
    await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
}
