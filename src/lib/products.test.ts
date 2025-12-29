
import { getProducts, getProductById, saveAllProducts, Product } from './products';
import productsData from './data/products.json';

// Mocking the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
    } as Response)
);

// Reset the mock before each test
beforeEach(() => {
    (fetch as jest.Mock).mockClear();
});

describe('Product functions', () => {
    // Test for getProducts
    test('getProducts should return all products with correct paths and slugs', async () => {
        const products = await getProducts();
        expect(products.length).toBe(productsData.length);
        products.forEach(product => {
            const expectedSlug = product.name.replace(/ /g, '-').toLowerCase();
            expect(product.slug).toBe(expectedSlug);
            expect(product.path).toBe(`/products/${encodeURIComponent(expectedSlug)}`);
        });
    });

    // Test for getProductById with a valid ID
    test('getProductById should return the correct product for a valid ID', async () => {
        const testProduct = productsData[0] as Product;
        const product = await getProductById(testProduct.id);
        expect(product).toBeDefined();
        expect(product?.id).toBe(testProduct.id);
        const expectedSlug = testProduct.name.replace(/ /g, '-').toLowerCase();
        expect(product?.slug).toBe(expectedSlug);
        expect(product?.path).toBe(`/products/${encodeURIComponent(expectedSlug)}`);
    });

    // Test for getProductById with an invalid ID
    test('getProductById should return undefined for an invalid ID', async () => {
        const product = await getProductById('invalid-id');
        expect(product).toBeUndefined();
    });

    // Test for saveAllProducts
    test('saveAllProducts should call fetch with the correct parameters', async () => {
        const productsToSave = await getProducts();
        await saveAllProducts(productsToSave);
        expect(fetch).toHaveBeenCalledWith('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productsToSave),
        });
    });
});
