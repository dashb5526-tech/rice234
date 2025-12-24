
"use client";

import { getContactInfo, ContactInfo } from "@/lib/contact-info";
import { getHomeContent, HomeContent } from "@/lib/home";
import { getSocialLinks, SocialLink } from "@/lib/social-links";
import { getTermsContent, TermsContent } from "@/lib/terms";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { RiceBowl } from "@/components/icons";
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Send } from "lucide-react";

const SocialIcon = ({ platform, url }: { platform: string, url: string }) => {
    const iconProps = { className: "w-6 h-6" };
    let icon;

    switch (platform.toLowerCase()) {
        case "facebook":
            icon = <Facebook {...iconProps} />;
            break;
        case "instagram":
            icon = <Instagram {...iconProps} />;
            break;
        case "twitter":
            icon = <Twitter {...iconProps} />;
            break;
        case "youtube":
            icon = <Youtube {...iconProps} />;
            break;
        case "linkedin":
            icon = <Linkedin {...iconProps} />;
            break;
        default:
            return null;
    }

    return <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">{icon}</a>;
};


export function Footer() {
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [termsContent, setTermsContent] = useState<TermsContent | null>(null);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const contact = await getContactInfo();
                setContactInfo(contact);

                const home = await getHomeContent();
                setHomeContent(home);

                const socials = await getSocialLinks();
                setSocialLinks(socials);

                const terms = await getTermsContent();
                setTermsContent(terms);
                
            } catch (error) {
                console.error("Failed to fetch footer data:", error);
            }
        };

        fetchFooterData();
    }, []);

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription logic here
        console.log("Newsletter submitted for:", email);
        setEmail("");
        // You would typically show a toast or message here
    };


    return (
        <footer className="bg-secondary/50 text-secondary-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {/* Brand and About */}
                    <div className="md:col-span-2 lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                            <RiceBowl className="h-8 w-8 text-primary" />
                            <span>{homeContent?.brand?.name || "Rice Bowl"}</span>
                        </Link>
                        <p className="text-muted-foreground">
                           {homeContent?.brand?.footerDescription || "Providing the highest quality rice since 1950. We are committed to excellence from our fields to your table."}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {socialLinks.map(link => (
                                <SocialIcon key={link.id} platform={link.name} url={link.url} />
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-headline font-semibold tracking-wider uppercase">Quick Links</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/#about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/#products" className="hover:text-primary transition-colors">Our Products</Link></li>
                            <li><Link href="/#certificates" className="hover:text-primary transition-colors">Certificates</Link></li>
                            <li><Link href="/#contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-headline font-semibold tracking-wider uppercase">Contact Us</h4>
                        {contactInfo ? (
                            <address className="not-italic text-muted-foreground space-y-2">
                                <p>{contactInfo.address}</p>
                                <p><strong>Phone:</strong> {contactInfo.phone}</p>
                                <p><strong>Email:</strong> {contactInfo.email}</p>
                            </address>
                        ) : <p className="text-muted-foreground">Loading...</p>}
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h4 className="font-headline font-semibold tracking-wider uppercase">Newsletter</h4>
                        <p className="text-muted-foreground">Stay updated with our latest news and offers.</p>
                        <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                            <Input 
                                type="email" 
                                placeholder="Your email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                                className="bg-background/50"
                            />
                            <Button type="submit" size="icon" variant="ghost" className="flex-shrink-0">
                                <Send className="h-5 w-5"/>
                            </Button>
                        </form>
                    </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} {homeContent?.brand?.name || "Rice Bowl"}. All Rights Reserved.</p>
                     {termsContent && (
                        <p className="mt-2">
                            <Link href={termsContent.termsUrl} className="hover:text-primary transition-colors">Terms of Service</Link>
                            <span className="mx-2">|</span>
                            <Link href={termsContent.privacyUrl} className="hover:text-primary transition-colors">Privacy Policy</Link>
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
}
