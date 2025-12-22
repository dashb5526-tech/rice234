import { Certificate } from '@/lib/types';
import certificatesData from '@/lib/data/certificates.json';

export type { Certificate };

export async function getCertificates(): Promise<Certificate[]> {
    try {
        const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:9002') : '';
        const response = await fetch(`${baseUrl}/api/certificates`);
        if (!response.ok) {
            return certificatesData;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching certificates, falling back to local data', error);
        return certificatesData;
    }
}

async function saveAllCertificates(certificates: Certificate[]): Promise<void> {
    await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(certificates),
    });
}

export async function saveCertificate(certificate: Certificate): Promise<void> {
    const allCertificates = await getCertificates();
    const index = allCertificates.findIndex(c => c.id === certificate.id);
    if (index !== -1) {
        allCertificates[index] = certificate;
    } else {
        allCertificates.push(certificate);
    }
    await saveAllCertificates(allCertificates);
}

export async function deleteCertificate(certificateId: string): Promise<void> {
    const allCertificates = await getCertificates();
    const updatedCertificates = allCertificates.filter(c => c.id !== certificateId);
    await saveAllCertificates(updatedCertificates);
}