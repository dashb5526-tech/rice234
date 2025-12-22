import { Product } from '@/lib/types';
import productsData from '@/lib/data/products.json';

export type { Product };

// This function now simulates fetching from a local source.
// In a real file-based backend, this would read from products.json via an API route.
export async function getProducts(): Promise<Product[]> {
    try {
        const baseUrl = typeof window === 'undefined'
            ? (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:9002')
            : '';
        const response = await fetch(`${baseUrl}/api/products`);

        if (!response.ok) {
            console.error("API fetch failed, falling back to local import.");
            return productsData as Product[];
        }
        const data = await response.json();
        return data as Product[];
    } catch (error) {
        console.error("Error fetching products from API, falling back to local import:", error);
        return productsData as Product[];
    }
}


// This function would send data to an API route to be saved.
export async function saveProduct(product: Product): Promise<void> {
    // This is a simplified example. A real implementation would need a full list.
    // For now, we'll just log it. The admin panel needs a more robust API.
    console.log("Simulating saving product:", product);
    // In a real scenario, you'd fetch all products, find and update one, and save the whole file.
    // This is complex and best handled by a proper backend or a more sophisticated API structure.
    const allProducts = await getProducts();
    const index = allProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
        allProducts[index] = product;
    } else {
        allProducts.push(product);
    }
    await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allProducts),
    });
}

// This function would send a delete request to an API route.
export async function deleteProduct(productId: string): Promise<void> {
    const allProducts = await getProducts();
    const updatedProducts = allProducts.filter(p => p.id !== productId);
    await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProducts),
    });
}
