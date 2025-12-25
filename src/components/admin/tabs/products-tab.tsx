"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getProducts, saveAllProducts, Product } from "@/lib/products";
import { getProductsSection, saveProductsSection, ProductsSection } from "@/lib/products-section";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, Image as ImageIcon, Search } from "lucide-react";
import { ProductEditDialog } from "@/components/admin/product-edit-dialog";
import { ProductsSectionEditDialog } from "@/components/admin/products-section-edit-dialog";

export function ProductsTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productsSection, setProductsSection] = useState<ProductsSection | null>(null);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isProductsSectionDialogOpen, setIsProductsSectionDialogOpen] = useState(false);
    const [productSearchTerm, setProductSearchTerm] = useState("");
    const { toast } = useToast();

    const fetchData = async () => {
        try {
            const productsData = await getProducts();
            setProducts(productsData);
            const sectionData = await getProductsSection();
            setProductsSection(sectionData);
        } catch (error) {
            console.error("Failed to fetch products data", error);
            toast({
                title: "Error",
                description: "Failed to load products data.",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleProductSave = async (productData: Omit<Product, 'id'>, id: string, selectedFile: File | null) => {
        try {
            let finalImageUrl = productData.imageUrl;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                if (response.ok) {
                    const result = await response.json();
                    finalImageUrl = result.imageUrl;
                } else {
                    throw new Error('Image upload failed');
                }
            }

            const newProduct: Product = { ...productData, id, imageUrl: finalImageUrl };

            const updatedProducts = [...products];
            const productIndex = updatedProducts.findIndex(p => p.id === id);

            if (productIndex > -1) {
                updatedProducts[productIndex] = newProduct;
            } else {
                updatedProducts.push(newProduct);
            }

            await saveAllProducts(updatedProducts);
            setProducts(updatedProducts);
            setIsProductDialogOpen(false);
            toast({ title: "Product Saved", description: "The product has been successfully saved." });
            window.dispatchEvent(new CustomEvent('content-updated'));
        } catch (error) {
            console.error("Failed to save product", error);
            toast({ title: "Save Failed", description: "Could not save the product.", variant: "destructive" });
        }
    };

    const handleProductDelete = async (id: string) => {
        try {
            const updatedProducts = products.filter(p => p.id !== id);
            await saveAllProducts(updatedProducts);
            setProducts(updatedProducts);
            toast({ title: "Product Deleted", description: "The product has been removed." });
            window.dispatchEvent(new CustomEvent('content-updated'));
        } catch (error) {
            toast({ title: "Delete Failed", description: "Could not delete the product.", variant: "destructive" });
        }
    };

    const handleProductsSectionSave = async (content: ProductsSection) => {
        try {
            await saveProductsSection(content);
            fetchData(); // Refetch data
            setIsProductsSectionDialogOpen(false);
            toast({ title: "Section Updated", description: "Products section content saved." });
            window.dispatchEvent(new CustomEvent('content-updated'));
        } catch (error) {
            toast({ title: "Save Failed", description: "Could not save section content.", variant: "destructive" });
        }
    };

    const openProductDialogForNew = () => {
        setEditingProduct(null);
        setIsProductDialogOpen(true);
    };

    const openProductDialogForEdit = (product: Product) => {
        setEditingProduct(product);
        setIsProductDialogOpen(true);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(productSearchTerm.toLowerCase())
    );

    return (
        <div className="pt-6">
            <Card>
                <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-2xl">
                            Product Management
                        </CardTitle>
                        <CardDescription>
                            Add, edit, or remove products from your store.
                        </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={() => setIsProductsSectionDialogOpen(true)} className="w-full sm:w-auto" variant="outline" disabled={!productsSection}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Section Text
                        </Button>
                        <Button onClick={openProductDialogForNew} className="w-full sm:w-auto" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products by name or description..."
                            value={productSearchTerm}
                            onChange={(e) => setProductSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="hidden sm:table-cell">Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {product.imageUrl ? (
                                                <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded-sm object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-sm">
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <span>{product.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden text-muted-foreground sm:table-cell">{product.description}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => openProductDialogForEdit(product)}>
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleProductDelete(product.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <ProductEditDialog
                isOpen={isProductDialogOpen}
                setIsOpen={setIsProductDialogOpen}
                product={editingProduct}
                onSave={handleProductSave}
            />

            {productsSection && (
                <ProductsSectionEditDialog
                    isOpen={isProductsSectionDialogOpen}
                    setIsOpen={setIsProductsSectionDialogOpen}
                    content={productsSection}
                    onSave={handleProductsSectionSave}
                />
            )}
        </div>
    );
}
