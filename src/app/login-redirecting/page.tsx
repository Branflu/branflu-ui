"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import branfluLogo from "@/assest/branfluLogo.png";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      router.push("/business/dashboard"); // ✅ Redirect after delay
    }, 3000) // Simulate delay before redirect

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Image src={branfluLogo} alt="Branflu Logo" width={120} height={120} />
      <p className="mt-4 text-sm text-gray-300">Login successful, redirecting...</p>
    </div>
  );
}
