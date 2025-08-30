"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import branfluLogo from "@/assest/branfluLogo.png";

export default function BusinessLoginSuccess() {
  const router = useRouter();
  const [message, setMessage] = useState("Processing login...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    // ✅ Try URL token first, else check localStorage
    let token = urlToken || localStorage.getItem("jwtToken");

    if (urlToken) {
      // save new token
      localStorage.setItem("jwtToken", urlToken);

      // clean URL (remove ?token=...)
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    if (token) {
      setMessage("Login successful — redirecting to dashboard...");
      setTimeout(() => {
        router.push("/business/dashboard");
      }, 800);
    } else {
      setMessage("No token found for dashboard. Redirecting to login...");
      setTimeout(() => {
        router.push("pages/login"); // ✅ fixed path (was "pages/login")
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
