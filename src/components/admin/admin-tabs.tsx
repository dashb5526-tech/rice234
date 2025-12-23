
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeTab } from "@/components/admin/tabs/home-tab";
import { AboutTab } from "@/components/admin/tabs/about-tab";
import { ProductsTab } from "@/components/admin/tabs/products-tab";
import { TestimonialsTab } from "@/components/admin/tabs/testimonials-tab";
import { GalleryTab } from "@/components/admin/tabs/gallery-tab";
import { CertificatesTab } from "@/components/admin/tabs/certificates-tab";
import { PartnersTab } from "@/components/admin/tabs/partners-tab";
import { ContactTab } from "@/components/admin/tabs/contact-tab";
import { SocialTab } from "@/components/admin/tabs/social-tab";
import { LegalTab } from "@/components/admin/tabs/legal-tab";
import { SeoTab } from "@/components/admin/tabs/seo-tab";
import { InquiriesTab } from "@/components/admin/tabs/inquiries-tab";
import { UsersTab } from "@/components/admin/tabs/users-tab";

export function AdminTabs() {
  return (
    <Tabs defaultValue="home">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="certificates">Certificates</TabsTrigger>
        <TabsTrigger value="partners">Partners</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="legal">Legal</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <HomeTab />
      </TabsContent>
      <TabsContent value="about">
        <AboutTab />
      </TabsContent>
      <TabsContent value="products">
        <ProductsTab />
      </TabsContent>
      <TabsContent value="testimonials">
        <TestimonialsTab />
      </TabsContent>
      <TabsContent value="gallery">
        <GalleryTab />
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
      <TabsContent value="social">
        <SocialTab />
      </TabsContent>
      <TabsContent value="legal">
        <LegalTab />
      </TabsContent>
       <TabsContent value="seo">
        <SeoTab />
      </TabsContent>
      <TabsContent value="inquiries">
        <InquiriesTab />
      </TabsContent>
      <TabsContent value="users">
        <UsersTab />
      </TabsContent>
    </Tabs>
  );
}
