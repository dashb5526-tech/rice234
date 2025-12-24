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

export const saveProduct = async (product: Product): Promise<void> => {
    // In a real application, you would save the product to a database or file.
    // For this example, we'll just log it to the console.
    console.log("Saving product:", product);
    return Promise.resolve();
};

export const deleteProduct = async (id: string): Promise<void> => {
    // In a real application, you would delete the product from a database or file.
    // For this example, we'll just log it to the console.
    console.log("Deleting product with id:", id);
    return Promise.resolve();
};