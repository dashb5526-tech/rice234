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
}

export const getProducts = async (): Promise<Product[]> => {
    return Promise.resolve(productsData as Product[]);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const product = (productsData as Product[]).find((p) => p.id === id);
    return Promise.resolve(product);
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