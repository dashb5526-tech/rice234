
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import { submitForm } from "@/lib/actions";
import { getProducts, Product } from "@/lib/products";
import { getContactInfo, ContactInfo } from "@/lib/contact-info";
import { getContactSectionContent, ContactSectionContent } from "@/lib/contact-section";
import { useEffect, useState } from "react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

const orderFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().optional(),
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  riceType: z.string({ required_error: "Please select a rice type." }),
  quantity: z.string().regex(/^[1-9]\\d*$/, "Please enter a valid quantity."),
  message: z.string().optional(),
});

export function Contact() {
  const [products, setProducts] = useState<Product[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [sectionContent, setSectionContent] = useState<ContactSectionContent | null>(null);

  useEffect(() => {
    getProducts().then(setProducts);
    getContactInfo().then(setContactInfo);
    getContactSectionContent().then(setSectionContent);
  }, []);

  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const orderForm = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { name: "", company: "", phone: "", email: "", quantity: "", message: "" },
  });

  async function handleContactSubmit(values: z.infer<typeof contactFormSchema>) {
    const result = await submitForm({ type: 'contact', ...values });
    if (result.success) {
      toast({ title: "Message Sent!", description: "Thank you for reaching out. We'll get back to you soon." });
      contactForm.reset();
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  }

  async function handleOrderSubmit(values: z.infer<typeof orderFormSchema>) {
    const result = await submitForm({ type: 'order', ...values });
    if (result.success) {
      toast({ title: "Order Inquiry Placed!", description: "We've received your order request and will contact you shortly to confirm." });
      orderForm.reset();
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  }

  return (
    <section id="contact" className="bg-secondary py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {sectionContent?.title || "Get In Touch"}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {sectionContent?.description || "We're here to help with your inquiries and bulk orders. Reach out to us today!"}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-headline text-2xl font-semibold">Contact Information</h3>
              {contactInfo ? (
                <div className="space-y-3 text-muted-foreground">
                  <p className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> {contactInfo.address}</p>
                  <p className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /> {contactInfo.phone}</p>
                  <p className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /> {contactInfo.email}</p>
                </div>
              ) : (
                <p>Loading contact information...</p>
              )}
            </div>
            {contactInfo?.imageUrl && (
              <div className="overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={contactInfo.imageUrl}
                  alt={contactInfo.imageHint || "Contact Image"}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                  data-ai-hint={contactInfo.imageHint}
                />
              </div>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="inquiry" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="inquiry">General Inquiry</TabsTrigger>
                  <TabsTrigger value="order">Order Now</TabsTrigger>
                </TabsList>

                <TabsContent value="inquiry" className="p-6">
                  <Form {...contactForm}>
                    <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-6">
                      <FormField control={contactForm.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={contactForm.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={contactForm.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number (Optional)</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={contactForm.control} name="message" render={({ field }) => (
                        <FormItem><FormLabel>Your Message</FormLabel><FormControl><Textarea placeholder="Tell us how we can help..." className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="submit" className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={contactForm.formState.isSubmitting}>
                        {contactForm.formState.isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="order" className="p-6">
                  <Form {...orderForm}>
                    <form onSubmit={orderForm.handleSubmit(handleOrderSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField control={orderForm.control} name="name" render={({ field }) => (
                          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={orderForm.control} name="company" render={({ field }) => (
                          <FormItem><FormLabel>Company (Optional)</FormLabel><FormControl><Input placeholder="Your Company Inc." {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField control={orderForm.control} name="phone" render={({ field }) => (
                          <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={orderForm.control} name="email" render={({ field }) => (
                          <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField control={orderForm.control} name="riceType" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rice Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a rice variety" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {products.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={orderForm.control} name="quantity" render={({ field }) => (
                          <FormItem><FormLabel>Quantity (in kg)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <FormField control={orderForm.control} name="message" render={({ field }) => (
                        <FormItem><FormLabel>Additional Details</FormLabel><FormControl><Textarea placeholder="Any special requests or details..." {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="submit" className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} disabled={orderForm.formState.isSubmitting}>
                        {orderForm.formState.isSubmitting ? "Placing Order..." : "Place Order Inquiry"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
