import aboutData from "./data/about.json";

export interface ServiceItem {
    id: string;
    title: string;
    description: string;
}

export interface AboutContent {
    main: {
        title: string;
        paragraph1: string;
        paragraph2: string;
        imageUrl: string;
        imageHint: string;
    };
    services: {
        title: string;
        items: ServiceItem[];
    };
    seo: {
        title: string;
        description: string;
        keywords: string;
    };
}

export const getAboutContent = async (): Promise<AboutContent> => {
    return Promise.resolve(aboutData as AboutContent);
};

export const saveAboutContent = async (content: AboutContent): Promise<void> => {
    try {
        await fetch("/api/about", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        });
    } catch (error) {
        console.error("Failed to save about content", error);
        throw error;
    }
};