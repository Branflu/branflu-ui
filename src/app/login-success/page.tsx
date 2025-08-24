"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import branfluLogo from "@/assest/branfluLogo.png";



export default function LoginSuccess() {
  const router = useRouter();
  const [message, setMessage] = useState("Processing login...");

  
  

  useEffect(() => {
    // read token from URL (backend redirects to /login-success?token=...)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // save token to localStorage for dashboard to use
      localStorage.setItem("jwtToken", token);

      // remove token from URL for cleanliness
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      setMessage("Login successful — redirecting to dashboard...");
      // small delay so user sees a message (optional)
      setTimeout(() => {
        router.push("/influencer/dashboard");
      }, 800);
    } else {
      // No token present — redirect back to login after short delay
      setMessage("No token found. Redirecting to login...");
      setTimeout(() => {
        router.push("pages/login");
      }, 1200);
    }
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Image src={branfluLogo} alt="Branflu Logo" width={120} height={120} />
      <p className="mt-4 text-sm text-gray-300">{message}</p>
    </div>
  );
}
