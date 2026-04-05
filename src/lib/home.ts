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
    return homeData as HomeContent;
};

export const saveHomeContent = async (content: HomeContent): Promise<void> => {
    try {
        await fetch("/api/home", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        });
    } catch (error) {
        console.error("Failed to save home content", error);
        throw error;
    }
};
