
import { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Gallery } from "@/components/sections/gallery";
import { Products } from "@/components/sections/products";
import { About } from "@/components/sections/about";
import { Certificates } from "@/components/sections/certificates";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { getHomeContent } from "@/lib/home";

export async function generateMetadata(): Promise<Metadata> {
  const homeContent = await getHomeContent();
  if (!homeContent || !homeContent.seo) {
    return {};
  }
  return {
    title: homeContent.seo.title,
    description: homeContent.seo.description,
    keywords: homeContent.seo.keywords,
  };
}

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex-1">
        <Hero />
        <Products isHomePage={true} />
        <About />
        <Certificates />
        <Testimonials />
        <Gallery />
        <Contact />
      </div>
    </div>
  );
}
