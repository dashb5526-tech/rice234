
"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useEffect, useState } from "react";
import { getTermsContent, TermsContent } from "@/lib/terms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditionsPage() {
  const [content, setContent] = useState<TermsContent | null>(null);

  useEffect(() => {
    getTermsContent().then(setContent);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 bg-secondary py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="mx-auto max-w-4xl">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-center">
                        {content?.title || "Terms and Conditions"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {content ? (
                        <div 
                            className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-muted-foreground whitespace-pre-wrap"
                        >
                            {content.content}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
    
