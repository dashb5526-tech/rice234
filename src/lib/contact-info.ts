import type { ContactInfo } from '@/lib/types';
import contactInfoData from '@/lib/data/contact-info.json';

export type { ContactInfo };

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getContactInfo(): Promise<ContactInfo> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/contact-info`);
        if (!response.ok) {
            console.error("API fetch failed, falling back to local import.");
            return contactInfoData as ContactInfo;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching contact info from API, falling back to local import:', error);
        return contactInfoData as ContactInfo;
    }
}

export async function saveContactInfo(info: ContactInfo): Promise<void> {
    await fetch('/api/contact-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
    });
}
