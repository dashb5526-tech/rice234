
"use client";

import Link from "next/link";
import Image from "next/image";
import { RiceBowl, XIcon } from "@/components/icons";
import { useEffect, useState } from "react";
import { getContactInfo, ContactInfo } from "@/lib/contact-info";
import { getHomeContent, HomeContent } from "@/lib/home";
import { getSocialLinks, SocialLink } from "@/lib/social-links";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";
import { getTermsContent, TermsContent } from "@/lib/terms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";


const sections = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Contact", href: "/contact" },
];

const socialIconMap: { [key: string]: React.ReactNode } = {
  Facebook: <Facebook className="h-5 w-5" />,
  X: <XIcon className="h-5 w-5" />,
  Instagram: <Instagram className="h-5 w-5" />,
  Linkedin: <Linkedin className="h-5 w-5" />,
};

function TermsDialog({ isOpen, setIsOpen, content }: { isOpen: boolean, setIsOpen: (open: boolean) => void, content: TermsContent | null }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {content?.title || "Terms and Conditions"}
          </DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully.
          </DialogDescription>
          <DialogClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
              </Button>
          </DialogClose>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-6">
          {content ? (
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground whitespace-pre-wrap">
              {content.content}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}


export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [termsContent, setTermsContent] = useState<TermsContent | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    getContactInfo().then(setContactInfo);
    getHomeContent().then(setHomeContent);
    getSocialLinks().then(setSocialLinks);
    getTermsContent().then(setTermsContent);
  }, []);

  return (
    <>
      <footer className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
              <Link href="/" className="flex items-center gap-2">
                {homeContent?.brand.logoUrl ? (
                    <Image src={homeContent.brand.logoUrl} alt={homeContent.brand.name} width={32} height={32} className="h-8 w-auto object-contain" />
                ) : (
                    <RiceBowl className="h-8 w-8 text-primary" />
                )}
                <span className="font-headline text-2xl font-semibold">
                  {homeContent?.brand.name || "Dash Rice Traders"}
                </span>
              </Link>
               <p className="mt-4 text-sm text-muted-foreground">
                {homeContent?.brand.footerDescription}
              </p>
              <div className="mt-6 flex space-x-4">
                {socialLinks.map((link) => (
                  <Link key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                    {socialIconMap[link.icon]}
                    <span className="sr-only">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
              <div>
                <p className="font-semibold text-foreground">Company</p>
                <nav className="mt-4 flex flex-col space-y-2">
                  {sections.map((section) => (
                    <Link
                      key={section.name}
                      href={section.href}
                      className="text-sm text-muted-foreground hover:text-primary hover:underline"
                    >
                      {section.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div>
                <p className="font-semibold text-foreground">Legal</p>
                <nav className="mt-4 flex flex-col space-y-2">
                  <button
                      onClick={() => setIsTermsOpen(true)}
                      className="text-left text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                      Terms & Conditions
                  </button>
                </nav>
              </div>
              <div>
                <p className="font-semibold text-foreground">Contact</p>
                {contactInfo && (
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>{contactInfo.address}</p>
                    <p>{contactInfo.phone}</p>
                    <p>{contactInfo.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} {homeContent?.brand.name || "Dash Rice Traders"}. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <TermsDialog isOpen={isTermsOpen} setIsOpen={setIsTermsOpen} content={termsContent} />
    </>
  );
}
    
