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
    // In a real application, you would save the content to a database or file.
    // For this example, we'll just log it to the console.
    console.log("Saving about content:", content);
    return Promise.resolve();
};