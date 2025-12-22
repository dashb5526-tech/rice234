export interface AboutContent {
    main: {
        title: string;
        description?: string;
        paragraph1: string;
        paragraph2: string;
        imageUrl: string;
        imageHint: string;
    };
    services: {
        title: string;
        items: Service[];
    };
    seo: SeoContent;
}

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface CertificatesSection {
    title: string;
    description: string;
}

export interface Certificate {
    id: string;
    name: string;
    issuer: string;
    date: string;
    imageUrl: string;
    description?: string;
}

export interface ContactInfo {
    email: string;
    phone: string;
    address: string;
    coordinates?: { lat: number; lng: number };
    imageUrl?: string;
    imageHint?: string;
    whatsappNumber?: string;
}

export interface ContactSection {
    title: string;
    description: string;
}

export interface GalleryContent {
    title: string;
    description: string;
    galleryImages: GalleryImage[];
}

export interface GalleryImage {
    id: string;
    description: string;
    imageHint: string;
    imageUrl: string;
}

export interface HomeContent {
    brand: {
        name: string;
        logoUrl: string;
        footerDescription: string;
    };
    hero: {
        headline: string;
        subheadline: string;
        imageUrl: string;
        imageHint: string;
    };
    seo: SeoContent;
}

export interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    website?: string;
}

export interface ProductsSection {
    title: string;
    description: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    imageId: string;
    imageUrl: string;
    specifications: { key: string; value: string }[];
    varieties: string[];
    certifications: string[];
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
}

export interface SeoContent {
    title: string;
    description: string;
    keywords: string;
    ogImage?: string;
}

export interface SocialLink {
    id?: string;
    name?: string;
    platform?: string;
    url: string;
    icon: string;
}

export interface TermsContent {
    title: string;
    content: string;
}

export interface TestimonialsSection {
    title: string;
    description: string;
}

export interface Testimonial {
    id: string;
    name: string;
    title: string;
    quote: string;
    rating: number;
    authorImageUrl: string;
}
