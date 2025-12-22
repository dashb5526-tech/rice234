import { SocialLink } from '@/lib/types';
import socialLinksData from '@/lib/data/social-links.json';

export type { SocialLink };

export async function getSocialLinks(): Promise<SocialLink[]> {
    try {
        const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:9002') : '';
        const response = await fetch(`${baseUrl}/api/social-links`);
        if (!response.ok) {
            return socialLinksData;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching social links, falling back to local data', error);
        return socialLinksData;
    }
}

async function saveAllSocialLinks(links: SocialLink[]): Promise<void> {
    await fetch('/api/social-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links),
    });
}


export async function saveSocialLink(link: SocialLink): Promise<void> {
    const allLinks = await getSocialLinks();
    const index = allLinks.findIndex(l => l.id === link.id);
    if (index !== -1) {
        allLinks[index] = link;
    } else {
        allLinks.push(link);
    }
    await saveAllSocialLinks(allLinks);
}

export async function deleteSocialLink(linkId: string): Promise<void> {
    const allLinks = await getSocialLinks();
    const updatedLinks = allLinks.filter(l => l.id !== linkId);
    await saveAllSocialLinks(updatedLinks);
}
