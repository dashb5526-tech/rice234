
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading has finished, and there is no user or the user is not an admin
    if (!loading && (!user || !isAdmin)) {
      router.replace("/admin/login"); // Redirect to the admin login page
    }
  }, [user, isAdmin, loading, router]);

  // While we are checking for authentication, we can show a loader
  if (loading || !isAdmin || !user) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Loading and verifying admin status...</p>
        </div>
    );
  }

  // If the user is an admin, render the children components
  return <>{children}</>;
}
