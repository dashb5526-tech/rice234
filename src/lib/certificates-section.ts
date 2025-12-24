import certificatesSectionData from "./data/certificates-section.json";

export interface Feature {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface CertificatesSectionContent {
    title: string;
    description: string;
    features: Feature[];
}

export const getCertificatesSectionContent = async (): Promise<CertificatesSectionContent> => {
    return Promise.resolve(certificatesSectionData as CertificatesSectionContent);
};

export const getCertificatesSection = async (): Promise<CertificatesSectionContent> => {
    return Promise.resolve(certificatesSectionData as CertificatesSectionContent);
};

export const saveCertificatesSection = async (content: CertificatesSectionContent): Promise<void> => {
    // In a real application, you would save the content to a database or file.
    // For this example, we'll just log it to the console.
    console.log("Saving certificates section content:", content);
    return Promise.resolve();
};