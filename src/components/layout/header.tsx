
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { RiceBowl } from "@/components/icons";
import { cn } from "@/lib/utils";
import { getHomeContent, HomeContent } from "@/lib/home";
import Image from "next/image";


const sections = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Gallery", href: "/#gallery" },
  { name: "Contact", href: "/contact" },
];



export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    getHomeContent().then(setHomeContent);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {homeContent?.brand.logoUrl ? (
            <Image src={homeContent.brand.logoUrl} alt={homeContent.brand.name} width={40} height={40} className="h-8 w-auto flex-shrink-0 object-contain" />
          ) : (
            <RiceBowl className="h-8 w-8 flex-shrink-0 text-primary" />
          )}
        </Link>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="relative h-full flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background w-full h-full z-10 pointer-events-none md:from-transparent" />
            <div className="w-full whitespace-nowrap marquee">
              <span className="font-headline text-xl font-bold text-foreground sm:text-2xl mr-4">
                {homeContent?.brand.name || "Dash Rice"}
              </span>
              <span className="font-headline text-xl font-bold text-foreground sm:text-2xl mr-4" aria-hidden="true">
                {homeContent?.brand.name || "Dash Rice"}
              </span>
            </div>
          </div>
        </div>

        <nav className="hidden items-center justify-end gap-4 md:flex flex-shrink-0">
          {sections.map((section) => (
            <Link
              key={section.name}
              href={section.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {section.name}
            </Link>
          ))}


        </nav>

        <div className="flex items-center justify-end md:hidden flex-shrink-0">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="sr-only">
                <SheetTitle>Mobile Menu</SheetTitle>
                <SheetDescription>
                  Navigation links for the Dash Rice Traders website.
                </SheetDescription>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b pb-4">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    {homeContent?.brand.logoUrl ? (
                      <Image src={homeContent.brand.logoUrl} alt={homeContent.brand.name} width={32} height={32} className="h-8 w-auto object-contain" />
                    ) : (
                      <RiceBowl className="h-8 w-8 text-primary" />
                    )}
                    <span className="font-headline text-xl font-bold text-foreground">
                      {homeContent?.brand.name || "Dash Rice Traders"}
                    </span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="mt-8 flex flex-1 flex-col gap-6">
                  {sections.map((section) => (
                    <Link
                      key={section.name}
                      href={section.href}
                      className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {section.name}
                    </Link>
                  ))}


                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
