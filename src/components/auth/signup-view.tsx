
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';

export function SignupView() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        const { success, error } = await signUp(email, password);
        if (success) {
            toast({ title: "Signup Successful", description: "You can now log in." });
            router.push("/login");
        } else {
            toast({ title: "Signup Failed", description: error, variant: "destructive" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your email below to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Create an account
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
