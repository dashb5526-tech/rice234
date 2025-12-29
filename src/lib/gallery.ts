
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

export const getGalleryContent = async (): Promise<GalleryContent> => {
    // Simulate fetching data from a database or CMS
    return Promise.resolve(galleryData as GalleryContent);
};

export const saveGalleryContent = async (content: GalleryContent): Promise<void> => {
    // In a real application, you would save this to a database or file.
    // Here, we'll just log it to the console and simulate a successful save.
    console.log("Saving gallery content:", content);
    try {
        // Example of how you might save to an API endpoint:
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
