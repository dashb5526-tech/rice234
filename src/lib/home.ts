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

function getBaseUrl() {
    if (typeof window !== 'undefined') return '';
    if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    return 'http://localhost:9002';
}

export const getHomeContent = async (): Promise<HomeContent> => {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/home`);
        if (!response.ok) {
            return homeData as HomeContent;
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch home content", error);
        return homeData as HomeContent;
    }
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