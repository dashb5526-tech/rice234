import type { ContactSection } from '@/lib/types';
import contactSectionData from '@/lib/data/contact-section.json';

export type { ContactSection };

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getContactSection(): Promise<ContactSection> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/contact-section`);
        if (!response.ok) {
            return contactSectionData;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching contact section content, falling back to local data', error);
        return contactSectionData;
    }
}

export async function saveContactSection(content: ContactSection): Promise<void> {
    await fetch('/api/contact-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
}
