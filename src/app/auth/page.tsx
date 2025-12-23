"use client";

import { AuthView } from "@/components/auth/auth-view";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex-1 bg-secondary py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto flex justify-center px-4 sm:px-6 lg:px-8">
          <AuthView />
        </div>
      </div>
    </div>
  );
}
