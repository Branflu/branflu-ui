"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { FaFacebook, FaYoutube, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import branfluWholeLogo from "@/assest/branfluWholeLogo.png";
import branfluLogo from "@/assest/branfluLogo.png";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("influencer");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8080/api/facebook/login";
  };

  const handleYouTubeLogin = () => {
    window.location.href = "http://localhost:8080/api/youtube/auth";
  };

  return isLoading ? (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Image
        src={branfluLogo}
        alt="Branflu Logo"
        width={120}
        height={120}
        className="-ml-2 mt-2 cursor-pointer hover:scale-105 transition-transform duration-300"
      />
    </div>
  ) : (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white font-sans relative overflow-auto">
      {/* Navbar */}
      <div className="w-full pl-0 pr-6 py-4 flex justify-between items-center bg-transparent absolute top-0 z-10">
        <Image
          src={branfluLogo}
          alt="Branflu Logo"
          width={50}
          height={50}
          className="mt-2 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => router.push("/")}
        />
        <div className="flex gap-4 text-sm font-medium text-white">
          <button onClick={() => router.push("/about")} className="hover:text-pink-400 transition-colors duration-300 cursor-pointer">
            About
          </button>
          <button onClick={() => router.push("/contact")} className="hover:text-pink-400 transition-colors duration-300 cursor-pointer">
            Contact
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-6 pt-16 animate-fade-in">
        {/* Left Section */}
        <div className="md:w-1/2 w-full px-4 text-left space-y-6 mb-6 md:mb-0 animate-slide-in-left">
          <Image
            src={branfluWholeLogo}
            alt="Branflu Full Logo"
            width={440}
            height={440}
            priority
          />
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mt-[-60px]">
            Discover <span className="text-pink-500">Branflu</span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            <strong>Branflu</strong> bridges the gap between creators and brands.
            Influencers can showcase their talent and get discovered, while brands
            find the perfect match to amplify their marketing through authentic content.
          </p>
        </div>

        {/* Right Card Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl w-full max-w-md animate-slide-in-right self-start mt-4">
          {/* Tab Switch */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setActiveTab("influencer")}
              className={`px-5 py-2 rounded-l-xl transition-all duration-300 ${
                activeTab === "influencer" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
              }`}
            >
              Influencer
            </button>
            <button
              onClick={() => setActiveTab("brand")}
              className={`px-5 py-2 rounded-r-xl transition-all duration-300 ${
                activeTab === "brand" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
              }`}
            >
              Brand
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[360px]">
            {activeTab === "influencer" ? (
              <div className="space-y-4 pt-2">
                <Button
                  onClick={handleFacebookLogin}
                  className="w-full bg-blue-700 text-white font-semibold text-lg py-3 flex items-center justify-center gap-2 rounded-xl hover:bg-blue-800 transition-all duration-300"
                >
                  <FaFacebook size={20} /> Continue with Facebook
                </Button>
                <Button
                  onClick={handleYouTubeLogin}
                  className="w-full bg-red-600 text-white font-semibold text-lg py-3 flex items-center justify-center gap-2 rounded-xl hover:bg-red-700 transition-all duration-300"
                >
                  <FaYoutube size={20} /> Continue with YouTube
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl outline-none placeholder:text-gray-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl outline-none placeholder:text-gray-400"
                />
                <Button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-300">
                  Login
                </Button>

                <div className="relative w-full text-center my-4">
                  <hr className="border-t border-gray-600" />
                  <span className="absolute inset-0 flex items-center justify-center text-gray-400 bg-[#1e293b] px-2 text-sm">
                    or
                  </span>
                </div>

                <Button className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 font-semibold flex items-center justify-center gap-2 transition-all duration-300">
                  <FaGoogle /> Continue with Google
                </Button>

                <div className="text-center text-sm text-gray-400 pt-2">
                  Don&apos;t have an account?{" "}
                  <button
                    className="text-blue-400 hover:underline hover:text-blue-300 transition-all duration-200"
                    onClick={() => router.push("/signup")}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
