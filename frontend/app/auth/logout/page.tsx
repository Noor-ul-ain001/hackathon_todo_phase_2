"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuthData } from "@/lib/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all auth data
    clearAuthData();

    // Redirect to home page after a brief delay
    setTimeout(() => {
      router.push("/");
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-white text-xl font-semibold">Clearing authentication data...</p>
        <p className="text-gray-400 mt-2">Redirecting to home page...</p>
      </div>
    </div>
  );
}
