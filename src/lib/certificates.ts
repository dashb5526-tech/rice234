import certificatesData from "./data/certificates.json";
import type { Certificate } from "./types";

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export async function getCertificates(): Promise<Certificate[]> {
    const baseUrl = getBaseUrl();
    try {
        const response = await fetch(`${baseUrl}/api/certificates`);
        if (!response.ok) {
            return certificatesData as Certificate[];
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch certificates", error);
        return certificatesData as Certificate[];
    }
}

export async function saveAllCertificates(certificates: Certificate[]): Promise<void> {
    const baseUrl = getBaseUrl();
    try {
        await fetch(`${baseUrl}/api/certificates`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(certificates),
        });
    } catch (error) {
        console.error("Failed to save certificates", error);
        throw error;
    }
}
