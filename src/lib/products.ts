
import productsData from "./data/products.json";

export interface ProductSpec {
    key: string;
    value: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    specifications: ProductSpec[];
    varieties: string[];
    certifications: string[];
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    path: string;
    slug: string;
}

const generateSlug = (name: string) => name.replace(/ /g, '-').toLowerCase();

export const getProducts = async (): Promise<Product[]> => {
    // Add path to each product
    const productsWithPaths = (productsData as Product[]).map(product => {
        const slug = generateSlug(product.name);
        return {
            ...product,
            slug: slug,
            path: `/products/${encodeURIComponent(slug)}`,
        }
    });
    return Promise.resolve(productsWithPaths);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const product = (productsData as Product[]).find((p) => p.id === id);
    if (!product) return undefined;
    const slug = generateSlug(product.name);
    // Add path to the product
    return Promise.resolve({
        ...product,
        slug: slug,
        path: `/products/${encodeURIComponent(slug)}`,
    });
};

export const saveAllProducts = async (products: Product[]): Promise<void> => {
    try {
        await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(products),
        });
    } catch (error) {
        console.error("Failed to save products", error);
        throw error;
    }
};
