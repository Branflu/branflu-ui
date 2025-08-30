"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import branfluLogo from "@/assest/branfluLogo.png";

export default function LoginRedirect() {
  const router = useRouter();
  const [message, setMessage] = useState("Checking login status...");

  useEffect(() => {
    fetch(`http://localhost:8080/api/me`, {
      credentials: "include", // important: sends HTTP-only cookie
    })
      .then(async (res) => {
        if (res.ok) {
          const user = await res.json();
          setMessage("Login successful — Redirecting ...");
          setTimeout(() => {
            if (user.role === "BUSINESS") router.push("/business/dashboard");
            else if (user.role === "INFLUENCER") router.push("/influencer/dashboard");
            else router.push("pages/login"); // fallback
          }, 800);
        } else {
          setMessage("Not logged in. Redirecting to login...");
          setTimeout(() => router.push("pages/login"), 1200);
        }
      })
      .catch(() => {
        setMessage("Error verifying login. Redirecting...");
        setTimeout(() => router.push("pages/login"), 1200);
      });
  }, [router]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Image src={branfluLogo} alt="Branflu Logo" width={120} height={120} />
      <p className="mt-4 text-sm text-gray-300">{message}</p>
    </div>
  );
}
