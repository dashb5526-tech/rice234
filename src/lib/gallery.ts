import galleryData from "./data/gallery.json";

export interface GalleryImage {
    id: string;
    description: string;
    imageUrl: string;
    imageHint: string;
}

export interface GalleryContent {
    title: string;
    description: string;
    galleryImages: GalleryImage[];
}

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export const getGalleryContent = async (): Promise<GalleryContent> => {
    const baseUrl = getBaseUrl();
    try {
        const response = await fetch(`${baseUrl}/api/gallery`);
        if (!response.ok) {
            return galleryData as GalleryContent;
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch gallery content", error);
        return galleryData as GalleryContent;
    }
};

export const saveGalleryContent = async (content: GalleryContent): Promise<void> => {
    try {
        await fetch("/api/gallery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        });
    } catch (error) {
        console.error("Failed to save gallery content", error);
        throw error;
    }
};