import type { CertificatesSection } from '@/lib/types';
import certificatesSectionData from '@/lib/data/certificates-section.json';

export type { CertificatesSection };

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getCertificatesSection(): Promise<CertificatesSection> {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/certificates-section`);
        if (!response.ok) {
            return certificatesSectionData;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching certificates section content, falling back to local data', error);
        return certificatesSectionData;
    }
}

export async function saveCertificatesSection(content: CertificatesSection): Promise<void> {
    await fetch('/api/certificates-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
}
