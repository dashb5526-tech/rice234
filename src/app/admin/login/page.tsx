
"use client";

import { AdminLoginView } from "@/components/admin/login-view";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and user is found and is an admin, redirect to admin dashboard
    if (!loading && user && isAdmin) {
      router.replace("/admin"); // use replace so user can't go back to login page
    }
  }, [user, isAdmin, loading, router]);

  // Show a loading state while auth status is being determined
  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <p>Loading...</p>
        </div>
    );
  }
  
  // If user is not an admin, show the login view.
  return <AdminLoginView />;
}
