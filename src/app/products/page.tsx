
import { Products } from "@/components/sections/products";

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex-1">
        <Products />
      </div>
    </div>
  );
}
