
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
import { signIn, signUp } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AuthViewProps {
    onLoginSuccess?: () => void;
}

export function AuthView({ onLoginSuccess }: AuthViewProps) {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [activeTab, setActiveTab] = useState("login");
    const { toast } = useToast();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { success, error } = await signIn(loginEmail, loginPassword);
        if (success) {
            toast({ title: "Login Successful", description: "Welcome back!" });
            if (onLoginSuccess) {
                onLoginSuccess();
            } else {
                router.push("/");
            }
        } else {
            toast({ title: "Login Failed", description: error, variant: "destructive" });
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        // The signUp function from @/lib/auth already handles user creation in firestore
        const { success, user, error } = await signUp(signupEmail, signupPassword);
        if (success && user) {
             // Create a document in the 'users' collection
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                isAdmin: false, // Default isAdmin to false
            });

            toast({ title: "Signup Successful", description: "Your account has been created. You can now log in." });
            // Switch to login tab after successful signup
            setLoginEmail(signupEmail); // pre-fill email
            setLoginPassword("");
            setSignupEmail("");
            setSignupPassword("");
            setActiveTab("login");

        } else {
            toast({ title: "Signup Failed", description: error, variant: "destructive" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Login</CardTitle>
                            <CardDescription>
                                Enter your email and password to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Sign Up</CardTitle>
                            <CardDescription>
                                Enter your email below to create an account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSignup} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="signup-email">Email</Label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="signup-password">Password</Label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        required
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Create an account
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
