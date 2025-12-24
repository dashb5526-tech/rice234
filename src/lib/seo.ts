import seoData from "./data/seo.json";

export interface SeoContent {
    title: string;
    description: string;
    keywords: string;
}

export const getSeoContent = async (): Promise<SeoContent> => {
    return Promise.resolve(seoData as SeoContent);
};