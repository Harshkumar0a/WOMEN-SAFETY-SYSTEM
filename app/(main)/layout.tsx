"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import NavBar from "../components/nav-bar";
import Footer from "../components/footer";
import SOSButton from "../components/sos-button";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect to login if the path is not the public landing page '/'
    if (!isLoading && !user && pathname !== "/") {
      router.push("/login");
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant font-label-bold text-sm">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected content before redirect
  if (!user && pathname !== "/") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <NavBar />
      {/* Add top padding to account for fixed NavBar */}
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <SOSButton />
    </div>
  );
}
