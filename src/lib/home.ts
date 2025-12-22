import type { HomeContent } from '@/lib/types';
import homeData from '@/lib/data/home.json';

export type { HomeContent };

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getHomeContent(): Promise<HomeContent> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/home`);
        if (!response.ok) {
            console.error("API fetch failed, falling back to local import.");
            return homeData as HomeContent;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching home content from API, falling back to local import:', error);
        return homeData as HomeContent;
    }
}

export async function saveHomeContent(content: HomeContent): Promise<void> {
    await fetch('/api/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
}
