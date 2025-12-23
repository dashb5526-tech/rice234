
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth"; 
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function AdminLoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, loading } = useAuth(); 
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { success, error } = await signIn(email, password);

    if (success) {
      // Auth state will update via useAuth hook. 
      // The parent page /admin/login/page.tsx will handle the redirect.
      // We just need to wait for the isAdmin flag to be confirmed.
      // No immediate redirect here.
      toast({ title: "Login Successful", description: "Verifying admin status..." });
    } else {
      toast({ title: "Login Failed", description: error, variant: "destructive" });
      setIsLoading(false);
    }
  };
  
  // This view is shown when a user is logged in, but the isAdmin flag is false.
  if (!loading && !isAdmin) {
     return (
        <div className="flex items-center justify-center min-h-screen bg-background">
             <Card className="w-[400px]">
                 <CardHeader>
                     <CardTitle>Access Denied</CardTitle>
                     <CardDescription>You do not have permission to access the admin panel. Please contact an administrator if you believe this is a mistake.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     <Button onClick={() => router.push("/")} className="w-full">Go to Homepage</Button>
                 </CardContent>
            </Card>
        </div>
     )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Panel Login</CardTitle>
          <CardDescription>Enter your administrator credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
