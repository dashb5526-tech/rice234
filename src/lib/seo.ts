import seoData from "./data/seo.json";

export interface SeoContent {
    title: string;
    description: string;
    keywords: string;
}

export const getSeoContent = async (): Promise<SeoContent> => {
    return Promise.resolve(seoData as SeoContent);
};

export const saveSeoContent = async (content: SeoContent): Promise<void> => {
    // In a real application, you would save the content to a database or file.
    // For this example, we'll just log it to the console.
    console.log("Saving SEO content:", content);
    return Promise.resolve();
};