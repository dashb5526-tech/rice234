"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

interface LoginViewProps {
    onLoginSuccess: () => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
    const [password, setPassword] = useState("");
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'sbs') { // Simple hardcoded password for now
            onLoginSuccess();
            toast({
                title: "Access Granted",
                description: "Welcome to the admin panel.",
            });
        } else {
            toast({
                title: "Access Denied",
                description: "Incorrect password.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <div className="flex flex-1 items-center justify-center p-4">
                <Card className="mx-auto w-full max-w-sm">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                        <CardDescription>Enter the password to access the dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        className="pl-9"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
