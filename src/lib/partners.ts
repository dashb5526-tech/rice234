import { Partner } from '@/lib/types';
import partnersData from '@/lib/data/partners.json';

export type { Partner };

export async function getPartners(): Promise<Partner[]> {
    try {
        const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:9002') : '';
        const response = await fetch(`${baseUrl}/api/partners`);
        if (!response.ok) {
            return partnersData;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching partners, falling back to local data', error);
        return partnersData;
    }
}

async function saveAllPartners(partners: Partner[]): Promise<void> {
    await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partners),
    });
}

export async function savePartner(partner: Partner): Promise<void> {
    const allPartners = await getPartners();
    const index = allPartners.findIndex(p => p.id === partner.id);
    if (index !== -1) {
        allPartners[index] = partner;
    } else {
        allPartners.push(partner);
    }
    await saveAllPartners(allPartners);
}

export async function deletePartner(partnerId: string): Promise<void> {
    const allPartners = await getPartners();
    const updatedPartners = allPartners.filter(p => p.id !== partnerId);
    await saveAllPartners(updatedPartners);
}
