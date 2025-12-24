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
   return Promise.resolve(galleryData as GalleryContent);
};

export const saveGalleryContent = async (content: GalleryContent): Promise<void> => {
    // In a real application, you would save the content to a database or file.
    // For this example, we'll just log it to the console.
    console.log("Saving gallery content:", content);
    return Promise.resolve();
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
    // In a real application, you would delete the image from a database or file.
    // For this example, we'll just log it to the console.
    console.log("Deleting gallery image with id:", id);
    return Promise.resolve();
};