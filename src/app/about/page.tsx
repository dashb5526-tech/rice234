
import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { About } from "@/components/sections/about";
import { getAboutContent } from "@/lib/about";

export async function generateMetadata(): Promise<Metadata> {
  const aboutContent = await getAboutContent();
  if (!aboutContent || !aboutContent.seo) {
    return {};
  }
  return {
    title: aboutContent.seo.title,
    description: aboutContent.seo.description,
    keywords: aboutContent.seo.keywords,
  };
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <About />
      </main>
      <Footer />
    </div>
  );
}
    