import homeData from "./data/home.json";

export interface HeroContent {
    headline: string;
    subheadline: string;
    cta?: string;
    imageUrl: string;
    imageHint: string;
}

export interface Brand {
    name: string;
    logoUrl: string;
    footerDescription: string;
}

export interface Seo {
    title: string;
    description: string;
    keywords: string;
}

export interface HomeContent {
    brand: Brand;
    hero: HeroContent;
    seo: Seo;
}

export const getHomeContent = async (): Promise<HomeContent> => {
    return Promise.resolve(homeData as HomeContent);
};

export const saveHomeContent = async (content: HomeContent): Promise<void> => {
    // In a real application, you would save the content to a database or file.
    // For this example, we'll just log it to the console.
    console.log("Saving home content:", content);
    return Promise.resolve();
};