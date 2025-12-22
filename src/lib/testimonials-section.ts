import type { TestimonialsSection } from '@/lib/types';
import testimonialsSectionData from '@/lib/data/testimonials-section.json';

export type { TestimonialsSection };

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getTestimonialsSection(): Promise<TestimonialsSection> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/testimonials-section`);
        if (!response.ok) {
            return testimonialsSectionData;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching testimonials section content, falling back to local data', error);
        return testimonialsSectionData;
    }
}

export async function saveTestimonialsSection(content: TestimonialsSection): Promise<void> {
    await fetch('/api/testimonials-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
}
