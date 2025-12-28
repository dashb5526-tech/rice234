'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { RiceBowl } from '@/components/icons';
import { cn } from '@/lib/utils';
import { HomeContent, getHomeContent } from '@/lib/home';
import Image from 'next/image';
import { logOut } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const sections = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchHomeContent = async () => {
      const content = await getHomeContent();
      setHomeContent(content);
    };
    fetchHomeContent();

    const handleStorageChange = () => {
      fetchHomeContent();
    };

    window.addEventListener('content-updated', handleStorageChange);
    return () => {
      window.removeEventListener('content-updated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    const { success, error } = await logOut();
    if (success) {
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/');
    } else {
      toast({ title: 'Logout Failed', description: error, variant: 'destructive' });
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          {homeContent?.brand.logoUrl ? (
            <Image src={homeContent.brand.logoUrl} alt={homeContent.brand.name} width={40} height={40} className="h-8 w-auto flex-shrink-0 object-contain" />
          ) : (
            <RiceBowl className="h-8 w-8 flex-shrink-0 text-primary" />
          )}
        </Link>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="relative h-full flex items-center">
            {/* Mobile - Marquee */}
            <div className="sm:hidden w-full">
                <div className="marquee whitespace-nowrap flex">
                    <span className="font-headline text-xl font-bold text-foreground mr-4">{homeContent?.brand.name}</span>
                    <span className="font-headline text-xl font-bold text-foreground mr-4" aria-hidden="true">{homeContent?.brand.name}</span>
                </div>
            </div>
            {/* Desktop - Static */}
            <div className="hidden sm:block w-full whitespace-nowrap">
                <span className="font-headline text-xl font-bold text-foreground sm:text-2xl truncate">
                    {homeContent?.brand.name}
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
          {user ? (
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          ) : (
            <Link href="/auth">
              <Button variant="default">Login / Sign Up</Button>
            </Link>
          )}
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
                  Navigation links for the website.
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
                      {homeContent?.brand.name}
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

                <div className="mt-auto border-t pt-4">
                  {user ? (
                     <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                        <Button variant="outline" size="sm" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>Logout</Button>
                    </div>
                  ) : (
                    <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="default" className="w-full">Login / Sign Up</Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
