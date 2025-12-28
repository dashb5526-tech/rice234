
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
import { OrdersTab } from "@/components/admin/tabs/orders-tab";
import { DirectCallContactsTab } from "@/components/admin/tabs/direct-call-contacts-tab";

export function AdminTabs() {
  return (
    <Tabs defaultValue="home">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
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
        <TabsTrigger value="direct-call">Direct Call</TabsTrigger>
      </TabsList>
      <TabsContent value="home" className="mt-6">
        <HomeTab />
      </TabsContent>
      <TabsContent value="about" className="mt-6">
        <AboutTab />
      </TabsContent>
      <TabsContent value="products" className="mt-6">
        <ProductsTab />
      </TabsContent>
      <TabsContent value="orders" className="mt-6">
        <OrdersTab />
      </TabsContent>
      <TabsContent value="testimonials" className="mt-6">
        <TestimonialsTab />
      </TabsContent>
      <TabsContent value="gallery" className="mt-6">
        <GalleryTab />
      </TabsContent>
      <TabsContent value="certificates" className="mt-6">
        <CertificatesTab />
      </TabsContent>
       <TabsContent value="partners" className="mt-6">
        <PartnersTab />
      </TabsContent>
      <TabsContent value="contact" className="mt-6">
        <ContactTab />
      </TabsContent>
      <TabsContent value="social" className="mt-6">
        <SocialTab />
      </TabsContent>
      <TabsContent value="legal" className="mt-6">
        <LegalTab />
      </TabsContent>
       <TabsContent value="seo" className="mt-6">
        <SeoTab />
      </TabsContent>
      <TabsContent value="inquiries" className="mt-6">
        <InquiriesTab />
      </TabsContent>
      <TabsContent value="users" className="mt-6">
        <UsersTab />
      </TabsContent>
      <TabsContent value="direct-call" className="mt-6">
        <DirectCallContactsTab />
      </TabsContent>
    </Tabs>
  );
}
