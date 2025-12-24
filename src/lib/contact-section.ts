import contactSectionData from "./data/contact-section.json";

export interface ContactContent {
    title: string;
    description: string;
    address: string;
    phone: string;
    email: string;
}

export const getContactSectionContent = async (): Promise<ContactContent> => {
    return Promise.resolve(contactSectionData as ContactContent);
};

export const getContactSection = async (): Promise<ContactContent> => {
    return Promise.resolve(contactSectionData as ContactContent);
};

export const saveContactSection = async (content: ContactContent): Promise<void> => {
    // In a real application, you would save the content to a database or file.
    // For this example, we'll just log it to the console.
    console.log("Saving contact section content:", content);
    return Promise.resolve();
};