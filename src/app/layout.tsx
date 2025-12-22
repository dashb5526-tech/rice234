
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import { WhatsAppFAB } from "@/components/layout/whatsapp-fab";
import "./globals.css";
import { getSeoContent } from "@/lib/seo";


export async function generateMetadata(): Promise<Metadata> {
  const seoContent = await getSeoContent();

  if (!seoContent) {
    return {
      title: "Dash Rice Traders",
      description: "A trusted rice trading and distribution company providing high-quality rice varieties.",
    }
  }

  return {
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {children}
        <WhatsAppFAB />
        <Toaster />
      </body>
    </html>
  );
}

