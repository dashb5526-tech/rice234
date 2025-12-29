
import { Gallery } from "@/components/sections/gallery";
import { Footer } from "@/components/layout/footer";

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <main className="flex-1 py-16 sm:py-20 lg:py-24">
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
