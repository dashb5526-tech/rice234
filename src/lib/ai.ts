import { type AboutContent } from './about';
import { type Brand, type HeroContent } from './home';
import { type ContactContent } from './contact-section';
import { type Feature } from './certificates-section';
import { type GalleryContent } from './gallery';
import { type Product } from './products';
import { type SeoContent } from './seo';
import { type Testimonial } from './testimonials';

const callGenerateApi = async (prompt: string): Promise<any> => {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate content');
    }

    return response.json();
};

// A generic content generator for simple title/description pairs
export async function generateContent(prompt: string): Promise<{ title: string; description: string }> {
    const specificPrompt = `
        Based on the following request, generate a JSON object with "title" and "description" fields.
        Request: "${prompt}"
        The output must be a valid JSON object.
        Example: {"title": "A good title", "description": "A compelling description."}
    `;
    const result = await callGenerateApi(specificPrompt);
    return result;
}

// Generate About Section
export async function generateAboutContent(prompt: string): Promise<AboutContent['main']> {
     const specificPrompt = `
        Generate content for an "About Us" section main content based on the prompt: "${prompt}".
        The output must be a valid JSON object with the following structure:
        {
          "title": "string",
          "paragraph1": "string",
          "paragraph2": "string",
          "imageHint": "string (suggest a relevant Unsplash image ID or a descriptive placeholder like 'team-photo')"
        }
    `;
    const result = await callGenerateApi(specificPrompt);
    return result;
}


// Generate Brand info
export async function generateBrand(prompt: string): Promise<Brand> {
     const specificPrompt = `
        Generate content for a brand based on the prompt: "${prompt}".
        The output must be a valid JSON object with the following structure:
        {
            "name": "string",
            "logo": "string (suggest a very short, catchy logo text, 2-3 words max)"
        }
    `;
    const result = await callGenerateApi(specificPrompt);
    return result;
}

// Generate Contact Section
export async function generateContactSection(prompt: string): Promise<ContactContent> {
     const specificPrompt = `
        Generate content for a "Contact Us" section based on the prompt: "${prompt}".
        The output must be a valid JSON object with the following structure:
        {
            "title": "string",
            "description": "string",
            "address": "string",
            "phone": "string",
            "email": "string"
        }
    `;
    const result = await callGenerateApi(specificPrompt);
    return result;
}

// Generate Feature
export async function generateFeature(prompt: string): Promise<Omit<Feature, 'id'>> {
    const specificPrompt = `
        Generate content for a single feature based on the prompt: "${prompt}".
        The output must be a valid JSON object with the following structure:
        {
          "name": "string",
          "description": "string",
          "icon": "string (suggest a relevant icon name from lucide-react library)"
        }
    `;
    const result = await callGenerateApi(specificPrompt);
    return result;
}

// Generate Gallery Section
export async function generateGalleryContent(prompt: string): Promise<Pick<GalleryContent, 'title' | 'description'>> {
    return generateContent(prompt);
}

// Generate Hero Section
export async function generateHeroContent(prompt: string): Promise<HeroContent> {
     const specificPrompt = `
        Generate content for a "Hero" section based on the prompt: "${prompt}".
        The output must be a valid JSON object with the following structure:
        {
          "headline": "string",
          "subheadline": "string",
          "cta": "string (short call to action, e.g., 'Learn More')",
          "imageHint": "string (suggest a relevant Unsplash image ID or a descriptive placeholder like 'hero-rice-field')"
        }
    `;
    const result = await callGenerateApi(specificPrompt);
    return result;
}

// Generate Product Content
export async function generateProductContent(prompt: string): Promise<Pick<Product, 'name' | 'description' | 'seoTitle' | 'seoDescription' | 'seoKeywords'>> {
    const specificPrompt = `
        Generate content for a product based on the prompt: "${prompt}".
        The output must be a valid JSON object with the following structure:
        {
            "name": "string",
            "description": "string",
            "seoTitle": "string",
            "seoDescription": "string",
            "seoKeywords": "string (comma-separated)"
        }
    `;
    const result = await callGenerateApi(specificPrompt);
    if (Array.isArray(result.seoKeywords)) {
        result.seoKeywords = result.seoKeywords.join(', ');
    }
    return result;
}

// Generate Product Details
export async function generateProductDetails(productName: string): Promise<Omit<Product, 'id' | 'imageUrl'>> {
    const specificPrompt = `
        Generate detailed information for a product named "${productName}".
        The product is a type of rice.
        The output must be a valid JSON object with the following structure:
        {
            "name": "${productName}",
            "description": "string (1-2 sentences)",
            "imageId": "string (a slug-style ID, e.g., 'basmati-rice')",
            "specifications": [
                {"key": "Origin", "value": "string"},
                {"key": "Grain Length", "value": "string"},
                {"key": "Aroma", "value": "string"},
                {"key": "Texture", "value": "string"}
            ],
            "varieties": ["string", "string"],
            "certifications": ["string", "string"],
            "seoTitle": "string",
            "seoDescription": "string",
            "seoKeywords": "string (comma-separated)"
        }
    `;
    const result = await callGenerateApi(specificPrompt);
    // Gemini might return a string for keywords, so let's ensure it's a string.
    if (Array.isArray(result.seoKeywords)) {
        result.seoKeywords = result.seoKeywords.join(', ');
    }
    return result;
}

// Generate SEO Content
export async function generateSeoContent(prompt: string): Promise<SeoContent> {
    const specificPrompt = `
        Generate SEO metadata based on the following site summary: "${prompt}".
        The output must be a valid JSON object with the following structure:
        {
          "title": "string (max 60 chars)",
          "description": "string (max 160 chars)",
          "keywords": "string (comma-separated list of 5-10 relevant keywords)"
        }
    `;
    const result = await callGenerateApi(specificPrompt);
    if (Array.isArray(result.keywords)) {
        result.keywords = result.keywords.join(', ');
    }
    return result;

}

// Generate Testimonial
export async function generateTestimonial(prompt: string): Promise<Pick<Testimonial, 'name' | 'title' | 'quote' | 'rating'>> {
    const specificPrompt = `
        Generate a testimonial based on the prompt: "${prompt}".
        The output must be a valid JSON object with the following structure:
        {
            "name": "string",
            "title": "string",
            "quote": "string (1-3 sentences)",
            "rating": "number (integer between 1 and 5)"
        }
    `;
    const result = await callGenerateApi(specificPrompt);
    return result;
}
