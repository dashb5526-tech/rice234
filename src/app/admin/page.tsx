
"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthView } from "@/components/auth/auth-view";

// Import new Tab components
import { HomeTab } from "@/components/admin/tabs/home-tab";
import { AboutTab } from "@/components/admin/tabs/about-tab";
import { ProductsTab } from "@/components/admin/tabs/products-tab";
import { GalleryTab } from "@/components/admin/tabs/gallery-tab";
import { TestimonialsTab } from "@/components/admin/tabs/testimonials-tab";
import { CertificatesTab } from "@/components/admin/tabs/certificates-tab";
import { PartnersTab } from "@/components/admin/tabs/partners-tab";
import { ContactTab } from "@/components/admin/tabs/contact-tab";
import { InquiriesTab } from "@/components/admin/tabs/inquiries-tab";
import { OrdersTab } from "@/components/admin/tabs/orders-tab";
import { UsersTab } from "@/components/admin/tabs/users-tab";
import { SocialTab } from "@/components/admin/tabs/social-tab";
import { LegalTab } from "@/components/admin/tabs/legal-tab";
import { SeoTab } from "@/components/admin/tabs/seo-tab";


export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-secondary">
          <Tabs defaultValue="home" className="mx-auto max-w-4xl">
            <ScrollArea className="w-full whitespace-nowrap rounded-lg">
              <TabsList className="inline-flex w-auto">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="partners">Partners</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>

            <TabsContent value="home">
              <HomeTab />
            </TabsContent>

            <TabsContent value="about">
              <AboutTab />
            </TabsContent>

            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>

            <TabsContent value="gallery">
              <GalleryTab />
            </TabsContent>

            <TabsContent value="testimonials">
              <TestimonialsTab />
            </TabsContent>

            <TabsContent value="certificates">
              <CertificatesTab />
            </TabsContent>

            <TabsContent value="partners">
              <PartnersTab />
            </TabsContent>

            <TabsContent value="contact">
              <ContactTab />
            </TabsContent>

            <TabsContent value="inquiries">
              <InquiriesTab />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>

            <TabsContent value="users">
              <UsersTab />
            </TabsContent>

            <TabsContent value="social">
              <SocialTab />
            </TabsContent>

            <TabsContent value="legal">
              <LegalTab />
            </TabsContent>

            <TabsContent value="seo">
              <SeoTab />
            </TabsContent>

          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
}
