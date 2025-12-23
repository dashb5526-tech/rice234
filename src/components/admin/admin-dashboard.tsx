
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { logOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AdminTabs } from "@/components/admin/admin-tabs";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/admins", label: "Manage Admins" },
  // ... other links
];

export function AdminDashboard({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { success, error } = await logOut();
    if (success) {
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/admin/login");
    } else {
      toast({ title: "Logout Failed", description: error, variant: "destructive" });
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="">Your App</span>
            </Link>
          </div>
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${pathname === link.href ? "bg-muted" : ""}`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-4">
            <Button size="sm" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4"/>
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
           <Sheet>
             <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                 <nav className="grid gap-2 text-lg font-medium">
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold mb-4"
                    >
                      Your App
                    </Link>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${pathname === link.href ? "bg-muted" : ""}`}>
                            {link.label}
                        </Link>
                    ))}
                 </nav>
                 <div className="mt-auto">
                    <Button size="sm" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        Logout
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {/* If there are no children, render the default tabs view */}
          {children || <AdminTabs/>}
        </div>
      </div>
    </div>
  )
}
