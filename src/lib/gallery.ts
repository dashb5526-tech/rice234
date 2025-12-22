import { GalleryContent, GalleryImage } from '@/lib/types';
import galleryData from '@/lib/data/gallery.json';

export type { GalleryContent, GalleryImage };

export async function getGalleryContent(): Promise<GalleryContent> {
    try {
        const baseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:9002') : '';
        const response = await fetch(`${baseUrl}/api/gallery`);
        if (!response.ok) {
            return galleryData;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching gallery content, falling back to local data', error);
        return galleryData;
    }
}

export async function saveGalleryContent(content: GalleryContent): Promise<void> {
    await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
    });
}

export async function deleteGalleryImage(imageId: string): Promise<void> {
    const content = await getGalleryContent();
    const updatedContent = {
        ...content,
        galleryImages: content.galleryImages.filter(img => img.id !== imageId),
    };
    await saveGalleryContent(updatedContent);
}
