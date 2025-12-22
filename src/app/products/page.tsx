
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Products } from "@/components/sections/products";

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Products />
      </main>
      <Footer />
    </div>
  );
}
